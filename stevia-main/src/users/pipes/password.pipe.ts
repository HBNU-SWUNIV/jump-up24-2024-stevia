import {
    PipeTransform,
    Injectable,
    BadRequestException,
} from "@nestjs/common";

@Injectable()
export class PasswordPipe implements PipeTransform {
    transform(value: string): string {
        if (value.length < 9 || value.length > 25) {
            throw new BadRequestException("비밀번호는 9자리 이상 25자리 이하이어야 합니다.");
        }

        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        if (!hasUpperCase || !hasLowerCase || !hasSpecialChar) {
            throw new BadRequestException("비밀번호는 영문 대/소문자와 특수문자를 포함해야 합니다.");
        }

        return value;
    }
}
