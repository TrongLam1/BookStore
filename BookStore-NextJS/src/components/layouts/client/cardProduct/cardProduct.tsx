'use client'
import Link from "next/link";

const CardProduct = (props: any) => {

    return (
        <>
            {/* {listProducts && listProducts.length > 0 ?
                listProducts.map((item, index) => {
                    return (
                        <div key={`books-${index}`} className={`${props.col} col-6 col-sm-4`}>
                            <div className="book-card-wrap">
                                <div className="book-card">
                                    <Link className='book-img' href={`${`/book/${item.id}`}`}>
                                        <img src={item.image_url} alt="" />
                                    </Link>
                                    <Link className='book-name' href={`${`/book/${item.id}`}`}>
                                        {item.name}
                                    </Link>
                                    <div className="wrap-book-info">
                                        <div className="book-price">
                                            <div className="sale-price">{item.salePrice.toLocaleString()}đ</div>
                                            <div className="sale-wrap">
                                                <div className="old-price">{item.price.toLocaleString()}d</div>
                                                <div className="sale">-{item.sale}%</div>
                                            </div>
                                        </div>
                                        <div className="add-book">
                                            <button
                                                className="add-book-btn"
                                                onClick={() => handleAddProduct(item.id)}
                                            >
                                                <i className="fa-solid fa-circle-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }) : <div>Không có sản phẩm</div>
            } */}
            <div>Không có sản phẩm</div>
        </>
    );
};

export default CardProduct;