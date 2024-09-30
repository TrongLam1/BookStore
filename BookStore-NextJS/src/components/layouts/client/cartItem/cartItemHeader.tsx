/* eslint-disable @next/next/no-img-element */
'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './cartItemHeader.scss';
import { faRectangleXmark } from '@fortawesome/free-solid-svg-icons';

export default function CartItemHeaderComponent(props: any) {

    const { cartItem } = props;

    const product: IBook = cartItem?.book;

    const handleRemoveProduct = (id: number) => { }

    const handleUpdateQuantity = (id: number, quantity: string) => { }

    return (
        <li className="product-cart d-flex list-group-item">
            <div className="product-cart-img">
                <img src={product.imageUrl} alt="" />
            </div>
            <div className="product-cart-info">
                <div className="product-cart-heading d-flex justify-content-between">
                    <div className="product-cart-name">
                        {product.name}
                    </div>
                    <button className='product-cart-remove'
                        onClick={() => handleRemoveProduct(cartItem.id)}>
                        <FontAwesomeIcon icon={faRectangleXmark} />
                    </button>
                </div>
                <div className="product-cart-other d-flex justify-content-between">
                    <div className="product-cart-quantity">
                        <input
                            type="number"
                            value={cartItem.quantity}
                            min={1}
                            onChange={(e) => handleUpdateQuantity(product.id, e.target.value)}
                        />
                    </div>
                    <div className="product-cart-price">
                        {product.currentPrice.toLocaleString()}
                    </div>
                </div>
            </div>
        </li>
    )
};