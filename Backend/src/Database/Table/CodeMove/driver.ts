import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseTable } from "../BaseTable";
import { AuditLogIdentity } from "@Root/Helper/AuditLog.decorators";
import { user } from "../Admin/user";
import { vendor } from "./vendor";

@Entity()
export class driver extends BaseTable {

    @ManyToOne(() => user, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: user;

    @Column()
    @Index()
    user_id: string;

    @ManyToOne(() => vendor, { onDelete: "CASCADE" })
    @JoinColumn({ name: "vendor_id" })
    vendor: vendor;

    @Column()
    @Index()
    vendor_id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;


    @Column({ nullable: true })
    mobile: string;

    @AuditLogIdentity()
    @Column()
    license_number: string;

    @Column({ nullable: true })
    vehicle_number: string;
}
