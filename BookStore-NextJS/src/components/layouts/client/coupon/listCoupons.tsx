'use client'

import Link from "next/link";
import { useState } from "react";
import CouponItem from "./couponItem";
import './listCoupons.scss';

export default function ListCoupons(props: any) {

    const { coupons } = props;

    return (
        <div className="coupons-page">
            <div className="direction-page d-flex">
                <Link href='/home'>Trang chủ</Link>
                /
                <span>Danh sách coupon</span>
            </div>
            <div className="coupon-container">
                <div className="coupon-item row">
                    {coupons && coupons.length > 0 &&
                        coupons.map((item, index: number) => {
                            return (
                                <CouponItem key={`coupon-${index}`} item={item} col={'col-lg-3'} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}