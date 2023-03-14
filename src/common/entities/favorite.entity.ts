import { Contents } from "src/api/content/entities/content.entity";
import { Users } from "src/api/user/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: "school", name: "favorites" })
export class Favorites {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @ManyToOne(() => Users, (user) => user.favorites)
  @JoinColumn({ name: "user_id" })
  user: Users;

  @ManyToOne(() => Contents, (content) => content.favorites)
  @JoinColumn({ name: "content_id" })
  content: Contents;
}
