import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { AlarmCentralsModule } from './alarm-centrals/alarm-centrals.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { VideoDevicesModule } from './video-devices/video-devices.module';
import { AppLogsModule } from './app-logs/app-logs.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), AlarmCentralsModule, UsersModule, AuthModule, VideoDevicesModule, AppLogsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}