import {
    IsNotEmpty,
} from "class-validator";

export class UserChangePasswordRequestDto {
    // @IsNotEmpty()
    // userId: number;

    @IsNotEmpty()
    currentPassword: string;

    @IsNotEmpty()
    newPassword: string;
}
