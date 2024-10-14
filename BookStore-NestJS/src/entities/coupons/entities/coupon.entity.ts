import { Min, min } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Coupon {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ unique: true })
    nameCoupon: string;

    @Column({ default: 1000 })
    @Min(1000, { message: "Min value's value coupon is 1000" })
    valueCoupon: number;

    @Column({ default: 1000 })
    @Min(1000, { message: "Min value's condition is 1000" })
    condition: number;

    @Column()
    descriptionCoupon: string;

    @Column({ default: 0 })
    @Min(0, { message: "Min value's quantity is 0" })
    quantity: number;

    @Column({ default: true })
    isAvailable: boolean;

    @Column('date')
    expiredDate: Date;
}
