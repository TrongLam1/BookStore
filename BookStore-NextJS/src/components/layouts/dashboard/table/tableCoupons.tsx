'use client'

import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ModalNewCoupon from '../../modal/modalCoupon/modalNewCoupon';
import ModalUpdateCoupon from '../../modal/modalCoupon/modalUpdateCoupon';
import './table.scss';
import CouponItemComponent from './tableItem/couponItemComponent';
import { revalidateTag } from 'next/cache';

export default function TableCouponsComponent(props: any) {

    const { data, current } = props;

    const [loadingApi, setLoadingApi] = useState<boolean>(false);
    const [listCoupons, setListCoupons] = useState(data.listCoupons ?? []);
    const [page, setPage] = useState<number>(current ?? 1);
    const [totalPages, setTotalPages] = useState<number>(data.totalPages ?? 1);

    const [isShowModalNewCoupon, setIsShowModalNewCoupon] = useState<boolean>(false);
    const [isShowModalEditCoupon, setIsShowModalEditCoupon] = useState<boolean>(false);
    const [idCouponUpdate, setIdCouponUpdate] = useState<number>();

    useEffect(() => { }, [listCoupons, current]);

    const handleClose = () => {
        setIsShowModalNewCoupon(false);
        setIsShowModalEditCoupon(false);
    };

    const handleRevalidateTag = () => {
        revalidateTag(`list-coupons-${current}`);
    };

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
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </Button>
                    </div>
                    <div className="d-flex align-items-center">
                        <div className="new-coupon">
                            <button type="button"
                                className="dropdown-item dropdown-custom btn-create-account"
                                onClick={() => setIsShowModalNewCoupon(true)}>
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div>
                        <button className="btn-filter-status-order" type="button" id="coupon-valid">
                            Coupon khả dụng
                        </button>
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
                                    listCoupons.map((item, index: number) => {
                                        return (
                                            <CouponItemComponent
                                                item={item} key={`coupon-${index}`}
                                                setIsShowModalEditCoupon={setIsShowModalEditCoupon}
                                                setIdCouponUpdate={setIdCouponUpdate}
                                            />
                                        )
                                    }) : (<tr><td>Không có danh sách coupon.</td></tr>)
                                }
                            </tbody>
                        </table>
                    }
                </div>
            </div>
            <ModalNewCoupon show={isShowModalNewCoupon} handleClose={handleClose} />
            <ModalUpdateCoupon show={isShowModalEditCoupon} handleClose={handleClose}
                idCouponUpdate={idCouponUpdate} revalidate={handleRevalidateTag} />
        </>
    )
}