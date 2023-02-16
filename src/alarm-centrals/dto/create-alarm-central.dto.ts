import { ApiProperty } from "@nestjs/swagger";
import {
    IsHexadecimal,
    IsNotEmpty,
    IsNumberString,
    Length,
    MaxLength,
    MinLength,
} from "class-validator";

export class CreateAlarmCentralDto {
    @ApiProperty({example: 'House', description: 'The name of the alarm central'})
    @IsNotEmpty()
    @MaxLength(200)
    name: string;

    @IsNotEmpty()
    @MaxLength(12)
    @MinLength(12)
    @IsHexadecimal()
    @ApiProperty({example: '1A2B3C4D5E6F', description: 'The MAC address of the alarm central, must be a valid MAC without separators'})
    macAddress: string;

    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(6)
    @IsNumberString()
    @ApiProperty({example: '1234', description: 'The password of the alarm central, must be 4 ou 6 numeric digits'})
    password: string;
}