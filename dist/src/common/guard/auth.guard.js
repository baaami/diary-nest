"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_shared_service_1 = require("../../api/auth/auth.shared.service");
let AuthGuard = class AuthGuard {
    constructor(jwtService, authSharedService) {
        this.jwtService = jwtService;
        this.authSharedService = authSharedService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        return this.validateUser(request);
    }
    validateUser(request) {
        let cookieType = false;
        let headerType = false;
        if (request.hasOwnProperty("cookies") == true) {
            if (request.cookies.access_token) {
                cookieType = true;
            }
        }
        if (request.headers.hasOwnProperty("authorization") == true) {
            headerType = true;
        }
        let accessToken;
        if (cookieType == false && headerType == false) {
            if (request.method === "GET") {
                this.authSharedService.setLogined(false);
                return true;
            }
            return false;
        }
        if (headerType) {
            accessToken = request.headers.authorization.split("Bearer ")[1];
        }
        else {
            accessToken = request.cookies.access_token;
        }
        if (!accessToken) {
            return false;
        }
        try {
            const decoded = this.jwtService.verify(accessToken.toString(), { secret: process.env.JWT_SECRET_KEY });
            if (typeof decoded !== "object" ||
                decoded.hasOwnProperty("user") === false)
                return false;
            this.authSharedService.setLogined(true);
            this.authSharedService.setUser(decoded.user);
            return true;
        }
        catch (err) {
            if (request.method === "GET") {
                this.authSharedService.setLogined(false);
                return true;
            }
            return false;
        }
    }
};
AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        auth_shared_service_1.AuthSharedService])
], AuthGuard);
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth.guard.js.map