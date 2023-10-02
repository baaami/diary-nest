import { Users } from "../user/entities/user.entity";
export declare class AuthSharedService {
    private isLogined;
    private loginedUser;
    setLogined(value: boolean): void;
    setUser(user: Users): void;
    getLogined(): boolean;
    getUser(): Users;
}
