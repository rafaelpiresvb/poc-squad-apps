import { Injectable } from '@nestjs/common';
import { AppLogsRepository } from './app-logs.repository';
import { CreateAppLogDto } from './dto/create-log-dto';

@Injectable()
export class AppLogsService {
    constructor(
        private readonly appLogsRepository: AppLogsRepository
    ) { }

    async createAppLog(createAppLogDto: CreateAppLogDto) {
        const appLog = await this.appLogsRepository.createAppLog(createAppLogDto)
    }

}
