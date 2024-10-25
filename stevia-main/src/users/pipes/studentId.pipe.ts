import {
    PipeTransform,
    Injectable,
    BadRequestException,
} from "@nestjs/common";

@Injectable()
export class StudentIdPipe implements PipeTransform {
    transform(value: string): string {
        if (value.length < 8) {
            throw new BadRequestException("비밀번호는 최소 8자 이상이어야 합니다.");
        } else if (!/^\d+$/.test(value)) {
            throw new BadRequestException("비밀번호는 숫자로만 구성되어야 합니다.");
        }

        return value;
    }
}
