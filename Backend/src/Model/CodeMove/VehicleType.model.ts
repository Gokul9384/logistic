import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class VehicleTypeModel extends BaseModel {

    @ApiProperty({ required: true })
    @Type(() => String)
    name: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    description: string;

    @ApiProperty({ required: false })
    @Type(() => Number)
    min_capacity: number;

    @ApiProperty({ required: false })
    @Type(() => Number)
    max_capacity: number;
}
