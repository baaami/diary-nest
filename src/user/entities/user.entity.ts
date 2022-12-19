import { Column, 
  CreateDateColumn, 
  DeleteDateColumn, 
  Entity, 
  OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";


@Entity({ schema: 'diary', name: 'user' })
export class Users{
  @PrimaryGeneratedColumn({type:'int',name:'id'})
  id:number;

  @Column('varchar', {name:'email', unique:true ,length:30})
  email:string;  

  @Column('varchar',{name:'name', length:20})
  name:string;

  @Column('int',{name:'age'})
  age:number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // @OneToMany(
  //     () => Post, (posts)=>posts.id
  // )
  // OwnedUserPosts:Post[]
}