import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class NotificationModel extends BaseModel {
    @ApiProperty({ required: false })
    @Type(() => String)
    title: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    message: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    user_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    user_type: string;

    @ApiProperty({ required: false, default: false })
    @Type(() => Boolean)
    is_read: boolean;
}
