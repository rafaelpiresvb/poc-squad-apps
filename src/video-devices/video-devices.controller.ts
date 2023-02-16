import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';
import { RolesGuard } from '../auth/roles.guard';
import { CreateVideoDeviceDto } from './dto/create-video-device.dto';
import { VideoDevicesService } from './video-devices.service';
import { VideoDevice } from './video-device.entity';
import { FindVideoDevicesQueryDto } from './dto/find-video-devices-query.dto';
import { UpdateVideoDeviceDto } from './dto/update-video-device.dto';
import {
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    getSchemaPath,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Video Devices')
@Controller('video-devices')
@UseGuards(AuthGuard(), RolesGuard)
export class VideoDevicesController {
    constructor(private videoDevicesService: VideoDevicesService) { }

    @Post()
    @ApiOperation({ summary: 'Create video device' })
    @ApiCreatedResponse({ description: 'Created', type: VideoDevice })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiConflictResponse({ description: 'Conflict - serial number already exists in other video device' })
    async createVideoDevice(
        @Body(ValidationPipe) createVideoDeviceDto: CreateVideoDeviceDto,
        @GetUser() user: User
    ): Promise<VideoDevice> {
        const videoDevice = await this.videoDevicesService.createVideoDevice(createVideoDeviceDto, user.id.toString());
        return videoDevice;
    }

    @Get()
    @ApiOperation({ summary: 'List all video devices' })
    @ApiOkResponse({
        schema: {
            type: 'object',
            properties: {
                count: { type: 'number', example: 1, description: "Count of the returned video devices" },
                data: {
                    type: 'array', items: { $ref: getSchemaPath(VideoDevice) }
                }
            },
        },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findVideoDevices(@GetUser() user: User) {
        const query = new FindVideoDevicesQueryDto();
        query.userId = user.id.toString();

        const found = await this.videoDevicesService.findVideoDevices(query);
        return found;
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get video device by id' })
    @ApiOkResponse({ type: VideoDevice })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not Found'})
    async findVideoVeviceById(@Param('id') id: string, @GetUser() user: User): Promise<VideoDevice> {
        // TODO: check if id is a valid uuid
        const videoDevice = await this.videoDevicesService.findVideoDeviceById(id, user.id.toString());
        return videoDevice;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update video device' })
    @ApiOkResponse({ type: VideoDevice })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not Found'})
    async updateVideoDevice(
        @Body(ValidationPipe) updateVideoDeviceDto: UpdateVideoDeviceDto,
        @GetUser() user: User,
        @Param('id') id: string
    ): Promise<VideoDevice> {
        return this.videoDevicesService.updateVideoDevice(updateVideoDeviceDto, id, user.id.toString());
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete video device' })
    @ApiOkResponse({ description: 'Ok'})
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not Found'})
    async deleteVideoDevice(@Param('id') id: string, @GetUser() user: User) {
        await this.videoDevicesService.deleteVideoDevice(id, user.id.toString());
        return {
            message: 'Video Device removed successfully.'
        }
    }
}
