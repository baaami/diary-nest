import { CreateUserDto } from "./create-user.dto";
declare const UpdateLocationDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateUserDto>>;
export declare class UpdateLocationDto extends UpdateLocationDto_base {
    readonly latitude: number;
    readonly longitude: number;
    readonly location: string;
}
export {};
