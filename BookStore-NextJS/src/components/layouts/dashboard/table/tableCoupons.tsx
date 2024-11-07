'use client'

import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ModalNewCoupon from '../../modal/modalCoupon/modalNewCoupon';
import ModalUpdateCoupon from '../../modal/modalCoupon/modalUpdateCoupon';
import './table.scss';
import CouponItemComponent from './tableItem/couponItemComponent';
import { FindCouponByName, GetCouponsValid } from '@/app/api/couponApi';
import { useRouter } from 'next/navigation';
import ReactPaginate from 'react-paginate';

export default function TableCouponsComponent(props: any) {
    const router = useRouter();
    const { data, current } = props;

    const [loadingApi, setLoadingApi] = useState<boolean>(false);
    const [listCoupons, setListCoupons] = useState(data.listCoupons ?? []);
    const [page, setPage] = useState<number>(current ?? 1);
    const [totalPages, setTotalPages] = useState<number>(data.totalPages ?? 1);
    const [search, setSearch] = useState<string>('');

    const [isShowModalNewCoupon, setIsShowModalNewCoupon] = useState<boolean>(false);
    const [isShowModalEditCoupon, setIsShowModalEditCoupon] = useState<boolean>(false);
    const [idCouponUpdate, setIdCouponUpdate] = useState<number>();

    console.log(data);

    useEffect(() => {
        setListCoupons(data.listCoupons ?? []);
        setPage(current ?? 1);
        setTotalPages(data.totalPages ?? 1);
    }, [data]);

    useEffect(() => { }, [listCoupons]);

    const handleClose = () => {
        setIsShowModalNewCoupon(false);
        setIsShowModalEditCoupon(false);
    };

    const getValidCoupons = async () => {
        const res = await GetCouponsValid(page);
        setListCoupons(res.data.listCoupons ?? []);
        setTotalPages(res.data.totalPages ?? 1);
    };

    const findCouponByName = async () => {
        if (search !== '') {
            const res = await FindCouponByName(search);
            if (res.statusCode === 200) {
                setListCoupons([res.data]);
            } else {
                setListCoupons([]);
            }
        }
    };

    const handlePageClick = (event) => {
        const pathName = window.location.pathname;
        const index = pathName.lastIndexOf('/');
        let url = pathName.slice(0, index);
        url += `/${event.selected + 1}`;
        router.push(url);
    };

    return (
        <>
            <div className="container-fluid">
                <div className="container">
                    <div className='d-flex justify-content-between align-items-center mb-3 mt-3'>
                        <div className="d-flex search-container">
                            <input
                                className='search-form'
                                type="search"
                                placeholder="Tìm kiếm coupon ..."
                                aria-label="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button
                                variant="outline-success"
                                onClick={findCouponByName}
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
                            <button className="btn-filter-status-order" type="button" id="coupon-valid"
                                onClick={getValidCoupons}
                            >
                                Coupon khả dụng
                            </button>
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
                idCouponUpdate={idCouponUpdate} />
            <div className="d-flex justify-content-center mt-4">
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={1}
                    pageCount={totalPages}
                    initialPage={current - 1}
                    previousLabel="< Previous"
                    pageClassName='page-item'

                    pageLinkClassName='page-link'
                    previousClassName='page-item'
                    previousLinkClassName='page-link'
                    nextClassName='page-item'
                    nextLinkClassName='page-link'
                    breakClassName='page-item'
                    breakLinkClassName='page-link'
                    containerClassName='pagination'
                    activeClassName='active'
                />
            </div>
        </>
    )
}