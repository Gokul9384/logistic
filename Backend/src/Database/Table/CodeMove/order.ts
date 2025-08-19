import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseTable } from "../BaseTable";
import { customer } from "./customer";
import { AuditLogIdentity } from "@Root/Helper/AuditLog.decorators";
import { PriorityEnum } from "@Root/Helper/Enum/PriorityEnum";
import { OrderStatusEnum } from "@Root/Helper/Enum/OrderStatusEnum";

@Entity()
export class order extends BaseTable {

    @ManyToOne(() => customer, { onDelete: "CASCADE" })
    @JoinColumn({ name: "customer_id" })
    customer: customer;

    @Column()
    @Index()
    customer_id: string;

    @Column()
    order_number: string;

    @AuditLogIdentity()
    @Column()
    material: string;

    @Column()
    source_location: string;

    @Column()
    destination_location: string;

    @Column("decimal", { precision: 10, scale: 2 })
    weight: number;

    @Column({ type: "enum", enum: PriorityEnum, default: PriorityEnum.Medium })
    priority: PriorityEnum;

    @Column({ type: 'date', nullable: true })
    expected_date: Date;

    @Column({ type: "enum", enum: OrderStatusEnum, default: OrderStatusEnum.New })
    order_status: OrderStatusEnum;

    @Column({ type: 'datetime', nullable: true })
    order_date: Date;

    @Column({ type: 'date', nullable: true })
    pickup_date: Date;

    @Column({ type: 'time', nullable: true })
    pickup_time: string;

}
