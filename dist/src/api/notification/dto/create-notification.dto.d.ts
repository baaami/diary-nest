import { Users } from "src/api/user/entities/user.entity";
export declare class CreateNotification {
    type: number;
    msg: string;
    confirmed: boolean;
    notifier: Users;
    receiver: Users;
}
