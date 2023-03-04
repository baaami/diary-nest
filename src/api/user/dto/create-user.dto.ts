import { IsString, IsNumber } from "class-validator";

export class CreateUserDto {
  @IsString()
  readonly email: string;
}
