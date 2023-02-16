import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { CreateVideoDeviceDto } from "./dto/create-video-device.dto";
import { FindVideoDevicesQueryDto } from "./dto/find-video-devices-query.dto";
import { VideoDevice } from "./video-device.entity";

@Injectable()
export class VideoDeviceRepository extends Repository<VideoDevice> {
    constructor(private readonly dataSource: DataSource) {
        super(VideoDevice, dataSource.createEntityManager());
    }

    async createVideoDevice(createVideoDeviceDto: CreateVideoDeviceDto, userId: string): Promise<VideoDevice> {
        const { name, serial, username, password } = createVideoDeviceDto;

        const videoDevice = this.create();
        videoDevice.name = name;
        videoDevice.serial = serial;
        videoDevice.username = username;
        videoDevice.password = password;
        videoDevice.userId = userId;

        try {
            await videoDevice.save();
            return videoDevice;
        } catch (error) {
            if (error.code.toString() === '23505') {
                throw new ConflictException('This serial number has already registered to this user');
            }
            throw new InternalServerErrorException(error);
        }
    }

    async findVideoDevices(queryDto: FindVideoDevicesQueryDto): Promise<{ data: VideoDevice[]; count: number }> {
        queryDto.page = (!queryDto.page || queryDto.page < 1) ? 1 : queryDto.page;
        queryDto.limit = (!queryDto.limit || queryDto.limit > 100) ? 100 : queryDto.limit;

        const { userId, name, serial, id } = queryDto;
        const query = this.createQueryBuilder('video');
        query.where('1=1');

        if (userId) {
            query.andWhere('video.userId = :userId', { userId: `${userId}` });
        }

        if (id) {
            query.andWhere('video.id = :id', { id: `${id}` });
        }

        if (name) {
            query.andWhere('video.name ILIKE :name', { name: `%${name}%` });
        }

        if (serial) {
            query.andWhere('video.serial ILIKE :serial', { serial: `%${serial}%` });
        }

        query.skip((queryDto.page - 1) * queryDto.limit);
        query.take(+queryDto.limit);
        query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : 'video.createdAt');
        query.select(['video.id', 'video.name', 'video.serial', 'video.username', 'video.password']);

        const [data, count] = await query.getManyAndCount();

        return { count, data };
    }
}