import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { UserRole } from './user-roles.enum';
import { User } from './user.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
        if (createUserDto.password != createUserDto.passwordConfirmation) {
            throw new UnprocessableEntityException('Passwords do not match');
        } else {
            return this.userRepository.createUser(createUserDto, UserRole.ADMIN);
        }
    }

    async findUserById(userId: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: ['email', 'name', 'role', 'id']
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
        const user = await this.findUserById(id);
        const { name, email, role, status } = updateUserDto;

        user.name = name ? name : user.name;
        user.email = email ? email : user.email;
        user.role = role ? role : user.role;
        user.status = status ? status : user.status;

        try {
            await user.save();
            return user;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async deleteUser(userId: string) {
        const result = await this.userRepository.delete({ id: userId });
        if (result.affected === 0) {
            throw new NotFoundException('User not found.');
        }
    }

    async findUsers(queryDto: FindUsersQueryDto): Promise<{ users: User[]; count: number }> {
        const result = await this.userRepository.findUsers(queryDto);
        return result;
    }

}