import {
    forwardRef,
    Module,
} from "@nestjs/common";
import {
    UsersService,
} from "./users.service";
import {
    UsersController,
} from "./users.controller";
import {
    PrismaModule,
} from "../prisma/prisma.module";
import {
    UsersRepository,
} from "./users.repository";
import {
    AuthModule,
} from "../auth/auth.module";

@Module({
    imports: [PrismaModule,
        forwardRef(() => AuthModule),
    ],
    providers: [UsersService,
        UsersRepository,
    ],
    controllers: [UsersController,],
    exports: [UsersService,],

})
export class UsersModule {
}
