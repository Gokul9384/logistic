import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseTable } from "../BaseTable";
import { AuditLogIdentity } from "@Root/Helper/AuditLog.decorators";
import { country } from "./country";

@Entity()
export class state extends BaseTable {

    @ManyToOne(() => country, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "country_id" })
    country: country;

    @Column()
    @Index()
    country_id: string

    @AuditLogIdentity()
    @Column({ unique: true })
    name: string;

    @Column({ unique: true })
    code: string;

}
