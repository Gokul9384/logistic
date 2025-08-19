// Delivery Entity
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseTable } from "../BaseTable";
import { order } from "./order";
import { driver } from "./driver";
import { AuditLogIdentity } from "@Root/Helper/AuditLog.decorators";
import { DeliveryStatusEnum } from "@Root/Helper/Enum/DeliveryStatusEnum";
import { bookings } from "./bookings";

@Entity()
export class delivery extends BaseTable {
    @ManyToOne(() => order, { onDelete: "CASCADE" })
    @JoinColumn({ name: "order_id" })
    order: order;

    @Column()
    @Index()
    order_id: string;

    @ManyToOne(() => driver, { onDelete: "CASCADE" })
    @JoinColumn({ name: "driver_id" })
    driver: driver;

    @Column()
    @Index()
    driver_id: string;

    @ManyToOne(() => bookings, { onDelete: "CASCADE" })
    @JoinColumn({ name: "booking_id" })
    bookings: bookings;

    @Column()
    @Index()
    booking_id: string;

    @Column({ type: "enum", enum: DeliveryStatusEnum, default: DeliveryStatusEnum.Assigned })
    delivery_status: DeliveryStatusEnum;

    @Column({ type: 'timestamp', nullable: true })
    start_time: Date;

    @Column({ type: 'timestamp', nullable: true })
    assigned_time: Date;


    @Column({ type: 'timestamp', nullable: true })
    in_transit_time: Date;

    @Column({ type: 'timestamp', nullable: true })
    end_time: Date;

    @AuditLogIdentity()
    @Column({ nullable: true })
    proof_image: string;

    @Column({ nullable: true })
    signature: string;
}