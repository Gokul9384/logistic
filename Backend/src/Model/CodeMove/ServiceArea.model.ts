import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class ServiceAreaModel extends BaseModel {

    @ApiProperty({ required: true })
    @Type(() => String)
    name: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    description: string;
    s
}
