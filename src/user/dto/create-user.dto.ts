import { IsString, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly email: number;

  @IsString()
  readonly name: string[];

  @IsNumber()
  readonly age: number;

}
