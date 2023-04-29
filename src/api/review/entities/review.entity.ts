import { Users } from "src/api/user/entities/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ schema: "school", name: "reviews" })
export class Reviews {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "grade" })
  grade: number;

  @Column("varchar", { name: "review", length: 2000 })
  review: string;

  @ManyToOne(() => Users, (buyer) => buyer.id)
  @JoinColumn({ name: "buyer_id" })
  buyer: Users;

  @ManyToOne(() => Users, (seller) => seller.id)
  @JoinColumn({ name: "seller_id" })
  seller: Users;
}

/** sample code
 * const result = await reviewsRepository
  .createQueryBuilder('reviews')
  .leftJoinAndSelect('reviews.buyer', 'buyer')
  .leftJoinAndSelect('reviews.seller', 'seller')
  .select([
    'reviews.id',
    'reviews.review',
    'buyer.id',
    'buyer.name',
    'seller.id',
    'seller.name',
  ])
  .getMany();

 */
