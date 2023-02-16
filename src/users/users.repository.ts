import { DataSource, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserRole } from "./user-roles.enum";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CredentialsDto } from "../auth/dto/credentials.dto";
import { FindUsersQueryDto } from "./dto/find-users-query.dto";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async createUser(createUserDto: CreateUserDto, role: UserRole): Promise<User> {
        const { email, name, password } = createUserDto;

        const user = this.create();
        user.email = email;
        user.name = name;
        user.role = role;
        user.status = true;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try {
            await user.save();
            delete user.password;
            delete user.salt;
            return user;
        } catch (error) {
            if (error.code.toString() === '23505') {
                throw new ConflictException('This email has already in use');
            } else {
                throw new InternalServerErrorException('Something get wrong on our side');
            }
        }
    }

    async findUsers(queryDto: FindUsersQueryDto): Promise<{ users: User[]; count: number }> {
        queryDto.status = queryDto.status === undefined ? true : queryDto.status;
        queryDto.page = queryDto.page < 1 ? 1 : queryDto.page;
        queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;

        const { email, name, status, role } = queryDto;
        const query = this.createQueryBuilder('user');
        query.where('user.status = :status', { status });

        if (email) {
            query.andWhere('user.email ILIKE :email', { email: `%${email}%` });
        }

        if (name) {
            query.andWhere('user.name ILIKE :name', { name: `%${name}%` });
        }

        if (role) {
            query.andWhere('user.role = :role', { role });
        }
        query.skip((queryDto.page - 1) * queryDto.limit);
        query.take(+queryDto.limit);
        query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
        query.select(['user.name', 'user.email', 'user.role', 'user.status']);

        const [users, count] = await query.getManyAndCount();

        return { users, count };
    }

    async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
        const { email, password } = credentialsDto;
        const user = await this.findOne({ where: { email, status: true } });

        if (user && (await user.checkPassword(password))) {
            return user;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

}