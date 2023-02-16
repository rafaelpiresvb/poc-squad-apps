import { ApiProperty } from "@nestjs/swagger";
import {
    IsOptional,
    Length,
    MaxLength,
} from "class-validator";

export class UpdateVideoDeviceDto {
    @IsOptional()
    @MaxLength(200)
    @ApiProperty({example: 'House', description: 'The name of the video device'})
    name: string;

    @IsOptional()
    @Length(13)
    @ApiProperty({example: 'ABCDEF1234567', description: 'The serial number of the video device'})
    serial: string;

    @IsOptional()
    @MaxLength(200)
    @ApiProperty({example: 'admin', description: 'The username to access video device'})
    username: string;

    @IsOptional()
    @MaxLength(200)
    @ApiProperty({example: '1234', description: 'The password of the video device'})
    password: string;
}