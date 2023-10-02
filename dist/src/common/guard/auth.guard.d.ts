import { CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { AuthSharedService } from "src/api/auth/auth.shared.service";
export declare class AuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly authSharedService;
    constructor(jwtService: JwtService, authSharedService: AuthSharedService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    private validateUser;
}
