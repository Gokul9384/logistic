import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { BaseTable } from "../BaseTable";
import { vendor } from "./vendor";
import { service_area } from "./service_area";

@Entity()
export class vendor_service_area extends BaseTable {

    @ManyToOne(() => vendor, { onDelete: "CASCADE" })
    @JoinColumn({ name: "vendor_id" })
    vendor: vendor;

    @Column()
    vendor_id: string;

    @ManyToOne(() => service_area, { onDelete: "CASCADE" })
    @JoinColumn({ name: "service_area_id" })
    service_area: service_area;

    @Column()
    service_area_id: string;

    @Column("decimal", { nullable: true })
    min_km: number;

    @Column("decimal", { nullable: true })
    max_km: number;
}
