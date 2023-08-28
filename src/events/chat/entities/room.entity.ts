import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Chats } from "./chat.entity";

@Entity({ schema: "school", name: "rooms" })
export class Rooms {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "content_id" })
  content_id: number;

  @Column("int", { name: "seller_id" })
  seller_id: number;

  @Column("int", { name: "buyer_id" })
  buyer_id: number;

  @Column("boolean", { name: "seller_out" })
  seller_out: boolean;

  @Column("boolean", { name: "buyer_out" })
  buyer_out: boolean;

  @Column("timestamp", { name: "seller_confirm_time" })
  seller_confirm_time: Date;

  @Column("timestamp", { name: "buyer_confirm_time" })
  buyer_confirm_time: Date;

  @OneToMany(() => Chats, (chat) => chat.id)
  chats: Chats[];
}
