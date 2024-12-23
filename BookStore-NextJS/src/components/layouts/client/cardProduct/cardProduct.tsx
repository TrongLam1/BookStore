/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable @next/next/no-img-element */
'use client'
import { AddProductToCart, AddProductToCartSession } from "@/app/api/shoppingCartApi";
import { useShoppingCart } from "@/provider/shoppingCartProvider";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from 'js-cookie';
import Link from "next/link";
import { toast } from "react-toastify";
import styles from './cardProduct.module.scss';

const CardProduct = (props: any) => {
    const { book, col, user } = props;
    const { setShoppingCart } = useShoppingCart();

    const handleAddProductToCart = async (productId: number) => {
        if (user) {
            const res = await AddProductToCart({
                bookId: productId,
                quantity: 1
            });

            if (+res.statusCode === 201) {
                toast.success("Thêm sản phẩm thành công.");
                setShoppingCart({
                    totalItems: res.data.totalItems,
                    totalPrices: res.data.totalPrices,
                    cartItems: res.data.cartItems
                })
            } else {
                toast.error("Thêm sản phẩm thất bại.");
            }
        } else {
            const sessionId = Cookies.get('sessionId');

            const res = await AddProductToCartSession({
                bookId: productId,
                quantity: 1,
                sessionId: sessionId === undefined ? null : sessionId
            });

            if (+res.statusCode === 201) {
                toast.success("Thêm sản phẩm thành công.");
                setShoppingCart({
                    totalItems: res.data.shoppingCart.totalItems,
                    totalPrices: res.data.shoppingCart.totalPrices,
                    cartItems: res.data.shoppingCart.cartItems
                })
            } else {
                toast.error("Thêm sản phẩm thất bại.");
            }

            if (!sessionId) {
                Cookies.set('sessionId', res.data.sessionId, { expires: 7 });
            }
        }
    };

    return (
        <div className={`${col} col-sm-4`}>
            <div className={styles.bookCardWrap}>
                <div className={styles.bookCard}>
                    <Link className={styles.bookImg} href={`/book/${book?.id}`}>
                        <img src={book?.imageUrl} alt="" />
                    </Link>
                    <Link className={styles.bookName} href={`/book/${book?.id}`}>
                        {book?.name}
                    </Link>
                    <div className={styles.wrapBookInfo}>
                        <div className={styles.bookPrice}>
                            <div className={styles.salePrice}>
                                {book?.currentPrice.toLocaleString()}đ
                            </div>
                            <div className={styles.saleWrap}>
                                <div className={styles.oldPrice}>{book?.price.toLocaleString()}d</div>
                                <div className={styles.sale}>-{book?.sale}%</div>
                            </div>
                        </div>
                        <div className={styles.addBook}>
                            <button title="Add Product"
                                className={styles.addBookBtn}
                                onClick={() => handleAddProductToCart(book.id)}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardProduct;