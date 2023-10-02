import { Contents } from "src/api/content/entities/content.entity";
import { Users } from "src/api/user/entities/user.entity";
export declare class Favorites {
    id: number;
    user: Users;
    content: Contents;
}
