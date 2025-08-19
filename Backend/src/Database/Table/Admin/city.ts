import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseTable } from "../BaseTable";
import { state } from "./state";
import { AuditLogIdentity } from "@Root/Helper/AuditLog.decorators";
import { country } from "./country";

@Entity()
export class city extends BaseTable {

  @ManyToOne(() => state, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "state_id" })
  state: state;

  @Column()
  @Index()
  state_id: string

  @ManyToOne(() => country, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "country_id" })
  country: country;

  @Column()
  @Index()
  country_id: string

  @AuditLogIdentity()
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  code: string;

}
