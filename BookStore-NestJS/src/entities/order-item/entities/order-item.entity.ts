import { Book } from "src/entities/books/entities/book.entity";
import { Order } from "src/entities/orders/entities/order.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('double', { precision: 15, scale: 8 })
    currentPrice: number;

    @ManyToOne(() => Order, order => order.orderItems)
    order: Order;

    @ManyToOne(() => Book)
    book: Book;

    @Column()
    quantity: number;

    @Column('float')
    totalPrice: number;
}
