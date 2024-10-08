'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './table.scss';
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import CouponItemComponent from './tableItem/couponItemComponent';

export default function TableCouponsComponent(props: any) {

    const { data, current } = props;

    const [loadingApi, setLoadingApi] = useState(false);
    const [listCoupons, setListCoupons] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [isShowModalNewCoupon, setIsShowModalNewCoupon] = useState(false);
    const [isShowModalEditCoupon, setIsShowModalEditCoupon] = useState(false);

    useEffect(() => {
        setListCoupons(data.listCoupons ?? []);
        setTotalPages(data.totalPages ?? 1);
        setPage(current ?? 1);
    }, [data, current]);

    return (
        <>
            <div className="container-fluid">
                <div className="container">
                    <div className="d-flex search-container">
                        <input
                            className='search-form'
                            type="search"
                            placeholder="Tìm kiếm coupon ..."
                            aria-label="Search"
                        />
                        <Button
                            variant="outline-success"
                        >
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </Button>
                    </div>
                    <div className="d-flex align-items-center">
                        <div className="new-coupon">
                            <button type="button" id="add-new-coupon"
                                onClick={() => setIsShowModalNewCoupon(true)}
                            >
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </button>
                        </div>
                        <div className="btn-filter-status-order">
                            <button type="button" id="coupon-valid">Coupon khả dụng</button>
                        </div>
                    </div>

                    {loadingApi ? <div className='loader-container'><div className="loader"></div></div> :
                        <table className="table table-striped table-responsive table-dashboard">
                            <thead className="heading-table">
                                <tr>
                                    <th>ID</th>
                                    <th>Ngày tạo</th>
                                    <th>Ngày hết hạn</th>
                                    <th>Tên</th>
                                    <th>Số lượng</th>
                                    <th>Giá trị</th>
                                    <th>Đơn hàng áp dụng</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="body-table">
                                {listCoupons && listCoupons.length > 0 ?
                                    listCoupons.map((item, index) => {
                                        return (
                                            <CouponItemComponent
                                                item={item} key={`coupon-${index}`}
                                                setIsShowModalNewCoupon={setIsShowModalNewCoupon}
                                            />
                                        )
                                    }) : (<tr><td>Không có danh sách coupon.</td></tr>)
                                }
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </>
    )
}