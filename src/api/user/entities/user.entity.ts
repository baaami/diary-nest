import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Contents } from 'src/api/content/entities/content.entity';
import { IsOptional } from 'class-validator';

@Entity({ schema: 'diary', name: 'users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', unique: true, length: 30 })
  email: string;

  @Column('varchar', { name: 'name', length: 20, nullable: true })
  name: string;

  @Column('varchar', { name: 'nickname', length: 20, nullable: true })
  nickname: string;

  @Column('int', { name: 'age', nullable: true })
  age: number;

  @Column('int', { name: 'gender', nullable: true })
  gender: number;

  @Column('varchar', { name: 'school', length: 20, nullable: true })
  school: string;

  @Column('varchar', { name: 'major', length: 50, nullable: true })
  major: string;

  @Column('int', { name: 'studentId', nullable: true })
  studentId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany((type) => Contents, (content) => content.id)
  contents: Contents[];
}
