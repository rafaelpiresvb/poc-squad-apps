import { BaseQueryParametersDto } from "../../shared/dto/base-query-parameters.dto";

export class FindAlarmCentralsQueryDto extends BaseQueryParametersDto {
    id: string;
    name: string;
    macAddress: string;
    userId: string;
}