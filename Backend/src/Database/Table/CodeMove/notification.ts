import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseTable } from "../BaseTable";
import { AuditLogIdentity } from "@Root/Helper/AuditLog.decorators";


@Entity()
export class notification extends BaseTable {


    @AuditLogIdentity()
    @Column()
    title: string;

    @Column()
    message: string;

    @Column()
    user_id: string;

    @Column()
    user_type: string;

    @Column()
    route_module: string;

    @Column()
    route_id: string;

    @Column({ default: false })
    is_read: boolean;

}
