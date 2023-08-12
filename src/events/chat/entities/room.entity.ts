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

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Chats, (chat) => chat.id)
  chats: Chats[];
}
