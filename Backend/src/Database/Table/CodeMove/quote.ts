import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseTable } from "../BaseTable";
import { AuditLogIdentity } from "@Root/Helper/AuditLog.decorators";
import { QuoteStatusEnum } from "@Root/Helper/Enum/QuoteEnum";
import { requirement } from "./requirement";

@Entity()
export class quote extends BaseTable {

    @ManyToOne(() => requirement, { onDelete: "CASCADE" })
    @JoinColumn({ name: "requirement_id" })
    requirement: requirement;

    @Column()
    @Index()
    requirement_id: string;

    @Column()
    quote_number: string;

    @AuditLogIdentity()
    @Column('decimal', { precision: 12, scale: 2 })
    quote_amount: number;

    @Column({ type: "enum", enum: QuoteStatusEnum, default: QuoteStatusEnum.Sent })
    quote_status: QuoteStatusEnum;

}
