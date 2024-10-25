import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { MqttClient, connect } from "mqtt";
import { DOOR_STATUS } from "./dtos/door.status.enum";
import { DropKeyRequestDto } from "./dtos/drop-key.request.dto";
import { DropKeyResponseDto } from "./dtos/drop-key.response.dto";
import { KEY_STATUS } from "./dtos/key.status.enum";
import { KeyStatusResponseDto } from "./dtos/key.status.response.dto";
import { TakeKeyRequestDto } from "./dtos/take-key.request.dto";
import { TakeKeyResponseDto } from "./dtos/take-key.response.dto";

const prisma = new PrismaClient();

@Injectable()
export class KeyService {
  public readonly mqtt: MqttClient;
  private message: string;

  constructor() {
    this.mqtt = connect("mqtt://broker.emqx.io:1883", {
      connectTimeout: 5000,
    });

    this.mqtt.on("connect", () => {
      console.info("Connected to MQTT broker");
      this.mqtt.subscribe("stevia-mqtt/hbnu/response/#", (err) => {
        if (err) {
          console.error(`Failed to subscribe: ${err.message}`);
        } else {
          console.info("Subscribed to topic: stevia-mqtt/hbnu/response/#");
        }
      });
    });

    this.mqtt.on("message", (topic, message) => {
      const messageContent = message.toString();
      console.info(`Received message on topic '${topic}': ${messageContent}`);
      this.message = messageContent;
    });

    this.mqtt.on("error", (err) => {
      console.error(`MQTT error: ${err.message}`);
    });

    this.mqtt.on("offline", () => {
      console.info("MQTT client went offline");
    });

    this.mqtt.on("reconnect", () => {
      console.info("Reconnecting to MQTT broker");
    });
  }

  async publish(topic: string, payload: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.mqtt.publish(topic, payload, (err) => {
        if (err) {
          reject(`Failed to publish message: ${err.message}`);
        } else {
          resolve(payload);
        }
      });
    });
  }

  async getMessage(): Promise<string> {
    return this.message;
  }

  async checkDatabaseBeforeTakeKey(
    takeKeyRequestDto: TakeKeyRequestDto,
  ): Promise<void> {
    const rfidSerialNo = await this.findKey(
      takeKeyRequestDto.room_no,
      takeKeyRequestDto.building_location,
    );

    const keyStatus = await this.checkDBKeyStatus(rfidSerialNo);

    if (keyStatus === KEY_STATUS.NOT_EXIST) {
      throw new NotFoundException("Key Not Exist");
    }
  }

  async takeKeyUpdateDb(
    takeKeyRequestDto: TakeKeyRequestDto,
  ): Promise<TakeKeyResponseDto> {
    const rfidSerialNo = await this.findKey(
      takeKeyRequestDto.room_no,
      takeKeyRequestDto.building_location,
    );

    await prisma.status.create({
      data: {
        rfidSerialNo: rfidSerialNo,
        keyStatus: KEY_STATUS.NOT_EXIST,
        doorStatus: DOOR_STATUS.OPEN,
      },
    });

    return {
      image_status: false,
    };
  }

  async dropKeyExistCheck(
    dropKeyRequestDto: DropKeyRequestDto,
    scannedRfidSerialNo: string,
  ): Promise<void> {
    const rfidSerialNo = await this.findKey(
      dropKeyRequestDto.room_no,
      dropKeyRequestDto.building_location,
    );

    if (scannedRfidSerialNo.trim() !== rfidSerialNo) {
      throw new NotFoundException("Wrong Key Exists");
    }
  }

  async dropKeyUpdateDb(
    scannedRfidSerialNo: string,
  ): Promise<DropKeyResponseDto> {
    await prisma.status.create({
      data: {
        rfidSerialNo: scannedRfidSerialNo.trim(),
        keyStatus: KEY_STATUS.EXIST,
        doorStatus: DOOR_STATUS.CLOSE,
      },
    });

    return {
      image_status: true,
    };
  }

  async keyStatus(
    roomNo: string,
    buildingLocation: string,
  ): Promise<KeyStatusResponseDto> {
    const rfidSerialNo = await this.findKey(roomNo, buildingLocation);

    const keyStatus = await this.checkDBKeyStatus(rfidSerialNo);

    if (keyStatus === KEY_STATUS.NOT_EXIST) {
      return {
        image_status: false,
      };
    }

    if (keyStatus === KEY_STATUS.EXIST) {
      return {
        image_status: true,
      };
    }

    throw new NotFoundException("Key Status Check Error");
  }

  async findKey(roomNo: string, buildingLocation: string): Promise<string> {
    const rfidSerialNo = await prisma.key.findFirst({
      where: {
        roomNo: Number(roomNo),
        buildingLocation: buildingLocation,
      },
      select: {
        rfidSerialNo: true,
      },
    });

    if (!rfidSerialNo) {
      throw new NotFoundException("Key Not Found");
    }

    return rfidSerialNo.rfidSerialNo;
  }

  async checkDBKeyStatus(rfidSerialNo: string) {
    const keyStatus = await prisma.status.findFirst({
      where: {
        rfidSerialNo: rfidSerialNo,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        keyStatus: true,
      },
    });

    if (!keyStatus) {
      throw new NotFoundException("Key Status Check Error");
    }

    return keyStatus.keyStatus;
  }

  async checkDBDoorStatus(rfidSerialNo: string) {
    const keyStatus = await prisma.status.findFirst({
      where: {
        rfidSerialNo: rfidSerialNo,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        doorStatus: true,
      },
    });

    if (!keyStatus) {
      throw new NotFoundException("Door Status Check Error");
    }

    return keyStatus.doorStatus;
  }
}
