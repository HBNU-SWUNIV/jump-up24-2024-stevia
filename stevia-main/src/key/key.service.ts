import {
    Injectable,
} from "@nestjs/common";
import {
    KeyRepository,
} from "./key.repository";

@Injectable()
export class KeyService {
    constructor(private readonly keyRepository: KeyRepository) {
    }

    // 키 상태 함수
    async currentKey(reserveId: string): Promise<any> {
        return await this.keyRepository.currentKey(reserveId);

    }

    // 키 대여 함수
    async rentalKey(reserveId: string): Promise<any> {
        return await this.keyRepository.rentalKey(reserveId);
    }

    // 키 반납 함수
    async dropKey(reserveId: string): Promise<any> {
        return await this.keyRepository.dropKey(reserveId);
    }
}
