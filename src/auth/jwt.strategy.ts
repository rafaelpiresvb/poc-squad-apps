import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from "../users/users.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userRepository: UserRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'super-secret',
        });
    }

    async validate(payload: { id: string }) {
        const { id } = payload;

        const user = await this.userRepository.findOne({ where: { id }, select: ['id', 'name', 'email', 'status', 'role'] });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }
}