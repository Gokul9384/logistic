import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { QuoteStatusEnum } from "@Root/Helper/Enum/QuoteEnum";
import { Type } from "class-transformer";

export class QuoteModel extends BaseModel {

    @ApiProperty({ required: false })
    @Type(() => String)
    requirement_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    quote_number: string;

    @ApiProperty({ required: false })
    @Type(() => Number)
    quote_amount: number;

    @ApiProperty({ required: false, enum: QuoteStatusEnum })
    @Type(() => String)
    quote_status: QuoteStatusEnum;
}
