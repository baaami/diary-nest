import { Users } from "src/api/user/entities/user.entity";
export declare class ProfileImages {
    id: number;
    path: string;
    createdAt: Date;
    updatedAt: Date;
    user: Users[];
}
