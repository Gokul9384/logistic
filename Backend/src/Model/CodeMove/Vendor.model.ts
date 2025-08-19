import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";



class VendorVehicleModel {
    @ApiProperty()
    @Type(() => String)
    vehicle_type_id: string;

    @ApiProperty()
    @Type(() => Number)
    min_capacity: number;

    @ApiProperty()
    @Type(() => Number)
    max_capacity: number;
}

class VendorServiceAreaModel {
    @ApiProperty()
    @Type(() => String)
    service_area_id: string;

    @ApiProperty()
    @Type(() => Number)
    min_km: number;

    @ApiProperty()
    @Type(() => Number)
    max_km: number;
}

export class VendorModel extends BaseModel {


    @ApiProperty({ required: false })
    @Type(() => String)
    company_name: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    address: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    service_area: string;

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

    @ApiProperty({ required: false })
    @Type(() => String)
    pan_number: string;

    @ApiProperty({ type: [VendorVehicleModel], required: false })
    @Type(() => VendorVehicleModel)
    vendor_vehicle_list: VendorVehicleModel[];

    @ApiProperty({ type: [VendorServiceAreaModel], required: false })
    @Type(() => VendorServiceAreaModel)
    vendor_service_area_list: VendorServiceAreaModel[];
}


