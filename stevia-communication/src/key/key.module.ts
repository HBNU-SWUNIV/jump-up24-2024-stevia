import { Module } from "@nestjs/common";
import { KeyController } from "./key.controller";
import { KeyService } from "./key.service";

@Module({
  providers: [KeyService],
  controllers: [KeyController],
})
export class KeyModule {}
