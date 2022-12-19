import { Column, 
  CreateDateColumn, 
  DeleteDateColumn, 
  Entity, 
  JoinColumn, 
  ManyToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";

@Entity({ schema: 'diary', name: 'image' })
export class Images{
  @PrimaryGeneratedColumn({type:'int',name:'id'})
  id:number;

  @Column('varchar', {name:'path', length:100})
  contents:string;  

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column('int', { name: 'postId', nullable: false })
  postId: number | null;

  // @ManyToOne(()=>User,(users)=>users.id,{
  //     onDelete: 'SET NULL',
  //     onUpdate: 'CASCADE',
  // })
  // @JoinColumn([{ name: 'postUserId', referencedColumnName: 'id' }])
  // PostUserId: User;
}