import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Users } from "src/api/user/entities/user.entity";
import { Images } from "src/common/entities/image.entity";
import { Reviews } from "src/common/entities/review.entity";

@Entity({ schema: "school", name: "contents" })
export class Contents {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "title", length: 30 })
  title: string;

  @Column("varchar", { name: "body", length: 2000 })
  body: string;
  
  @Column("varchar", { name: "category", length: 100 })
  category: string;

  @Column("boolean", { name: "completed" })
  completed: boolean;

  @Column("int", { name: "price" })
  price: number;

  @Column("int", { name: "like_cnt" })
  like_cnt: number;

  @Column("int", { name: "chat_cnt" })
  chat_cnt: number;

  @UpdateDateColumn()
  completed_date: Date;

  @OneToOne(() => Users, buyer => buyer.id)
  @JoinColumn({ name: "buyer_id" })
  buyer: Users;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Users)
  @JoinColumn([{ name: "user" }])
  userId: number | null;

  @OneToMany(() => Reviews, (review) => review.id)
  favorites: Reviews[];

  @OneToMany((type) => Images, (images) => images.content)
  image: Images;
}
