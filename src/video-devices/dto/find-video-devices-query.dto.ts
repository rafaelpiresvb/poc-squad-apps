import { BaseQueryParametersDto } from "../../shared/dto/base-query-parameters.dto";

export class FindVideoDevicesQueryDto extends BaseQueryParametersDto {
    id: string;
    name: string;
    serial: string;
    userId: string;
}