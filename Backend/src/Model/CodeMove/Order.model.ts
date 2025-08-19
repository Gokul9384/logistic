import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { OrderStatusEnum } from "@Root/Helper/Enum/OrderStatusEnum";
import { PriorityEnum } from "@Root/Helper/Enum/PriorityEnum";
import { Type } from "class-transformer";

export class OrderModel extends BaseModel {

    @ApiProperty({ required: false })
    @Type(() => String)
    customer_id: string;


    @ApiProperty({ required: false })
    @Type(() => String)
    order_number: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    material: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    source_location: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    destination_location: string;

    @ApiProperty({ required: false })
    @Type(() => Number)
    weight: number;

    @ApiProperty({ required: false, enum: PriorityEnum })
    @Type(() => String)
    priority: PriorityEnum;

    @ApiProperty({ required: false })
    @Type(() => Date)
    expected_date: Date;

    @ApiProperty({ required: false, enum: OrderStatusEnum })
    @Type(() => String)
    order_status: OrderStatusEnum;

    @ApiProperty({ required: false })
    @Type(() => Date)
    order_date: Date;

    @ApiProperty({ required: false })
    @Type(() => Date)
    pickup_date: Date;

    @ApiProperty({ required: false })
    @Type(() => String)
    pickup_time: string;

}
