import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";
import {
    AuthService,
} from "../auth.service";

@Injectable()
export class BasicTokenGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const rawToken = request.headers["authorization"];

        if (!rawToken) {
            throw new UnauthorizedException("토큰이 없습니다.");
        }

        return true;
    }
}
