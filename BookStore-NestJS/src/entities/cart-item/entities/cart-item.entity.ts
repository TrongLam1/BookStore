import { Book } from "src/entities/books/entities/book.entity";
import { ShoppingCart } from "src/entities/shopping-cart/entities/shopping-cart.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ShoppingCart, shoppingCart => shoppingCart.cartItems)
    shoppingCart: ShoppingCart;

    @ManyToOne(() => Book)
    book: Book;

    @Column()
    quantity: number;

    @Column('float', { precision: 10, scale: 2 })
    totalPrice: number;
}
