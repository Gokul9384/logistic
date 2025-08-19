import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { BookingStatusEnum } from "@Root/Helper/Enum/BookingStatusEnum";

export class BookingModel extends BaseModel {


    @ApiProperty({ required: false })
    @Type(() => String)
    booking_number: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    order_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    vendor_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    customer_id: string;


    @ApiProperty({ required: false })
    @Type(() => String)
    quote_id: string;

    @ApiProperty({ required: false })
    @Type(() => Number)
    amount: number;

    @ApiProperty({ required: false, enum: BookingStatusEnum })
    @Type(() => String)
    booking_status: BookingStatusEnum;

    @ApiProperty({ required: false })
    @Type(() => String)
    driver_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    vehicle_number: string;
}