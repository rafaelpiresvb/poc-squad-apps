import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { User } from '../users/user.entity';
import { AlarmCentral } from './alarm-central.entity';
import { AlarmCentralsService } from './alarm-centrals.service';
import { CreateAlarmCentralDto } from './dto/create-alarm-central.dto';
import { FindAlarmCentralsQueryDto } from './dto/find-alarm-centrals-query.dto';
import { UpdateAlarmCentralDto } from './dto/update-alarm-centrals.dto';
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
@ApiTags('Alarm Centrals')
@Controller('alarm-centrals')
@UseGuards(AuthGuard(), RolesGuard)
export class AlarmCentralsController {
    constructor(private alarmCentralsService: AlarmCentralsService) { }

    @Post()
    @ApiOperation({ summary: 'Create alarm central' })
    @ApiCreatedResponse({ description: 'Created', type: AlarmCentral })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiConflictResponse({ description: 'Conflict - MAC Address already exists in other alarm central' })
    async createAlarmCentral(
        @Body(ValidationPipe) createAlarmCentralDto: CreateAlarmCentralDto,
        @GetUser() user: User
    ): Promise<AlarmCentral> {
        const alarmCentral = await this.alarmCentralsService.createAlarmCentral(createAlarmCentralDto, user.id.toString());
        return alarmCentral;
    }

    @Get()
    @ApiOperation({ summary: 'List all alarm centrals' })
    @ApiOkResponse({
        schema: {
            type: 'object',
            properties: {
                count: { type: 'number', example: 1, description: "Count of the returned alarm centrals" },
                data: {
                    type: 'array', items: { $ref: getSchemaPath(AlarmCentral) }
                }
            },
        },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAlarmCentrals(@GetUser() user: User): Promise<{ data: AlarmCentral[]; count: number }> {
        const query = new FindAlarmCentralsQueryDto();
        query.userId = user.id.toString();

        const found = await this.alarmCentralsService.findAlarmCentrals(query);
        return found;
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get alarm central by id' })
    @ApiOkResponse({ type: AlarmCentral })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not Found'})
    async findAlarmCentralById(@Param('id') id: string, @GetUser() user: User) {
        // TODO: check if id is a valid uuid
        const alarmCentral = await this.alarmCentralsService.findAlarmCentralById(id, user.id.toString());
        return alarmCentral;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update alarm central' })
    @ApiOkResponse({ type: AlarmCentral })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not Found'})
    async updateAlarmCentral(
        @Body(ValidationPipe) updateAlarmCentralDto: UpdateAlarmCentralDto,
        @GetUser() user: User,
        @Param('id') id: string,
    ): Promise<AlarmCentral> {
        return this.alarmCentralsService.updateAlarmCentral(updateAlarmCentralDto, id, user.id.toString());
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete alarm central' })
    @ApiOkResponse({ description: 'Ok'})
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not Found'})
    async deleteAlarmCentral(@Param('id') id: string, @GetUser() user: User) {
        await this.alarmCentralsService.deleteAlarmCentral(id, user.id.toString())
        return {
            message: 'Alarm Central removed successfully.'
        }
    }
}
