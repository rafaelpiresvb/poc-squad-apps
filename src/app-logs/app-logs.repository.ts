import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AppLog } from "./app-log.entity";
import { CreateAppLogDto } from "./dto/create-log-dto";

@Injectable()
export class AppLogsRepository extends Repository<AppLog> {
    constructor(private dataSource: DataSource) {
        super(AppLog, dataSource.createEntityManager());
    }

    async createAppLog(createAppLoglDto: CreateAppLogDto): Promise<AppLog> {
        const { deviceId, logText } = createAppLoglDto;

        const appLog = this.create();
        appLog.deviceId = deviceId;
        appLog.logText = logText;

        try {
            await appLog.save();
            return appLog;
        } catch (error) {
            throw new InternalServerErrorException('Something get wrong on our side');
        }
    }
}