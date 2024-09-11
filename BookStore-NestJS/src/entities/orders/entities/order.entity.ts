import { OrderItem } from "src/entities/order-item/entities/order-item.entity";
import { User } from "src/entities/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @ManyToOne(() => User, user => user.orders)
    user: User;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    orderItems: OrderItem[];

    @Column()
    address: string;

    @Column()
    phone: string;

    @Column()
    username: string;

    @Column()
    valueCoupon: number;

    @Column()
    totalItemsOrder: number;

    @Column('float')
    totalPriceOrder: number;

    @Column('date')
    paymentDate: Date;

    @Column()
    paymentStatus: string;

    @Column()
    paymentMethod: string;

    @Column()
    codeBill: string;
}
