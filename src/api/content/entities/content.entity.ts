import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Users } from "src/api/user/entities/user.entity";
import { Images } from "src/common/entities/image.entity";

@Entity({ schema: "school", name: "contents" })
export class Contents {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "title", length: 30 })
  title: string;

  @Column("varchar", { name: "content", length: 100 })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Users)
  @JoinColumn([{ name: "user" }])
  userId: number | null;

  @OneToMany((type) => Images, (images) => images.content)
  image: Images;
}
