import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AlarmCentral } from "./alarm-central.entity";
import { CreateAlarmCentralDto } from "./dto/create-alarm-central.dto";
import { FindAlarmCentralsQueryDto } from "./dto/find-alarm-centrals-query.dto";

@Injectable()
export class AlarmCentralRepository extends Repository<AlarmCentral> {
    constructor(private dataSource: DataSource) {
        super(AlarmCentral, dataSource.createEntityManager());
    }

    async createAlarmCentral(createAlarmCentralDto: CreateAlarmCentralDto, userId: string): Promise<AlarmCentral> {
        const { name, macAddress, password } = createAlarmCentralDto;

        const alarmCentral = this.create();
        alarmCentral.name = name;
        alarmCentral.macAddress = macAddress;
        alarmCentral.password = password;
        alarmCentral.userId = userId;

        try {
            await alarmCentral.save();
            return alarmCentral;
        } catch (error) {
            if (error.code.toString() === '23505') {
                throw new ConflictException('This mac address has already registered to this user');
            }
            throw new InternalServerErrorException('Something get wrong on our side');
        }
    }

    async findAlarmCentrals(queryDto: FindAlarmCentralsQueryDto): Promise<{ data: AlarmCentral[]; count: number }> {
        queryDto.page = (!queryDto.page || queryDto.page < 1) ? 1 : queryDto.page;
        queryDto.limit = (!queryDto.limit || queryDto.limit > 100) ? 100 : queryDto.limit;

        const { userId, name, macAddress, id } = queryDto;
        const query = this.createQueryBuilder('alarm');
        query.where('1=1');

        if (userId) {
            query.andWhere('alarm.userId = :userId', { userId: `${userId}` });
        }

        if (id) {
            query.andWhere('alarm.id = :id', { id: `${id}` });
        }

        if (name) {
            query.andWhere('alarm.name ILIKE :name', { name: `%${name}%` });
        }

        if (macAddress) {
            query.andWhere('alarm.macAddress ILIKE :macAddress', { macAddress: `%${macAddress}%` });
        }
        query.skip((queryDto.page - 1) * queryDto.limit);
        query.take(+queryDto.limit);
        query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : 'alarm.createdAt');
        query.select(['alarm.id', 'alarm.name', 'alarm.macAddress', 'alarm.password']);

        const [data, count] = await query.getManyAndCount();

        return { count, data };
    }
}