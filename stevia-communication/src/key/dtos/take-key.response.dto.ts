import { DOOR_STATUS } from "./door.status.enum";

export class TakeKeyResponseDto {
  image_status: DOOR_STATUS | boolean;
}
