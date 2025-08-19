import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseTable } from "../BaseTable";
import { AuditLogIdentity, AuditLogTableRemoveColumns } from "@Root/Helper/AuditLog.decorators";
import { user } from "../Admin/user";

@Entity()
export class vendor extends BaseTable {

    @ManyToOne(() => user, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: user;

    @Column()
    @Index()
    user_id: string;

    @AuditLogIdentity()
    @Column()
    company_name: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    mobile: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    gst_number: string;

    @Column({ nullable: true })
    pan_number: string;
}
