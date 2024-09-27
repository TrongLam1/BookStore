/* eslint-disable @next/next/no-img-element */
'use client'
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import styles from './cardProduct.module.scss';

const CardProduct = (props: any) => {

    const { book, col } = props;

    return (
        <div className={`${col} col-6 col-sm-4`}>
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
                            // onClick={() => handleAddProduct(item.id)}
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