import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, Length, MinLength, MaxLength } from 'class-validator';

export class UpdateAlarmCentralDto {
    @IsOptional()
    @IsString()
    @MaxLength(200)
    @ApiProperty({example: 'House', description: 'The name of the alarm central'})
    name: string;

    @IsOptional()
    @Length(12)
    @ApiProperty({example: '1A2B3C4D5E6F', description: 'The MAC address of the alarm central, must be a valid MAC without separators'})
    macAddress: string;

    @IsOptional()
    @MinLength(4)
    @MaxLength(6)
    @ApiProperty({example: '1234', description: 'The password of the alarm central, must be 4 ou 6 numeric digits'})
    password: string;

}