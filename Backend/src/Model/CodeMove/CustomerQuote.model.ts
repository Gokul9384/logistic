import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { QuoteStatusEnum } from "@Root/Helper/Enum/QuoteEnum";
import { Type } from "class-transformer";

export class CustomerQuoteModel extends BaseModel {
    @ApiProperty({ required: false })
    @Type(() => String)
    quote_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    order_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    customer_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    customer_quote_number: string;

    @ApiProperty({ required: false })
    @Type(() => Number)
    customer_quote_amount: number;

    @ApiProperty({ required: false, enum: QuoteStatusEnum })
    @Type(() => String)
    customer_quote_status: QuoteStatusEnum;
}
