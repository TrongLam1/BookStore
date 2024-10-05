import { OrderItem } from "src/entities/order-item/entities/order-item.entity";
import { User } from "src/entities/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum OrderStatus {
    CANCELED = "Đã hủy",
    PENDING = "Đang xử lí",
    SHIPPING = "Đang giao hàng",
    COMPLETED = "Đã hoàn thành",
}

export enum PaymentMethod {
    SHIP_COD = "SHIP COD",
    BANKING = "BANKING",
}

export enum PaymentStatus {
    PAID = "Đã thanh toán",
    UNPAID = "Chưa thanh toán"
}

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

    @Column({ default: 0 })
    valueCoupon: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    orderStatus: OrderStatus;

    @Column()
    totalItemsOrder: number;

    @Column('float')
    totalPriceOrder: number;

    @Column('date', { nullable: true })
    paymentDate: Date;

    @Column({
        type: 'enum',
        enum: PaymentStatus
    })
    paymentStatus: string;

    @Column({
        type: 'enum',
        enum: PaymentMethod
    })
    paymentMethod: PaymentMethod;

    @Column({ nullable: true })
    codeBill: string;

    @Column({ nullable: true })
    bankNo: string;
}
