import { Column, 
  CreateDateColumn, 
  DeleteDateColumn, 
  Entity, 
  JoinColumn, 
  OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";
import { Contents } from "src/content/entities/content.entity";


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

  @OneToMany(type  => Contents, content => content.id)
  contents:Contents[]
}


// @OneToMany(type => Photo, photo => photo.user)
// photos: Photo[]