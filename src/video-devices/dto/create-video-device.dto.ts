import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    Length,
    MaxLength,
    MinLength,
} from "class-validator";

export class CreateVideoDeviceDto {
    @IsNotEmpty()
    @MaxLength(200)
    @ApiProperty({example: 'House', description: 'The name of the video device'})
    name: string;

    @IsNotEmpty()
    @MinLength(13)
    @MaxLength(13)
    @ApiProperty({example: 'ABCDEF1234567', description: 'The serial number of the video device'})
    serial: string;

    @IsNotEmpty()
    @MaxLength(200)
    @ApiProperty({example: 'admin', description: 'The username to access video device'})
    username: string;

    @IsNotEmpty()
    @MaxLength(200)
    @ApiProperty({example: '1234', description: 'The password of the video device'})
    password: string;
}