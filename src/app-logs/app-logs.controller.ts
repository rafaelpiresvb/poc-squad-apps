import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AppLogsService } from './app-logs.service';
import { CreateAppLogDto } from './dto/create-log-dto';

@Controller('app-logs')
@ApiExcludeController()
export class AppLogsController {
    constructor(private appLogsService: AppLogsService) { }

    @Post()
    async createAppLog(@Body(ValidationPipe) createAppLoglDto: CreateAppLogDto) {
        await this.appLogsService.createAppLog(createAppLoglDto);
        return {
            message: 'Log created successfully.'
        }
    }



}
