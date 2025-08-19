import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { BaseTable } from "../BaseTable";
import { vehicle_type } from "./vehicle_type";
import { vendor } from "./vendor";

@Entity()
export class vendor_vehicle extends BaseTable {

    @ManyToOne(() => vendor, { onDelete: "CASCADE" })
    @JoinColumn({ name: "vendor_id" })
    vendor: vendor;

    @Column()
    vendor_id: string;

    @ManyToOne(() => vehicle_type, { onDelete: "CASCADE" })
    @JoinColumn({ name: "vehicle_type_id" })
    vehicle_type: vehicle_type;

    @Column()
    vehicle_type_id: string;

    @Column("decimal", { nullable: true })
    min_capacity: number;

    @Column("decimal", { nullable: true })
    max_capacity: number;
}
