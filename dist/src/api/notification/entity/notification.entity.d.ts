import { Users } from "src/api/user/entities/user.entity";
export declare class Notificaitions {
    id: number;
    type: number;
    msg: string;
    confirmed: boolean;
    createdAt: Date;
    notifier: Users;
    receiver: Users;
}
