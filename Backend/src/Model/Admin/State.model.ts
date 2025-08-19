import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";


export class StateModel extends BaseModel {

  @ApiProperty({ required: false })
  @Type(() => String)
  name: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  code: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  country_id: string;
}
