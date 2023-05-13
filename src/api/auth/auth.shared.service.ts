// auth-shared.service.ts
import { Injectable } from "@nestjs/common";
import { Users } from "../user/entities/user.entity";

@Injectable()
export class AuthSharedService {
  private isLogined: boolean = false;
  private loginedUser: Users | undefined = undefined;

  setLogined(value: boolean) {
    this.isLogined = value;
    if (this.isLogined === false) {
      this.loginedUser = undefined;
    }
  }

  setUser(user: Users) {
    this.loginedUser = user;
  }

  getLogined(): boolean {
    return this.isLogined;
  }

  getUser(): Users {
    return this.loginedUser;
  }
}
