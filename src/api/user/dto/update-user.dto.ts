import { IsString, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    readonly name: string;

    @IsString()
    readonly nickname: string;

    @IsNumber()
    readonly age: number;

    @IsNumber()
    readonly gender: number;

    @IsString()
    readonly school: string;

    @IsString()
    readonly major: string;

    @IsNumber()
    readonly studentId: number;
}
