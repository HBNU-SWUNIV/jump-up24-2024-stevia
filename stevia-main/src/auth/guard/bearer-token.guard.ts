import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import {
    AuthService,
} from "../auth.service";

@Injectable()
export class BearerTokenGuard implements CanActivate {
    constructor(protected readonly authService: AuthService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const rawToken = request.headers["authorization"];

        if (!rawToken) {
            throw new UnauthorizedException("토큰이 없습니다.");
        }

        const token = this.authService.extractTokenFromHeader(rawToken, true);

        const tokenPayload =  await this.authService.verifyToken(token);

        request.token = token;
        request.tokenType = tokenPayload.type;
        request.studentNo = tokenPayload.studentId; // 사용자 아이디 저장

        return true;
    }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const request = context.switchToHttp().getRequest();

        if (request.tokenType !== "access") {
            throw new UnauthorizedException("Access Token이 아닙니다.");
        }

        return true;
    }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const request = context.switchToHttp().getRequest();

        if (request.tokenType !== "refresh") {
            throw new UnauthorizedException("Refresh Token이 아닙니다.");
        }

        return true;
    }
}
