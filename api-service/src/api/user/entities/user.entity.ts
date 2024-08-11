import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Contents } from "src/api/content/entities/content.entity";
import { IsOptional } from "class-validator";
import { Reviews } from "src/api/review/entities/review.entity";
import { Favorites } from "src/common/entities/favorite.entity";
import { ProductImages } from "src/common/entities/productimage.entity";
import { ProfileImages } from "src/common/entities/profileimage.entity";

@Entity({ schema: "school", name: "users" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 20, nullable: true })
  name: string;

  @UpdateDateColumn()
  birth: Date;

  @Column("varchar", { name: "nickname", length: 20, nullable: true })
  nickname: string;

  @Column("varchar", { name: "email", length: 100 })
  email: string;

  @IsOptional()
  @Column("varchar", { name: "password", length: 100, nullable: true })
  password: string;

  @Column("varchar", { name: "university", length: 50, nullable: true })
  university: string;

  @Column("int", { name: "gender", nullable: true })
  gender: number;

  @Column("float", { name: "latitude", nullable: true })
  latitude: number;

  @Column("float", { name: "longitude", nullable: true })
  longitude: number;

  @Column("varchar", { name: "location", length: 100, nullable: true })
  location: string;

  @Column("float", { name: "grade", nullable: true })
  grade: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Reviews, (review) => review.id)
  reviews: Reviews[];

  @ManyToMany(() => Favorites, (favorite) => favorite.id)
  favorites: Favorites[];

  @OneToMany(() => Contents, (content) => content.seller)
  contents: Contents;

  @ManyToOne(() => ProfileImages, (image) => image.user)
  @JoinColumn({ name: "profile_image_id" })
  profileImage: ProfileImages;
}
