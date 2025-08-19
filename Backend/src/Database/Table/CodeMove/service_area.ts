import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseTable } from "../BaseTable";
import { AuditLogIdentity } from "@Root/Helper/AuditLog.decorators";

@Entity()
export class service_area extends BaseTable {

    @AuditLogIdentity()
    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

}
