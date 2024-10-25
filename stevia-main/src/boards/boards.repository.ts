import {
    BadRequestException, Injectable,
} from '@nestjs/common';
import {
    PrismaService,
} from '../prisma/prisma.service';

@Injectable()
export class BoardsRepository {
    constructor(private readonly prismaService: PrismaService) {
    }

    // 강의실 존재 여부 확인
    async checkRoomExists(roomId: string): Promise<void> {
        const room = await this.prismaService.building_room.findUnique({
            where: {
                id: roomId,
            },
        });

        if (!room)
            throw new BadRequestException("해당 강의실은 존재하지 않습니다.");
    }

    // 학번을 통해 학생 정보 가져오기
    async getStudentByStudentNo(studentNo: number) {
        const student = await this.prismaService.user.findUnique({
            where: {
                student_id: studentNo,
            },
        });

        if (!student) {
            throw new BadRequestException('해당 사용자는 없습니다.');
        } else {
            return student;
        }
    }

    // 강의실 예약
    async createRoomReservation(usageTime: string, roomId: string, reserverId: string) {
        return this.prismaService.reservation.create({
            data: {
                usage_time: usageTime,
                reserve_time: new Date(),
                room_id: roomId,
                reserver_id: reserverId,
            },
        });
    };

    // 강의실 정보 반환
    async getRoomByRoomId(roomId: string) {
        const room = await this.prismaService.building_room.findUnique({
            where: {
                id: roomId,
            },
        });

        if (!room) {
            throw new BadRequestException("해당 강의실은 존재하지 않습니다.");
        } else {
            return {
                buildingLocation: room.building_location,
                buildingName: room.building_name,
                roomNo: room.room_no,
                roomImageUrl: room.room_image_url,
            };
        }
    }

    // 해당 강의실의 예약 시간 반환
    async getRoomReservedTimes(roomId: string) {
        // Example: [{usage_time: "9,10,11"}, {usage_time: "15,16"}]
        const reservedTimes = await this.prismaService.reservation.findMany({
            where: {
                room_id: roomId,
            },
            select: {
                usage_time: true,
            },
        });

        // "9,10,11,15,16"
        const mergedReservedTimes = reservedTimes.map(reservedTime => reservedTime.usage_time.replace(/\s+/g, '')).join(",");

        return {
            reservedTimes: mergedReservedTimes,
        };
    }

    // 학생의 강의실 예약 정보 조회
    getReservationInfoByReserverId(reserverId: string) {
        return this.prismaService.reservation.findFirst({
            where: {
                reserver_id: reserverId,
            },
        });
    }

    // 기본 강의실 목록 반환
    async getDefaultRoomList(buildingLocation: string = "N3"):Promise<{roomId: string, roomNo: number}[]> {
        const defaultRoomList = await this.prismaService.building_room.findMany({
            where: {
                building_location: buildingLocation,
            },
            select: {
                id: true,
                room_no: true,
            },
        });

        return defaultRoomList.map(room => ({
            roomId: room.id,
            roomNo: room.room_no,
        }));
    }

    async getOtherBuildingList(): Promise<string[]> {
        const otherBuildingList = await this.prismaService.building_room.findMany({
            select: {
                building_location: true,
            },
            distinct: ['building_location',],
            orderBy: {
                building_location: 'asc',
            },
        });

        return otherBuildingList.map(obj => obj.building_location);
    }

    async getRoomList(buildingLocation: string) {
        const roomList = await this.prismaService.building_room.findMany({
            where: {
                building_location: buildingLocation,
            },
            select: {
                id: true,
                room_no: true,
            },
        });

        return roomList.map(room => ({
            roomId: room.id,
            roomNo: room.room_no,
        }));
    }

    // 강의실 예약 비율 구하기
    async getReservationRate(roomId: string) {
        const reservedTimes = await this.getRoomReservedTimes(roomId);

        if (reservedTimes.reservedTimes === "") {
            return 0;
        }

        const reservedTimesArray = reservedTimes.reservedTimes.split(',');

        const sumTimes = 9;

        const countedTimes = reservedTimesArray.length;

        return Math.round((countedTimes / sumTimes) * 100);
    }
}
