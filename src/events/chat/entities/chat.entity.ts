import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Rooms } from "./room.entity";

@Entity({ schema: "school", name: "chats" })
export class Chats {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "send_id" })
  send_id: number;

  @Column("varchar", { name: "msg", length: 500 })
  msg: string;

  @ManyToOne(() => Rooms, (room) => room.id)
  @JoinColumn({ name: "room_id" })
  room: Rooms;
}
