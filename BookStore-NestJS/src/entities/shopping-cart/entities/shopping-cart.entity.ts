import { CartItem } from 'src/entities/cart-item/entities/cart-item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ShoppingCart {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    totalItems: number;

    @Column('double', { precision: 15, scale: 2, default: 0 })
    totalPrices: number;

    @OneToMany(() => CartItem, cartItem => cartItem.shoppingCart)
    cartItems: CartItem[];
}
