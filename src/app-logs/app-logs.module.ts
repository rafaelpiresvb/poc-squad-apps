import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppLog } from './app-log.entity';
import { AppLogsRepository } from './app-logs.repository';
import { AppLogsService } from './app-logs.service';
import { AppLogsController } from './app-logs.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        TypeOrmModule.forFeature([AppLog]),
        PassportModule.register({ defaultStrategy: 'jwt' })
    ],
    providers: [AppLogsRepository, AppLogsService],
    controllers: [AppLogsController]
})
export class AppLogsModule { }
