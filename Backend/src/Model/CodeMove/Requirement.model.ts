// src/Model/CodeMove/Requirement.model.ts
import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { RequirementEnum } from "@Root/Helper/Enum/QuoteEnum";

export class RequirementModel extends BaseModel {

    @ApiProperty({ required: false })
    @Type(() => String)
    order_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    vendor_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    requirement_number: string;

    @ApiProperty({ required: false, enum: RequirementEnum })
    @Type(() => String)
    requirement_status: RequirementEnum;
}
