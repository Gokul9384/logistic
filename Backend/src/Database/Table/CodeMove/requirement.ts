import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseTable } from "../BaseTable";
import { order } from "./order";
import { vendor } from "./vendor";
import { RequirementEnum } from "@Root/Helper/Enum/QuoteEnum";

@Entity()
export class requirement extends BaseTable {

    @ManyToOne(() => order, { onDelete: "CASCADE" })
    @JoinColumn({ name: "order_id" })
    order: order;

    @Column()
    @Index()
    order_id: string;

    @ManyToOne(() => vendor, { onDelete: "CASCADE" })
    @JoinColumn({ name: "vendor_id" })
    vendor: vendor;

    @Column()
    @Index()
    vendor_id: string;

    @Column()
    requirement_number: string;

    @Column({ type: "enum", enum: RequirementEnum, default: RequirementEnum.Sent })
    requirement_status: RequirementEnum;

}
