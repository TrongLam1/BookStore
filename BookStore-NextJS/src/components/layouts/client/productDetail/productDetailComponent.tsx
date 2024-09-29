/* eslint-disable @next/next/no-img-element */
'use client';

import { faMinus, faPlus, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductDetailComponent(props: any) {

    const { productDetail } = props;

    const category = productDetail.category;
    const brand = productDetail.brand;

    const [quantityProduct, setQuantityProduct] = useState(1);

    useEffect(() => {
        if (productDetail) document.title = productDetail.name
    }, [productDetail])

    const handleChangeQuantity = (e: any, action: any) => {
        e.preventDefault();
        setQuantityProduct(prevQuantity => {
            if (action === "increase") {
                return prevQuantity + 1;
            } else if (action === "decrease" && prevQuantity > 1) {
                return prevQuantity - 1;
            }
            return prevQuantity;
        });
    }

    const elementSavePrice = (item: any) => {
        const save = item?.price - item?.currentPrice;
        if (save !== undefined && save > 0) {
            return (<div className="product-info-body">
                <div className="d-flex align-items-center">
                    <div className="product-info-sale-price">
                        {item?.currentPrice?.toLocaleString()}đ
                    </div>
                    <div className="product-info-price">{item?.price?.toLocaleString()}đ</div>
                    <div className="product-info-sale">-{item?.sale}%</div>
                </div>
                <div className="save">( Tiết kiệm: <span>{save.toLocaleString()}đ</span> )</div>
            </div>)
        } else {
            return (<div className="product-info-body">
                <div className="d-flex align-items-center">
                    <div className="product-info-sale-price">
                        {item?.currentPrice?.toLocaleString()}đ
                    </div>
                </div>
            </div>)
        }
    }

    const elementBtnAdd = (item: any) => {
        if (item && item.inventory > 0) {
            return (<button type="button" data-id={item.id} className="btn btn_add_cart btn-cart add_to_cart">
                Thêm vào giỏ hàng
            </button>)
        } else {
            return (<button type="button" className="btn btn_add_cart btn-cart add_to_cart sold-out" disabled>
                Hết hàng
            </button>)
        }
    }

    return (
        <>
            <div className="direction-page d-flex">
                <Link href='/home'>Trang chủ</Link>/
                <Link href={`/category/${category.categoryName}`}>
                    {category.categoryName}
                </Link>/
                <span>{productDetail.name}</span>
            </div>
            <div className="product-detail-container row">
                <div className="product-detail-section col-lg-9">
                    <div className="product-info-wrap row">
                        <div className="product-info-img col-lg-5">
                            <img src={productDetail.imageUrl} alt="" />
                        </div>
                        <div className="product-info col-lg-7">
                            <div>
                                <div className="product-info-heading">
                                    <div className="product-name">
                                        <h4>{productDetail.name}</h4>
                                        <div className="rating">
                                            {`(`}
                                            <FontAwesomeIcon icon={faStar} />
                                            {productDetail.rating}
                                            {`)`}
                                        </div>
                                    </div>
                                    <div className="product-branch">
                                        Thương hiệu: {brand.brandName}
                                    </div>
                                </div>
                                {elementSavePrice(productDetail)}
                                <div className="product-info-add-quantity d-flex align-items-center">
                                    <span>Số lượng: </span>
                                    <div className="d-flex">
                                        <button type="button"
                                            className="btn-left"
                                            onClick={(e) => handleChangeQuantity(e, "decrease")}
                                        >
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        <input
                                            type="text"
                                            className="quantity"
                                            min={1}
                                            value={quantityProduct}
                                            readOnly
                                        />
                                        <button type="button"
                                            className="btn-right"
                                            onClick={(e) => handleChangeQuantity(e, "increase")}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                </div>
                                <div className="product-btn-add-cart">
                                    {elementBtnAdd(productDetail)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="coupon-container">
                        <div id="direction-coupon">
                            <Link href="/coupon">Danh sách coupon</Link>
                        </div>
                        <div>

                        </div>
                    </div>
                </div>
                <div className="product-description-container">
                    <div className="product-description-heading">
                        <h5>GIỚI THIỆU</h5>
                    </div>
                    <div className="product-description-body">
                        <div className="description-content">
                            {productDetail.description}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}