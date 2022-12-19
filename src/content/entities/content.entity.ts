import { Column, 
  CreateDateColumn, 
  DeleteDateColumn, 
  Entity, 
  JoinColumn, 
  ManyToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";

@Entity({ schema: 'diary', name: 'contents' })
export class Contents{
  @PrimaryGeneratedColumn({type:'int',name:'id'})
  id:number;

  @Column('varchar', {name:'title', length:30})
  title:string;  

  @Column('varchar', {name:'body', length:100})
  body:string;  

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column('int', { name: 'userId' })
  userId: number | null;

  // @ManyToOne(()=>User,(users)=>users.id,{
  //     onDelete: 'SET NULL',
  //     onUpdate: 'CASCADE',
  // })
  // @JoinColumn([{ name: 'postUserId', referencedColumnName: 'id' }])
  // PostUserId: User;
}