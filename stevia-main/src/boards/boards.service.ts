import {
    Injectable, 
} from '@nestjs/common';
import {
    BoardsRepository, 
} from './boards.repository';
import {
    ReserveRoomDto, 
} from './dtos/boards.dto';

@Injectable()
export class BoardsService {
    constructor(private readonly boardsRepository: BoardsRepository) {
    }

    // reserveRoom() 강의실 예약
    async reserveRoom(reserveRoomDto: ReserveRoomDto, studentNo: number): Promise<{reserveId: string}> {
        const {
            usageTime, roomId,
        } = reserveRoomDto;

        // 강의실 존재 여부 확인
        await this.boardsRepository.checkRoomExists(roomId);

        // 예약하는 학생의 정보 가져오기
        const student = await this.boardsRepository.getStudentByStudentNo(studentNo);

        // 예약
        const reserve = await this.boardsRepository.createRoomReservation(usageTime, roomId, student.id);

        // 예약 아이디 값 반환
        return {
            reserveId: reserve.id,
        };
    }

    // 강의실 시간표 조회
    async getRoomTimetable(roomId: string) {
        // 강의실 존재 여부 확인
        await this.boardsRepository.checkRoomExists(roomId);

        // 강의실 정보 가져오기
        const room = await this.boardsRepository.getRoomByRoomId(roomId);

        // 해당 강의실의 예약 정보 가져오기
        const reservedTimes = await this.boardsRepository.getRoomReservedTimes(roomId);

        return {
            ...room,             // 강의실 정보
            ...reservedTimes,    // 해당 강의실 예약 정보
        };
    }

    // 현황판 조회
    async getBoards(studentNo: number) {
        // 기본 건물의 강의실 목록 가져오기
        const defaultRoomList =  await this.boardsRepository.getDefaultRoomList();

        // 기본 건물의 각 강의실 예약 비율 가져오기
        const reservationRatePromises = defaultRoomList.map(room => this.boardsRepository.getReservationRate(room.roomId));

        const reservationRate = await Promise.all(reservationRatePromises);

        // 강의실 정보와 예약 비율 조합
        const combinedList = defaultRoomList.map((room, index) => {
            return {
                ...room,
                reservationRate: reservationRate[index],
            };
        });

        const defaultBuildingAndRooms = {
            buildingLocation: "N3",
            roomList: combinedList,
        };

        // 다른 건물의 정보 가져오기
        const otherBuildingList = await this.boardsRepository.getOtherBuildingList();

        // 학생의 예약 정보 가져오기
        const reservationInfo = await this.getStudentReservationInfo(studentNo);

        return {
            buildingAndRoomList: defaultBuildingAndRooms,
            otherBuildingList: otherBuildingList,
            reservationInfo: reservationInfo,
        };
    }

    // 예약자, 예약 정보 가져오기
    async getStudentReservationInfo(studentNo: number) {
        // 학생 정보 가져오기
        const student = await this.boardsRepository.getStudentByStudentNo(studentNo);

        // 학생이 예약한 예약 정보 가져오기
        const reservation = await this.boardsRepository.getReservationInfoByReserverId(student.id);

        let reservationInfo;

        if (!reservation) {
            reservationInfo = {
                reservationStatus: false,
            };
        } else {
            const room = await this.boardsRepository.getRoomByRoomId(reservation.room_id);

            reservationInfo = {
                name: student.name,
                buildingLocation: room.buildingLocation,
                roomNo: room.roomNo,
                usageTime: reservation.usage_time,
                reservationStatus: true,
            };
        }

        return reservationInfo;
    }

    // 현황판 상세 조회
    async getBoardByBuildingLocation(buildingLocation: string) {
        // 건물에 해당하는 강의실 목록 가져오기
        const roomList = await this.boardsRepository.getRoomList(buildingLocation);

        const reservationRatePromises = roomList.map(room => this.boardsRepository.getReservationRate(room.roomId));

        const reservationRate = await Promise.all(reservationRatePromises);

        const combinedList = roomList.map((room, index) => {
            return {
                ...room,
                reservationRate: reservationRate[index],
            };
        });

        return {
            buildingLocation,
            roomList: combinedList,
        };
    }
}
