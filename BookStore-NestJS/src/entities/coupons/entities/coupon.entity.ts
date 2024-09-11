import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Coupon {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    nameCoupon: string;

    @Column()
    valueCoupon: number;

    @Column()
    condition: number;

    @Column()
    descriptionCoupon: string;

    @Column()
    quantity: number;

    @Column('date')
    expiredDate: Date;
}
