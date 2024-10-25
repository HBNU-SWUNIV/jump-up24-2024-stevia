import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    UseGuards,
    Request,
} from "@nestjs/common";
import {
    BoardsService,
} from "./boards.service";
import {
    AccessTokenGuard,
} from "../auth/guard/bearer-token.guard";
import {
    UsageTimePipe,
} from "./pipes/usage-time.pipe";

@Controller("stevia/api/boards")
export class BoardsController {
    constructor(private readonly boardsService: BoardsService
    ) {
    }

    // 강의실 예약
    @Post("/reservation/:roomId")
    @UseGuards(AccessTokenGuard)
    async createRoomReservation(@Request() request: any,
                                @Param('roomId', ParseUUIDPipe) roomId: string,
                                @Body('usageTime', UsageTimePipe) usageTime: string): Promise<{reserveId: string}> {

        // request 객체에서 studentNo(학번) 가져오기(token payload의 sub 속성)
        const studentNo = request.studentNo;

        const reserveRoomDto = {
            roomId,
            usageTime,
        };

        return await this.boardsService.reserveRoom(reserveRoomDto, studentNo);
    }

  // 강의실 시간표 조회
  @Get('/timetable/:roomId')
  @UseGuards(AccessTokenGuard)
    async getRoomTimetable(@Param('roomId', ParseUUIDPipe) roomId: string) {
        return await this.boardsService.getRoomTimetable(roomId);
    }

    // 현황판 조회
    @Get()
    @UseGuards(AccessTokenGuard)
  getBoards(@Request() request: any) {
      const studentNo = request.studentNo;

      return this.boardsService.getBoards(studentNo);
  }

  // 현황판 상세 조회
  @Get(':buildingLocation')
  @UseGuards(AccessTokenGuard)
    getBoardByBuildingLocation(@Param('buildingLocation') buildingLocation: string) {
        return this.boardsService.getBoardByBuildingLocation(buildingLocation);
    }
}
