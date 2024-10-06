'use client'

import HistoryOrderItem from "./historyOrderItem";

export default function HistoryOrdersPageComponent(props: any) {

    const { listOrders, totalPages } = props;

    console.log(listOrders);

    return (
        <>
            <div className="profile-content-header">
                Lịch sử mua hàng
            </div>
            <div className="profile-content-body">
                <div className="profile-body-title">Đơn đặt hàng</div>
                <div className="table-history-orders">
                    <table className="table table-striped table-responsive">
                        <thead>
                            <tr>
                                <th>Mã đơn hàng</th>
                                <th>Khách hàng</th>
                                <th>Thành tiền</th>
                                <th>Ngày đặt</th>
                                <th>Trạng thái</th>
                                <th>Chi tiết đơn hàng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listOrders && listOrders.length > 0 &&
                                listOrders.map((item, index: number) => {
                                    return (
                                        <HistoryOrderItem order={item} key={`order-item-${index}`} />
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}