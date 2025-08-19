import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class DriverModel extends BaseModel {


    @ApiProperty({ required: false })
    @Type(() => String)
    vendor_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    license_number: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    vehicle_number: string;


    @ApiProperty({ required: false })
    @Type(() => String)
    name: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    email: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    password: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    mobile: string;
}
