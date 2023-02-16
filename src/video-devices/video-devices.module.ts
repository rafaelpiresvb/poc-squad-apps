import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoDevice } from './video-device.entity';
import { VideoDeviceRepository } from './video-devices.repository';
import { VideoDevicesService } from './video-devices.service';
import { VideoDevicesController } from './video-devices.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([VideoDevice]),
        PassportModule.register({ defaultStrategy: 'jwt' })
    ],
    providers: [VideoDeviceRepository, VideoDevicesService],
    controllers: [VideoDevicesController]
})
export class VideoDevicesModule { }
