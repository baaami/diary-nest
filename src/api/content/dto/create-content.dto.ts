import { IsString, IsNumber, IsOptional, IsObject } from "class-validator";
import { Users } from "src/api/user/entities/user.entity";
import { Images } from 'src/common/entities/image.entity';

export class CreateContentDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly body: string;

  @IsString()
  category: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  location: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsObject()
  owner: Users;
}
