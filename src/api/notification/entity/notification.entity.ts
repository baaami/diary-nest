import { Users } from "src/api/user/entities/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
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
  @Column("int", { name: "msg" })
  msg: number;

  // 알림 확인 여부
  @Column("boolean", { name: "confirmed" })
  confirmed: boolean;

  // 알림 발생자(?)
  @ManyToMany(() => Users, (notifier) => notifier.id)
  @JoinColumn({ name: "notifier_id" })
  notifier: Users;

  // 수신자
  @ManyToMany(() => Users, (receiver) => receiver.id)
  @JoinColumn({ name: "receiver_id" })
  receiver: Users;
}
