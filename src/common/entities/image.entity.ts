import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Contents } from "src/api/content/entities/content.entity";
import { IsOptional } from "class-validator";

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

  @Column("int", { name: "contentId" })
  contentId: number;

  @ManyToOne((type) => Contents, (contents) => contents.image)
  content: Contents;
}
