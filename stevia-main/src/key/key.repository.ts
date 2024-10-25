import {
    HttpException,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import {
    PrismaService,
} from "../prisma/prisma.service";
import {
    isUUID,
} from "class-validator";
import axios from "axios";
import {
    ReserveInfoDto,
} from "./dto/reserveInfo.dto";

@Injectable()
export class KeyRepository {
    constructor(private readonly prismaService: PrismaService) {
    }

    // main 에서 comm 으로 get 요청 보내기
    async currentKey(reserveId: string): Promise<any> {
        try {
            const reserveInfo: ReserveInfoDto = await this.returnReserveInfo(reserveId);

            if (!reserveInfo) {
                return new Error("예약 정보를 줄 수 없습니다.");
            }

	    console.log("hi");

            const response = await axios.get("http://192.168.30.63:3002/api/keys", {
                params: {
                    roomNo: reserveInfo.room_no,
                    buildingLocation: reserveInfo.building_location,
                },
            });

            return response.data;
        } catch (error) {
            // eslint-disable-next-line
            console.error("현재 키 error:", error.message);
            throw error;
        }
    }

    // main 에서 comm 으로 post 요청 보내기
    async rentalKey(reserveId: string): Promise<any> {
        try {
            const reserveInfo: ReserveInfoDto = await this.returnReserveInfo(reserveId);

            if (!reserveInfo) {
                return new Error("예약 정보를 줄 수 없습니다.");
            }
            const response = await axios.post("http://192.168.30.63:3002/api/take-key", reserveInfo);

            return response.data;
        } catch (error) {
            // eslint-disable-next-line
            console.error("키 대여 error:", error.message);
            throw error;
        }
    }

    // main 에서 comm 으로 delete 요청 보내기
    async dropKey(reserveId: string): Promise<any> {
        try {
            const reserveInfo: ReserveInfoDto = await this.returnReserveInfo(reserveId);

            if (!reserveInfo) {
                throw new Error("예약 정보를 줄 수 없습니다.");
            }

            const response = await axios.post(
                "http://192.168.30.63:3002/api/drop-key", reserveInfo
            );

            await this.prismaService.reservation.delete({
                where: {
                    id: reserveId,
                },
            });

            return response.data;
        } catch (error) {
            // eslint-disable-next-line
            console.error("키 반납 error:", error.message);
            throw error;
        }
    }

    // 예약된 건물과 방 번호 정보
    async returnReserveInfo(reserveId: string): Promise<ReserveInfoDto> {
        try {
            const isValid = await this.checkReserveId(reserveId);

            if (!isValid) {
                throw new Error("해당 예약 ID는 잘못된 ID 입니다.");
            }

            const reservation = await this.prismaService.reservation.findUnique({
                where: {
                    id: reserveId,
                },
                select: {
                    room_id: true,
                },
            });

            if (!reservation) {
                throw new Error("예약을 찾을 수 없습니다.");
            }

            const buildingRoom = await this.prismaService.building_room.findUnique({
                where: {
                    id: reservation.room_id,
                },
                select: {
                    room_no: true,
                    building_location: true,
                },
            });

            if (!buildingRoom) {
                throw new Error("예약된 건물과 방을 찾지 못했습니다.");
            }

            return {
                room_no: buildingRoom.room_no,
                building_location: buildingRoom.building_location,
            };
        } catch (error) {
            throw error;
        }
    }

    // 예약 아이디 여부 확인
    async checkReserveId(reserveId: string): Promise<boolean> {
        // UUID 형식이 맞는지 확인
        if (!isUUID(reserveId)) {
            throw new HttpException("reserveId 형식이 올바르지 않습니다.", HttpStatus.NOT_FOUND);
        }

        const result = await this.prismaService.reservation.findUnique({
            where: {
                id: reserveId,
            },
        });

        // 예약 내역이 없을 경우 Error
        if (!result) {
            throw new HttpException("예약 내역이 없습니다.", HttpStatus.NOT_FOUND);
        }

        return !!result;
    }

}
