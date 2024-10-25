import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
} from "@nestjs/common";
import { DropKeyRequestDto } from "./dtos/drop-key.request.dto";
import { DropKeyResponseDto } from "./dtos/drop-key.response.dto";
import { KeyStatusResponseDto } from "./dtos/key.status.response.dto";
import { TakeKeyRequestDto } from "./dtos/take-key.request.dto";
import { TakeKeyResponseDto } from "./dtos/take-key.response.dto";
import { KeyService } from "./key.service";

@Controller("/api")
export class KeyController {
  constructor(private readonly keyService: KeyService) {}

  @Get("/keys")
  async keyStatus(
    @Query("roomNo") roomNo: string,
    @Query("buildingLocation") buildingLocation: string,
  ): Promise<KeyStatusResponseDto> {
    try {
      return await this.keyService.keyStatus(roomNo, buildingLocation);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post("/take-key")
  async takeKey(
    @Body() takeKeyRequestDto: TakeKeyRequestDto,
  ): Promise<TakeKeyResponseDto> {
    try {
      await this.keyService.checkDatabaseBeforeTakeKey(takeKeyRequestDto);
      await this.keyService.publish(
        `stevia-mqtt/hbnu/request/lock/${takeKeyRequestDto.building_location}${takeKeyRequestDto.room_no}`,
        "on",
      );
      return await this.keyService.takeKeyUpdateDb(takeKeyRequestDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post("/drop-key")
  async dropKey(
    @Body() dropKeyRequestDto: DropKeyRequestDto,
  ): Promise<DropKeyResponseDto> {
    try {
      await this.keyService.publish(
        `stevia-mqtt/hbnu/request/key/${dropKeyRequestDto.building_location}${dropKeyRequestDto.room_no}`,
        "req",
      );

      // message 수신을 위한 delay 추가
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const rfidSerialNo: string = await this.keyService.getMessage();

      console.info(rfidSerialNo === "No NFC card detected");

      if (rfidSerialNo === "No NFC card detected") {
        throw new NotFoundException("Key Not Exists");
      }

      await this.keyService.dropKeyExistCheck(dropKeyRequestDto, rfidSerialNo);

      await this.keyService.publish(
        `stevia-mqtt/hbnu/request/door/${dropKeyRequestDto.building_location}${dropKeyRequestDto.room_no}`,
        "req",
      );

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const doorStatusMessage: string = await this.keyService.getMessage();

      if (doorStatusMessage === "Door Not Closed") {
        throw new NotFoundException("Door Not Closed");
      }

      return await this.keyService.dropKeyUpdateDb(rfidSerialNo);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get("/mqtt/key")
  async keyRequest(): Promise<string> {
    await this.keyService.publish("stevia-mqtt/hbnu/request/key", "req");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return this.keyService.getMessage();
  }

  @Get("/mqtt/door")
  async doorRequest(): Promise<string> {
    await this.keyService.publish("stevia-mqtt/hbnu/request/door", "req");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return this.keyService.getMessage();
  }

  @Get("/mqtt/lock")
  async lockRequest(): Promise<string> {
    await this.keyService.publish("stevia-mqtt/hbnu/request/lock", "on");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return this.keyService.getMessage();
  }

  @Get("/mqtt/message")
  async messageRequest(): Promise<string> {
    return await this.keyService.getMessage();
  }
}
