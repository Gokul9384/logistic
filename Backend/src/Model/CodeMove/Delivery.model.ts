// Delivery Model
import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { DeliveryStatusEnum } from "@Root/Helper/Enum/DeliveryStatusEnum";
import { Type } from "class-transformer";

export class DeliveryModel extends BaseModel {
    @ApiProperty({ required: true })
    @Type(() => String)
    order_id: string;

    @ApiProperty({ required: true })
    @Type(() => String)
    driver_id: string;

    @ApiProperty({ required: true })
    @Type(() => String)
    booking_id: string; // Added missing booking_id

    @ApiProperty({ required: true, enum: DeliveryStatusEnum })
    @Type(() => String)
    delivery_status: DeliveryStatusEnum;

    @ApiProperty({ required: false })
    @Type(() => Date)
    assigned_time: Date;

    @ApiProperty({ required: false })
    @Type(() => Date)
    in_transit_time: Date;

    @ApiProperty({ required: false })
    @Type(() => Date)
    start_time: Date;

    @ApiProperty({ required: false })
    @Type(() => Date)
    end_time: Date;

    @ApiProperty({ required: false })
    @Type(() => String)
    proof_image: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    signature: string;
}