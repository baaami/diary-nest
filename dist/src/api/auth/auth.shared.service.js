"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSharedService = void 0;
const common_1 = require("@nestjs/common");
let AuthSharedService = class AuthSharedService {
    constructor() {
        this.isLogined = false;
        this.loginedUser = undefined;
    }
    setLogined(value) {
        this.isLogined = value;
        if (this.isLogined === false) {
            this.loginedUser = undefined;
        }
    }
    setUser(user) {
        this.loginedUser = user;
    }
    getLogined() {
        return this.isLogined;
    }
    getUser() {
        return this.loginedUser;
    }
};
AuthSharedService = __decorate([
    (0, common_1.Injectable)()
], AuthSharedService);
exports.AuthSharedService = AuthSharedService;
//# sourceMappingURL=auth.shared.service.js.map