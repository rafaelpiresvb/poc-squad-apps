import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { UserRole } from './user-roles.enum';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-users.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
@ApiExcludeController()
export class UsersController {
    constructor(private userService: UsersService) { }

    @Post()
    @Role(UserRole.ADMIN)
    async createAdminUser(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<ReturnUserDto> {
        const user = await this.userService.createAdminUser(createUserDto);
        return {
            user,
            message: 'Admin user created successfully'
        };
    }

    @Get(':id')
    @Role(UserRole.ADMIN)
    async findUserById(@Param('id') id: string): Promise<User> {
        const user = await this.userService.findUserById(id);
        return user;
    }

    @Patch(':id')
    async updateUser(
        @Body(ValidationPipe) updateUserDto: UpdateUserDto,
        @GetUser() user: User,
        @Param('id') id: string,
    ): Promise<User> {
        if (user.role != UserRole.ADMIN && user.id.toString() != id) {
            throw new ForbiddenException('You are not authorized to access this resource.');
        }

        return this.userService.updateUser(updateUserDto, id);
    }

    @Delete(':id')
    @Role(UserRole.ADMIN)
    async deleteUser(@Param('id') id: string) {
        await this.userService.deleteUser(id);
        return {
            message: 'User removed successfully'
        }
    }

    @Get()
    @Role(UserRole.ADMIN)
    async findUsers(@Query() query: FindUsersQueryDto) {
        const found = await this.userService.findUsers(query);
        return found;
    }
}