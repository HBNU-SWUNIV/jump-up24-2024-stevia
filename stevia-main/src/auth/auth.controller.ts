import {
    Controller,
    Post,
    UseGuards,
    Headers,
} from "@nestjs/common";
import {
    AuthService,
} from "./auth.service";
import {
    RefreshTokenGuard,
} from "./guard/bearer-token.guard";

@Controller("stevia/api/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post("token/access")
    @UseGuards(RefreshTokenGuard)
    async postAccessToken(@Headers("authorization") rawToken: string): Promise<{ accessToken: string }> {
        const token = this.authService.extractTokenFromHeader(rawToken, true);

        const newToken = this.authService.rotateToken(token, false);

        return {
            accessToken: newToken,
        };
    }

    @Post("token/refresh")
    @UseGuards(RefreshTokenGuard)
    async postRefreshToken(@Headers("authorization") rawToken: string): Promise<any> {
        const token = this.authService.extractTokenFromHeader(rawToken, true);

        const newToken = this.authService.rotateToken(token, true);

        return {
            refreshToken: newToken,
        };
    }
}
