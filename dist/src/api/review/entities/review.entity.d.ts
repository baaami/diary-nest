import { Users } from "src/api/user/entities/user.entity";
export declare class Reviews {
    id: number;
    grade: number;
    review: string;
    buyer: Users;
    seller: Users;
}
