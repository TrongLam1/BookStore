'use client'
import Link from "next/link";
import './paymentResultComponent.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { FindOrderByCodeBill } from "@/app/api/orderApi";

export default function PaymentResultComponent(props: any) {

    const { params } = props;
    const [order, setOrder] = useState<any>();
    const codeBill = params.codeBill;

    useEffect(() => {
        const fetchOrder = async () => {
            const res = await FindOrderByCodeBill(codeBill);
            setOrder(res?.data);  // Set the resolved data into the state
        }

        fetchOrder();
    }, []);

    return (
        <div className="payment-success-container">
            <div className="payment-success-wrap">
                <div className="payment-success-heading">
                    <div className="success-icon">
                        <FontAwesomeIcon icon={faCheck} />
                    </div>
                    <div className="success-title">
                        Thanh toán thành công
                    </div>
                </div>
                <div className="payment-success-body">
                    <div className="payment-item">
                        <span>Phương thức thanh toán:</span>
                        <span>{order?.paymentMethod?.toUpperCase()}</span>
                    </div>
                    <div className="payment-item">
                        <span>Thời gian thanh toán:</span>
                        <span>{order?.updateAt}</span>
                    </div>
                    <div className="payment-item">
                        <span>Khách hàng:</span>
                        <span>{order?.username}</span>
                    </div>
                    <div className="payment-item payment-amount">
                        <span>Số tiền:</span>
                        <span>{order?.totalPriceOrder?.toLocaleString()}đ</span>
                    </div>
                    <div className="payment-item">
                        <span>Mã giao dịch:</span>
                        <span>{order?.bankNo}</span>
                    </div>
                </div>
                <div className="payment-success-footer">
                    <Link href='/home'>Trở về trang chủ</Link>
                </div>
            </div>
        </div>
    )
}