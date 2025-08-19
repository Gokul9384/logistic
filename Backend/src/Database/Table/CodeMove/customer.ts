import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseTable } from "../BaseTable";
import { AuditLogIdentity, AuditLogTableRemoveColumns } from "@Root/Helper/AuditLog.decorators";
import { user } from "../Admin/user";

@Entity()
export class customer extends BaseTable {

    @ManyToOne(() => user, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: user;

    @Column()
    @Index()
    user_id: string;

    @AuditLogIdentity()
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    mobile: string;

    @Column({ nullable: true })
    gst_number: string;

    @Column({ nullable: true })
    latitude: string;

    @Column({ nullable: true })
    longitude: string;

    @Column({ nullable: true })
    formatted_address: string;

}
