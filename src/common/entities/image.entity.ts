import { Column, 
  CreateDateColumn, 
  DeleteDateColumn, 
  Entity, 
  JoinColumn, 
  ManyToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";
import { Contents } from "src/content/entities/content.entity";

@Entity({ schema: 'diary', name: 'images' })
export class Images{
  @PrimaryGeneratedColumn({type:'int',name:'id'})
  id:number;

  @Column('varchar', {name:'imagePath', length:100})
  imagePath:string;  

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Contents)
  @JoinColumn([{ name: 'content_id'}])
  contentId: number | null;
}