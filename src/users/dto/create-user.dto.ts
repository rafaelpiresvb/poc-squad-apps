import {
    IsEmail,
    IsNotEmpty,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail({})
    @MaxLength(200)
    email: string;

    @IsNotEmpty()
    @MaxLength(200)
    name: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @MinLength(6)
    passwordConfirmation: string;
}