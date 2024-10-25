import {
    IsNotEmpty,
    IsNumber,
    IsString,
} from "class-validator";
import {
    Transform,
} from "class-transformer";

export class UserSigninRequestDto {
    @IsNotEmpty()
    @IsNumber()
    @Transform(({
        value, 
    }) => parseInt(value, 10))  // 문자열을 숫자로 변환
    studentId: number;

    @IsNotEmpty()
    @IsString()
    password: string;
}
