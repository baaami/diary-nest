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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtMiddleWare = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../api/user/entities/user.entity");
const typeorm_2 = require("typeorm");
let JwtMiddleWare = class JwtMiddleWare {
    constructor(jwtService, userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }
    async use(req, res, next) {
        if ("authorization" in req.headers) {
            const token = req.headers["authorization"];
            try {
                const decoded = this.jwtService.verify(token.toString());
                if (typeof decoded === "object" && decoded.hasOwnProperty("user")) {
                    const member = await this.userRepository.findOneBy({
                        email: decoded.user.email,
                    });
                    if (member) {
                        req.body["userId"] = member.id;
                        next();
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            res.sendStatus(401);
        }
    }
};
JwtMiddleWare = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.Users)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_2.Repository])
], JwtMiddleWare);
exports.JwtMiddleWare = JwtMiddleWare;
//# sourceMappingURL=jwt.middleware.js.map