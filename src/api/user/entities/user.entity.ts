import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Contents } from "src/api/content/entities/content.entity";
import { IsOptional } from "class-validator";
import { Reviews } from "src/common/entities/review.entity";

@Entity({ schema: "school", name: "users" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 20  })
  name: string;
  
  @UpdateDateColumn()
  birth: Date;

  @Column("varchar", { name: "nickname", length: 20 })
  nickname: string;

  @Column("varchar", { name: "email", length: 100 })
  email: string;

  @Column("boolean", { name: "is_sns" })
  is_sns: boolean;

  @Column("varchar", { name: "university", length: 50 })
  university: string;

  @Column("int", { name: "gender" })
  gender: number;

  @Column("varchar", { name: "latitude", length: 50 })
  latitude: string;

  @Column("varchar", { name: "longitude", length: 50 })
  longitude: string;

  @Column("varchar", { name: "location", length: 100 })
  location: string;

  @Column("int", { name: "grade" })
  grade: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Reviews, (review) => review.id)
  reviews: Reviews[];

  @OneToMany(() => Reviews, (favorite) => favorite.id)
  favorites: Reviews[];

  @OneToMany(() => Contents, (content) => content.id)
  contents: Contents[];
}
