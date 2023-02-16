import { Body, Controller, Get, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeController } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { GetUser } from './get-user.decorator';

@Controller('auth')
@ApiExcludeController()
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signup')
    async signUp(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<{ message: string }> {
        await this.authService.signUp(createUserDto);
        return {
            message: 'user created successfully'
        }
    }

    @Post('/signin')
    async signIn(@Body(ValidationPipe) credentialsDto: CredentialsDto): Promise<{ token: string }> {
        return await this.authService.signIn(credentialsDto);
    }

    @Get('/me')
    @UseGuards(AuthGuard())
    getMe(@GetUser() user: User): User {
        return user;
    }
}
