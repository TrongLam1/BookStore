import { Comment } from 'src/entities/comments/entities/comment.entity';
import { Order } from 'src/entities/orders/entities/order.entity';
import { Role } from 'src/entities/role/entities/role.entity';
import { ShoppingCart } from 'src/entities/shopping-cart/entities/shopping-cart.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    phone: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @Column({ default: false })
    isActive: boolean;

    @Column()
    code: string;

    @Column()
    codeExpired: Date;

    @Column()
    refreshToken: string;

    @OneToOne(() => ShoppingCart)
    @JoinColumn()
    shoppingCart: ShoppingCart;

    @OneToMany(() => Order, order => order.user)
    orders: Order[];

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable()  // This creates the user_roles table
    roles: Role[];
}
