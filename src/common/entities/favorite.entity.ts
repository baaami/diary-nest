import { Contents } from "src/api/content/entities/content.entity";
import { Users } from "src/api/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: "school", name: "favorites"})
export class Favorites {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "review", length: 100 })
  review: string;

  @ManyToOne(() => Users, user => user.favorites)
  @JoinColumn({ name: "user_id" })
  user: Users;

  @ManyToOne(() => Contents, content => content.favorites)
  @JoinColumn({ name: "content_id" })
  content: Contents;
}
