import {
    IsNotEmpty,
} from "class-validator";

export class CreateAppLogDto {
    @IsNotEmpty()
    deviceId: string;

    @IsNotEmpty()
    logText: string;
}