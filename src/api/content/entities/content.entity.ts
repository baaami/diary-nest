import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Users } from "src/api/user/entities/user.entity";
import { ProductImages } from "src/common/entities/productimage.entity";
import { Reviews } from "src/api/review/entities/review.entity";
import { Favorites } from "src/common/entities/favorite.entity";

@Entity({ schema: "school", name: "contents" })
export class Contents {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Index({ fulltext: true })
  @Column("varchar", { name: "title", length: 100 })
  title: string;

  @Index({ fulltext: true })
  @Column("varchar", { name: "body", length: 2000 })
  body: string;

  @Column("varchar", { name: "category", length: 100 })
  category: string;

  @Column("boolean", {
    name: "seller_completed",
    nullable: true,
    default: false,
  })
  seller_completed: boolean;

  @Column("boolean", {
    name: "buyer_completed",
    nullable: true,
    default: false,
  })
  buyer_completed: boolean;

  @Column("int", { name: "latitude", nullable: true })
  latitude: number;

  @Column("int", { name: "longitude", nullable: true })
  longitude: number;

  @Column("varchar", { name: "location", length: 100, nullable: true })
  location: string;

  @Column("int", { name: "price" })
  price: number;

  @Column("int", { name: "like_cnt", default: 0 })
  like_cnt: number;

  @Column("boolean", { name: "like", default: false })
  like: boolean;

  @Column("int", { name: "chat_cnt", default: 0 })
  chat_cnt: number;

  @UpdateDateColumn()
  completed_date: Date;

  @ManyToOne(() => Users, (buyer) => buyer.id)
  @JoinColumn({ name: "buyer_id" })
  buyer: Users;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: "seller_id" })
  seller: Users;

  @ManyToMany(() => Favorites, (favorite) => favorite.id)
  favorites: Favorites[];

  @OneToMany(() => ProductImages, (image) => image.content)
  images: ProductImages[];
}
