'use client'

import { Button, Form } from 'react-bootstrap';
import './table.scss';
import { useEffect, useState } from 'react';
import OrderItemComponent from './tableItem/orderItemComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import ModalOrderDetail from '../../modal/modalOrderDetail/modalOrderDetail';
import { AdminFindOrderById, GetAllOrders } from '@/app/api/orderApi';

export default function TableOrdersComponent(props: any) {

    const { data, current } = props;
    const [loadingApi, setLoadingApi] = useState<boolean>(false);
    const [listOrders, setListOrders] = useState<Array<any>>(data.listOrders ?? []);
    const [page, setPage] = useState<number>(current ?? 1);
    const [totalPages, setTotalPages] = useState<number>(data.totalPages ?? 1);
    const [orderStatus, setOrderStatus] = useState<string>();

    const [search, setSearch] = useState<number>();

    const [idOrderDetail, setIdOrderDetail] = useState<number>();

    const [isShowModalOrderDetail, setIsShowModalOrderDetail] = useState<boolean>(false);

    useEffect(() => { }, [listOrders, current]);

    const handleSearchOrder = async () => {
        const res = await AdminFindOrderById(search);
        if (res.statusCode === 200) setListOrders([res.data]);
    }

    const handleClose = () => {
        setIsShowModalOrderDetail(false);
    };

    const handleGetOrdersByStatus = async () => {
        const res = await GetAllOrders(page, 10, orderStatus);
        if (res.statusCode === 200) {
            setListOrders(res.data.listOrders);
            setTotalPages(res.data.totalPages);
        }
    };

    return (
        <>
            <div className="container-fluid">
                <div className="container">
                    <div className='d-flex justify-content-between mt-3'>
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
                                <option>---Options---</option>
                                <option value="Đã hủy">Đã hủy</option>
                                <option value="Đang xử lí">Đang xử lí</option>
                                <option value="Đang giao hàng">Đang giao hàng</option>
                                <option value="Đã hoàn thành">Đã hoàn thành</option>
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
        </>
    );
};