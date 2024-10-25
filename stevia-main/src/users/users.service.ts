import {
    Injectable,
} from "@nestjs/common";
import {
    UserSigninRequestDto,
} from "./dtos/user.signin.request.dto";
import {
    UsersRepository,
} from "./users.repository";
import {
    AuthService,
} from "../auth/auth.service";
import {
    UserChangePasswordRequestDto,
} from "./dtos/user.changePassword.request.dto";

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UsersRepository,
        private readonly authService: AuthService) {
    }

    // 로그인
    async signInUser(signInDto: UserSigninRequestDto): Promise<any> {
        // 기존 로그인 로직
        // return this.userRepository.signInUser(signInDto);

        // JWT 로그인 로직
        return await this.authService.signInWithStudentIdAndPassword(signInDto);
    }

    // 비밀번호 수정
    async changePassword(userId: number, userChangePasswordRequestDto: UserChangePasswordRequestDto): Promise<string> {
        return this.userRepository.changePassword(userId, userChangePasswordRequestDto);
    }

    // async getUserByStudentId(studentId: number):Promise<any> {
    //     return this.userRepository.getUserByStudentId(studentId);
    // }

}
