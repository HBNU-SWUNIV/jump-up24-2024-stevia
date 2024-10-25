import {
    Body,
    Controller,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import {
    UsersService,
} from "./users.service";
import {
    UserSigninRequestDto,
} from "./dtos/user.signin.request.dto";
import {
    UserChangePasswordRequestDto,
} from "./dtos/user.changePassword.request.dto";
import {
    AccessTokenGuard, 
} from "../auth/guard/bearer-token.guard";

@Controller("stevia/api/users")
export class UsersController {
    constructor(private readonly userService: UsersService) {
    }

    // 회원가입
    @Post()
    async signup(): Promise<any> {
        return "회원가입";
    }

    // 로그인
    @Post("/signin")
    async signIn(@Body() signInDto: UserSigninRequestDto): Promise<any> {
        return await this.userService.signInUser(signInDto);
    }

    // 비밀번호 수정
    @Patch("/:userId")
    @UseGuards(AccessTokenGuard)
    async resetPassword(
        @Param("userId") userId: number,
        @Body() userChangePasswordRequestDto:UserChangePasswordRequestDto
    ): Promise<string> {
        return await this.userService.changePassword(userId,userChangePasswordRequestDto);
    };
}
