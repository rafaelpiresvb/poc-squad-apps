import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AlarmCentral } from './alarm-central.entity';
import { AlarmCentralRepository } from './alarm-centrals.repository';
import { CreateAlarmCentralDto } from './dto/create-alarm-central.dto';
import { FindAlarmCentralsQueryDto } from './dto/find-alarm-centrals-query.dto';
import { UpdateAlarmCentralDto } from './dto/update-alarm-centrals.dto';

@Injectable()
export class AlarmCentralsService {
    constructor(
        private readonly alarmCentralRepository: AlarmCentralRepository
    ) { }

    async createAlarmCentral(createAlarmCentralDto: CreateAlarmCentralDto, userId: string): Promise<AlarmCentral> {
        return this.alarmCentralRepository.createAlarmCentral(createAlarmCentralDto, userId);
    }

    async findAlarmCentrals(queryDto: FindAlarmCentralsQueryDto): Promise<{ data: AlarmCentral[]; count: number }> {
        const result = await this.alarmCentralRepository.findAlarmCentrals(queryDto);
        return result;
    }

    async findAlarmCentralById(id: string, userId: string): Promise<AlarmCentral> {
        const alarmCentral = await this.alarmCentralRepository.findOne({
            where: { id: id, userId: userId },
            select: ['id', 'name', 'macAddress', 'password']
        });

        if (!alarmCentral) {
            throw new NotFoundException('Alarm Central not found.');
        }
        return alarmCentral;
    }

    async deleteAlarmCentral(id: string, userId: string) {
        const result = await this.alarmCentralRepository.delete({ id: id, userId: userId });
        if (result.affected === 0) {
            throw new NotFoundException('Alarm central not found.');
        }
    }

    async updateAlarmCentral(updateAlarmCentralDto: UpdateAlarmCentralDto, id: string, userId: string): Promise<AlarmCentral> {
        const alarmCentral = await this.findAlarmCentralById(id, userId);
        const { name, macAddress, password } = updateAlarmCentralDto;

        alarmCentral.name = name ? name : alarmCentral.name;
        alarmCentral.macAddress = macAddress ? macAddress : alarmCentral.macAddress;
        alarmCentral.password = password ? password : alarmCentral.password;

        try {
            await alarmCentral.save();
            return alarmCentral;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

}
