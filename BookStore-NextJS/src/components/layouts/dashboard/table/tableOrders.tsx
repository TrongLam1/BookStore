'use client'

import { Button, Form } from 'react-bootstrap';
import './table.scss';
import { useEffect, useState } from 'react';
import OrderItemComponent from './tableItem/orderItemComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import ModalOrderDetail from '../../modal/modalOrderDetail/modalOrderDetail';
import { AdminFindOrderById, GetAllOrders } from '@/app/api/orderApi';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/navigation';

export default function TableOrdersComponent(props: any) {
    const router = useRouter();
    const { data, current } = props;
    const [loadingApi, setLoadingApi] = useState<boolean>(false);
    const [listOrders, setListOrders] = useState<Array<any>>(data.listOrders ?? []);
    const [totalPages, setTotalPages] = useState<number>(data.totalPages ?? 1);
    const [orderStatus, setOrderStatus] = useState<string>();

    const [search, setSearch] = useState<number>();

    const [idOrderDetail, setIdOrderDetail] = useState<number>();

    const [isShowModalOrderDetail, setIsShowModalOrderDetail] = useState<boolean>(false);

    useEffect(() => {
        setListOrders(data.listOrders ?? []);
        setTotalPages(data.totalPages ?? 1);
    }, [data]);

    const handleSearchOrder = async () => {
        const res = await AdminFindOrderById(search);
        if (res.statusCode === 200) setListOrders([res.data]);
    }

    const handleClose = () => {
        setIsShowModalOrderDetail(false);
    };

    const handleGetOrdersByStatus = async () => {
        console.log(orderStatus);
        const res = await GetAllOrders(current, 10, orderStatus);
        if (res.statusCode === 200) {
            setListOrders(res.data.listOrders);
            setTotalPages(res.data.totalPages);
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
                    <div className='d-flex justify-content-between align-content-center mt-3 mb-3'>
                        <div className="d-flex search-container">
                            <input
                                className='search-form'
                                type="search"
                                placeholder="Tìm kiếm mã đơn hàng ..."
                                aria-label="Search"
                                value={search} onChange={(e) => setSearch(+e.target.value)}
                            />
                            <Button
                                variant="outline-success" onClick={handleSearchOrder}
                            >
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </Button>
                        </div>
                        <div className="d-flex justify-content-end align-items-center">
                            <div>Trạng thái:</div>
                            <Form.Select
                                style={{ height: '38px' }}
                                value={orderStatus}
                                onChange={(e) => setOrderStatus(e.target.value)}
                            >
                                <option value="">--Toàn bộ--</option>
                                <option value="Đã hủy">--Đã hủy--</option>
                                <option value="Đang xử lí">--Đang xử lí--</option>
                                <option value="Đang giao hàng">--Đang giao hàng--</option>
                                <option value="Đã hoàn thành">--Đã hoàn thành--</option>
                            </Form.Select>
                            <button className="btn-filter-status-order"
                                onClick={handleGetOrdersByStatus}>
                                <FontAwesomeIcon icon={faCircleArrowRight} />
                            </button>
                        </div>
                    </div>
                    {loadingApi ? <div className='loader-container'><div className="loader"></div></div> :
                        <table className="table table-striped table-responsive table-dashboard">
                            <thead className="heading-table">
                                <tr>
                                    <th>ID</th>
                                    <th>Khách hàng</th>
                                    <th>Ngày đặt</th>
                                    <th>Trạng thái đơn hàng</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="body-table">
                                {listOrders && listOrders.length > 0 ?
                                    listOrders.map((item, index: number) => {
                                        return (
                                            <OrderItemComponent
                                                item={item} key={`order-${index}`}
                                                setIdOrderDetail={setIdOrderDetail}
                                                setIsShowModalOrderDetail={setIsShowModalOrderDetail} />
                                        )
                                    }) : (<tr><td><div>Không có danh sách đơn hàng.</div></td></tr>)}
                            </tbody>
                        </table>
                    }
                </div>
            </div>
            <ModalOrderDetail show={isShowModalOrderDetail} idOrderDetail={idOrderDetail}
                handleClose={handleClose} />
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
    );
};