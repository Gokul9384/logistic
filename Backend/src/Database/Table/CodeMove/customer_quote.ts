import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseTable } from "../BaseTable";
import { AuditLogIdentity } from "@Root/Helper/AuditLog.decorators";
import { QuoteStatusEnum } from "@Root/Helper/Enum/QuoteEnum";
import { requirement } from "./requirement";
import { quote } from "./quote";
import { order } from "./order";
import { customer } from "./customer";

@Entity()
export class customer_quote extends BaseTable {

    @ManyToOne(() => quote, { onDelete: "CASCADE" })
    @JoinColumn({ name: "quote_id" })
    quote: quote;

    @Column()
    @Index()
    quote_id: string;

    @ManyToOne(() => order, { onDelete: "CASCADE" })
    @JoinColumn({ name: "order_id" })
    order: order;

    @Column()
    @Index()
    order_id: string;


    @ManyToOne(() => customer, { onDelete: "CASCADE" })
    @JoinColumn({ name: "customer_id" })
    customer: customer;

    @Column()
    @Index()
    customer_id: string;

    @Column()
    customer_quote_number: string;

    @AuditLogIdentity()
    @Column('decimal', { precision: 12, scale: 2 })
    customer_quote_amount: number;

    @Column({ type: "enum", enum: QuoteStatusEnum, default: QuoteStatusEnum.Sent })
    customer_quote_status: QuoteStatusEnum;

}
