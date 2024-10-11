'use client'

import { Button } from 'react-bootstrap';
import './table.scss';
import { useEffect, useState } from 'react';
import OrderItemComponent from './tableItem/orderItemComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import ModalOrderDetail from '../../modal/modalOrderDetail/modalOrderDetail';

export default function TableOrdersComponent(props: any) {

    const { data, current } = props;
    const [loadingApi, setLoadingApi] = useState<boolean>(false);
    const [listOrders, setListOrders] = useState<Array<any>>([]);
    const [page, setPage] = useState<number>();
    const [totalPages, setTotalPages] = useState<number>();

    const [search, setSearch] = useState<string>('');

    const [idOrderDetail, setIdOrderDetail] = useState<number>();

    const [isShowModalOrderDetail, setIsShowModalOrderDetail] = useState<boolean>(false);

    useEffect(() => {
        setListOrders(data.listOrders ?? []);
        setTotalPages(data.totalPages ?? 1);
        setPage(current ?? 1);
    }, [data, current]);

    const handleSearchOrder = async () => { }

    const handleClose = () => {
        setIsShowModalOrderDetail(false);
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
                                value={search} onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button
                                variant="outline-success" onClick={handleSearchOrder}
                            >
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </Button>
                        </div>
                        <div className="d-flex justify-content-end">
                            <div className="btn-filter-status-order">
                                <button type="button" id="not-delivered-order">Đơn hàng chưa hoàn thành</button>
                            </div>
                            <div className="btn-filter-status-order">
                                <button type="button" id="delivered-order">Đơn hàng đã hoàn thành</button>
                            </div>
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