
export const metadata = {
    title: 'Lịch sử đơn hàng'
}

export default function HistoryOrdersPage() {

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
                                <th>Địa chỉ</th>
                                <th>Thành tiền</th>
                                <th>Ngày đặt</th>
                                <th>Trạng thái</th>
                                <th>Chi tiết đơn hàng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {listHistoryOrders && listHistoryOrders.length > 0 &&
                                listHistoryOrders.map((item, index) => {
                                    return (
                                        
                                    )
                                })
                            } */}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};