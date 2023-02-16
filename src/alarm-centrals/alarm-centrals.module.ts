import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmCentral } from './alarm-central.entity';
import { AlarmCentralRepository } from './alarm-centrals.repository';
import { AlarmCentralsService } from './alarm-centrals.service';
import { AlarmCentralsController } from './alarm-centrals.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        TypeOrmModule.forFeature([AlarmCentral]),
        PassportModule.register({ defaultStrategy: 'jwt' })
    ],
    providers: [AlarmCentralRepository, AlarmCentralsService],
    controllers: [AlarmCentralsController],
})
export class AlarmCentralsModule { }
