import {
    IsString,
} from "class-validator";

export class ReserveInfoDto {
    @IsString()
    room_no: number;

    @IsString()
    building_location: string;
}
