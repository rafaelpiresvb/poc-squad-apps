import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateVideoDeviceDto } from './dto/create-video-device.dto';
import { FindVideoDevicesQueryDto } from './dto/find-video-devices-query.dto';
import { UpdateVideoDeviceDto } from './dto/update-video-device.dto';
import { VideoDevice } from './video-device.entity';
import { VideoDeviceRepository } from './video-devices.repository';

@Injectable()
export class VideoDevicesService {
    constructor(private readonly videoDeviceRepository: VideoDeviceRepository) { }

    async createVideoDevice(createVideoDeviceDto: CreateVideoDeviceDto, userId: string): Promise<VideoDevice> {
        return this.videoDeviceRepository.createVideoDevice(createVideoDeviceDto, userId);
    }

    async findVideoDevices(queryDto: FindVideoDevicesQueryDto): Promise<{ data: VideoDevice[]; count: number }> {
        const result = await this.videoDeviceRepository.findVideoDevices(queryDto);
        return result;
    }

    async findVideoDeviceById(id: string, userId: string): Promise<VideoDevice> {
        const videoDevice = await this.videoDeviceRepository.findOne({
            where: { id: id, userId: userId },
            select: ['id', 'name', 'serial', 'username', 'password']
        });

        if (!videoDevice) {
            throw new NotFoundException('Video Device not found.');
        }

        return videoDevice;
    }

    async deleteVideoDevice(id: string, userId: string) {
        const result = await this.videoDeviceRepository.delete({ id: id, userId: userId });
        if (result.affected === 0) {
            throw new NotFoundException('Video Device not found.');
        }
    }

    async updateVideoDevice(updateVideoDeviceDto: UpdateVideoDeviceDto, id: string, userId: string): Promise<VideoDevice> {
        const videoDevice = await this.findVideoDeviceById(id, userId);
        const { name, serial, username, password } = updateVideoDeviceDto;

        videoDevice.name = name ? name : videoDevice.name;
        videoDevice.serial = serial ? serial : videoDevice.serial;
        videoDevice.username = username ? username : videoDevice.username;
        videoDevice.password = password ? password : videoDevice.password;

        try {
            await videoDevice.save();
            return videoDevice;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}
