import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { Users } from "src/api/user/entities/user.entity";
import { Repository } from "typeorm";
export declare class JwtMiddleWare implements NestMiddleware<Request, Response> {
    private readonly jwtService;
    private userRepository;
    constructor(jwtService: JwtService, userRepository: Repository<Users>);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
