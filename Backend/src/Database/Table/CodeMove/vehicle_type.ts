import { Column, Entity } from "typeorm";
import { BaseTable } from "../BaseTable";
import { AuditLogIdentity } from "@Root/Helper/AuditLog.decorators";

@Entity()
export class vehicle_type extends BaseTable {

    @AuditLogIdentity()
    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

}
