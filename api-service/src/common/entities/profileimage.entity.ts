import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Contents } from "src/api/content/entities/content.entity";
import { IsOptional } from "class-validator";
import { Users } from "src/api/user/entities/user.entity";

@Entity({ schema: "school", name: "profileimages" })
export class ProfileImages {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "path", length: 100, nullable: true })
  path: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Users, (user) => user.profileImage)
  user: Users[];
}
