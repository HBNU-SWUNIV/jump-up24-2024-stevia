import {
    forwardRef,
    Module,
} from "@nestjs/common";
import {
    AuthService,
} from "./auth.service";
import {
    PrismaModule,
} from "../prisma/prisma.module";
import {
    JwtModule,
} from "@nestjs/jwt";
import {
    UsersModule,
} from "../users/users.module";
import {
    AuthController,
} from "./auth.controller";

@Module({
    imports: [PrismaModule,
        // 로그인할 때 사용하는 모듈
        JwtModule.register({}),
        forwardRef(() => UsersModule),
    ],
    providers: [AuthService,],
    exports: [AuthService,],
    controllers: [AuthController,],

})
export class AuthModule {
}
