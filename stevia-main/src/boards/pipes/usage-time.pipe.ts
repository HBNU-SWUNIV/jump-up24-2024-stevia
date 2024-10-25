import {
    BadRequestException, Injectable, PipeTransform,
} from "@nestjs/common";

/**
 * UsageTimePipe(강의실 이용 시간) 시나리오
 * 1. 받아온 데이터의 공백을 없앤다. -> "9, 10, 11" => "9,10,11"
 * 2. 강의실 이용 시간을 숫자 요소로 빼내어 배열로 저장한다.
 * 3. 요소의 수가 3개 이하인지 판별한다.
 * 4. 요소의 수가 0개 인지 판별한다.
 *
 */

@Injectable()
export class UsageTimePipe implements PipeTransform {
    transform(value: any): string {
        if (typeof value !== 'string') {
            throw new BadRequestException('Invalid data type');
        }

        if (value.trim() === '') {
            throw new BadRequestException('강의실 이용 시간을 입력해주세요.');
        }

        const usageTimeArray = value.replace(/\s+/g, '').split(',').map(Number);

        if (usageTimeArray.length > 3) {
            throw new BadRequestException('강의실 이용 시간은 1시간 이상 3시간 이하로 가능합니다.');
        }

        if (usageTimeArray.map(usageTime => usageTime >= 9 && usageTime <= 17).includes(false)) {
            throw new BadRequestException('강의실 이용 시간은 9시부터 18시까지만 가능합니다.');
        }

        return value;
    }
}
