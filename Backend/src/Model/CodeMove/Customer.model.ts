import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CustomerModel extends BaseModel {

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

    @ApiProperty({ required: false })
    @Type(() => String)
    gst_number: string;

    // 🔹 Google Maps integration fields
    @ApiProperty({ required: false, description: "Latitude of customer location" })
    @Type(() => String)
    latitude?: string;

    @ApiProperty({ required: false, description: "Longitude of customer location" })
    @Type(() => String)
    longitude?: string;


    @ApiProperty({ required: false, description: "Formatted address from Google Maps" })
    @Type(() => String)
    formatted_address?: string;
}
