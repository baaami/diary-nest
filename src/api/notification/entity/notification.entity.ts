import { Users } from "src/api/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ schema: "school", name: "notifications" })
export class Notificaitions {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  // 알림 type
  @Column("int", { name: "type" })
  type: number;

  // 알림 내용
  @Column("varchar", { name: "msg" })
  msg: string;

  // 알림 확인 여부
  @Column("boolean", { name: "confirmed" })
  confirmed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // 알림 발생자(?)
  @ManyToOne(() => Users, (notifier) => notifier.id)
  @JoinColumn({ name: "notifier_id" })
  notifier: Users;

  // 수신자
  @ManyToOne(() => Users, (receiver) => receiver.id)
  @JoinColumn({ name: "receiver_id" })
  receiver: Users;
}
