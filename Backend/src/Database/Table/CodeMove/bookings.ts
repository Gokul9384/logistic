import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseTable } from "../BaseTable";
import { AuditLogIdentity, AuditLogTableRemoveColumns } from "@Root/Helper/AuditLog.decorators";
import { order } from "./order";
import { vendor } from "./vendor";
import { quote } from "./quote";
import { BookingStatusEnum } from "@Root/Helper/Enum/BookingStatusEnum";
import { driver } from "./driver";
import { customer } from "./customer";

@Entity()
export class bookings extends BaseTable {

    @Column({ unique: true })
    booking_number: string;

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

    @ManyToOne(() => customer, { onDelete: "CASCADE" })
    @JoinColumn({ name: "customer_id" })
    customer: customer;

    @Column()
    @Index()
    customer_id: string;

    @ManyToOne(() => quote, { onDelete: "CASCADE" })
    @JoinColumn({ name: "quote_id" })
    quote: quote;

    @Column()
    @Index()
    quote_id: string;

    @AuditLogIdentity()
    @Column()
    amount: number;

    @Column({ type: "enum", enum: BookingStatusEnum, default: BookingStatusEnum.CREATED })
    booking_status: BookingStatusEnum;

    @ManyToOne(() => driver, { onDelete: "CASCADE" })
    @JoinColumn({ name: "driver_id" })
    driver: driver;

    @Column({ nullable: true })
    @Index()
    driver_id: string;



    @Column({ nullable: true })
    vehicle_number: string;

}
