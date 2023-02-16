import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/users/user-roles.enum';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { UserRepository } from '../users/users.repository';
import { CredentialsDto } from './dto/credentials.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private jwtService: JwtService,
    ) { }

    async signUp(createUserDto: CreateUserDto): Promise<User> {
        if (createUserDto.password != createUserDto.passwordConfirmation) {
            throw new UnprocessableEntityException('Passwords do not match');
        } else {
            return this.userRepository.createUser(createUserDto, UserRole.USER);
        }
    }

    async signIn(credentialsDto: CredentialsDto) {
        const user = await this.userRepository.checkCredentials(credentialsDto);

        if (user === null) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const jwtPayload = {
            id: user.id
        }
        const token = await this.jwtService.sign(jwtPayload);

        return { token };
    }

}