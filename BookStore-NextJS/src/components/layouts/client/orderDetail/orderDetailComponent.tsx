'use client'

import Link from "next/link";
import './orderDetailComponent.scss';
import OrderItem from "./orderItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { CancelOrder, PaymentBanking } from "@/app/api/orderApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function OrderDetailComponent(props: any) {

    const router = useRouter();

    const { order } = props;
    const orderItems = order.orderItems;
    const [orderData, setOrderData] = useState(order);

    useEffect(() => { }, [orderData]);

    const date = new Date(order.createdAt);

    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };

    const formattedDate = date.toLocaleString('en-GB', options).replace(/\//g, '-');

    const renderBtnPayment = () => {
        if (order?.orderStatus === "Đã hoàn thành" || order?.orderStatus === "Đã hủy") {
            return ('')
        }

        if (order?.paymentMethod === "BANKING" && order?.paymentStatus === "Chưa thanh toán") {
            return (
                <div
                    className="payment-order d-flex justify-content-end"
                    onClick={() => handlePayment(orderData?.id)}
                >
                    <button type="button">Thanh toán</button>
                </div>
            )
        } else {
            return ('')
        }
    };

    const renderBtnCancelOrder = () => {
        if (order?.orderStatus !== "Đã hoàn thành" && order?.orderStatus !== "Đã hủy") {
            return (
                <div
                    className="cancel-order d-flex justify-content-end"
                    onClick={() => handleCancelOrder(orderData?.id)}
                >
                    <button type="button">Hủy</button>
                </div>
            )
        } else {
            return (
                <div
                    className="cancel-order d-flex justify-content-end"
                >
                    <button disabled type="button">Đã hủy</button>
                </div>
            )
        }
    };

    const handlePayment = async (orderId: string) => {
        const res = await PaymentBanking(+orderId);
        if (res.statusCode === 201) {
            router.push(res.data);
        } else {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    }

    const handleCancelOrder = async (orderId: string) => {
        const res = await CancelOrder(+orderId);
        if (res.statusCode === 200) {
            toast.success("Hủy đơn hàng thành công.");
            setOrderData(res.data);
            router.refresh();
        } else { toast.error("Hủy đơn hàng thất bại.") };
    };

    return (
        <div className="order-detail-container row d-flex justify-content-evenly">
            <div className="heading">
                <Link href='/profile/history-orders'>
                    <FontAwesomeIcon icon={faCircleLeft} />
                </Link>
                <span className="title-heading">Chi tiết đơn hàng</span>
            </div>
            <div className="order-detail-wrap col-lg-7">
                <div className="order-detail-body">
                    <table className="table table-responsive">
                        <thead className="table-warning text-center">
                            <tr>
                                <th style={{ verticalAlign: 'middle' }}>Sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems && orderItems.length > 0 &&
                                orderItems.map((item, index: number) => {
                                    return (<OrderItem item={item} key={`order-${index}`} />)
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="order-info-user col-lg-4">
                <div className="order-info-container">
                    <div className="order-info-user-heading">Thông tin khách hàng</div>
                    <div className="order-info-user-body">
                        <div className="info-user">
                            <div className="info-order-code">
                                Mã đơn hàng:
                                <span id="order-code">#{order?.id}</span>
                            </div>
                            <div className="info-user-name">
                                Họ và tên:
                                <span id="name">{order?.username}</span>
                            </div>
                            <div className="info-user-phone">
                                Số điện thoại:
                                <span id="phone">{order?.phone}</span>
                            </div>
                            <div className="info-user-create">
                                Ngày đặt:
                                <span id="create">{formattedDate}</span>
                            </div>
                            <div className="info-user-payment">
                                Thanh toán:
                                <span id="payment">{order?.paymentMethod?.toUpperCase()}</span>
                            </div>
                            <div className="info-user-payment">
                                Trạng thái thanh toán:
                                <span id="payment">{order?.paymentStatus}</span>
                            </div>
                            <div className="info-user-address">
                                Địa chỉ:
                                <span id="address">{order?.address}</span>
                            </div>
                            <div className="info-user-subtotal">
                                Tổng:
                                <span id="subtotal">{order?.totalPriceOrder?.toLocaleString()}đ</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                {renderBtnPayment()}
                                {renderBtnCancelOrder()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};