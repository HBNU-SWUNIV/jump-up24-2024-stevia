import {
    Module,
} from "@nestjs/common";
import {
    KeyService,
} from "./key.service";
import {
    KeyController,
} from "./key.controller";
import {
    PrismaModule,
} from "../prisma/prisma.module";
import {
    KeyRepository,
} from "./key.repository";

@Module({
    imports: [PrismaModule,],
    providers: [KeyService,
        KeyRepository,],
    controllers: [KeyController,
    ],
})
export class KeyModule {
}
