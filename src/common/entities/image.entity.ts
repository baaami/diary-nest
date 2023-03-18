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
} from "typeorm";
import { Contents } from "src/api/content/entities/content.entity";
import { IsOptional } from "class-validator";
import { Users } from "src/api/user/entities/user.entity";

@Entity({ schema: "school", name: "images" })
export class Images {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "filename", length: 100, nullable: true })
  filename: string;

  @Column("varchar", { name: "path", length: 100, nullable: true })
  path: string;

  @Column("varchar", { name: "fieldname", length: 100 })
  fieldname: string;

  @Column("varchar", { name: "originalname", length: 100 })
  originalname: string;

  @Column("varchar", { name: "encoding", length: 100 })
  encoding: string;

  @Column("varchar", { name: "mimetype", length: 100 })
  mimetype: string;

  @Column("varchar", { name: "destination", length: 100, nullable: true })
  destination: string;

  @Column("int", { name: "size" })
  size: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Contents, (content) => content.images)
  @JoinColumn({ name: "content_id" })
  content: Contents;

  @OneToOne(() => Users, (user) => user.images)
  @JoinColumn({ name: "user_id" })
  user: Users;
}
