import {
    Module, 
} from '@nestjs/common';
import {
    BoardsService, 
} from './boards.service';
import {
    BoardsController, 
} from './boards.controller';
import {
    PrismaModule, 
} from '../prisma/prisma.module';
import {
    BoardsRepository, 
} from './boards.repository';
import {
    AuthModule,
} from '../auth/auth.module';
import {
    UsersModule,
} from '../users/users.module';

@Module({
    imports: [PrismaModule,
        AuthModule,
        UsersModule,],
    controllers: [BoardsController,],
    providers: [BoardsService,
        BoardsRepository,],
})
export class BoardsModule {}
