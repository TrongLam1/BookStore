/* eslint-disable @next/next/no-img-element */
'use client'
import { AdminFindOrderById, UpdateOrderStatus } from '@/app/api/orderApi';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import './modalOrderDetail.scss';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { CSpinner } from '@coreui/react';

export default function ModalOrderDetail(props: any) {
    const router = useRouter();
    const { show, handleClose, idOrderDetail } = props;
    const [loadingApi, setLoadingApi] = useState<boolean>(false);

    const [dataOrder, setDataOrder] = useState();
    const [orderItems, setOrderItems] = useState([]);
    const [orderStatus, setOrderStatus] = useState('');

    useEffect(() => {
        getOrderDetail(idOrderDetail);
    }, [idOrderDetail]);

    const getOrderDetail = async (idOrderDetail: number) => {
        const res = await AdminFindOrderById(idOrderDetail);
        if (res.statusCode === 200) {
            setDataOrder(res.data);
            setOrderItems(res.data.orderItems);
            setOrderStatus(res.data.orderStatus);
        }
    }

    const handleUpdateOrderStatus = async () => {
        setLoadingApi(true);
        const res = await UpdateOrderStatus(dataOrder.id, orderStatus);
        if (res.statusCode === 200) {
            toast.success("Cập nhật trạng thái đơn hàng thành công.");
            handleClose();
            router.refresh();
        } else {
            toast.error(res.message);
        }
        setLoadingApi(false);
    };

    return (
        <Modal style={{ color: 'black' }} size="xl" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết đơn hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-3 modal-order-detail-container">
                    <Col sm={8} className='modal-order-detail'>
                        {orderItems && orderItems.length > 0 &&
                            orderItems.map((item, index) => {
                                return (
                                    <Col key={`order-item-${index}`}
                                        className='order-item d-flex justify-content-between'>
                                        <div className="d-flex">
                                            <div className="order-item-img">
                                                <img src={item?.book.imageUrl} alt="" />
                                            </div>
                                            <div className="order-item-info">
                                                <div className="item-name">{item?.book.name}</div>
                                                <div className="item-quantity">x{item?.quantity}</div>
                                            </div>
                                        </div>
                                        <div className="order-item-totalPrice">
                                            <div className="item-total">
                                                {item?.totalPrice.toLocaleString()}đ
                                            </div>
                                        </div>
                                    </Col>
                                )
                            })
                        }
                    </Col>
                    <Col sm={4} className='modal-info-user-container'>
                        <Col>
                            <h4>Khách hàng</h4>
                        </Col>
                        <div className='modal-info-user'>
                            <Col className='d-flex justify-content-between'>
                                <span>Họ và tên:</span>
                                <span>{dataOrder?.username}</span>
                            </Col>
                            <Col className='d-flex justify-content-between'>
                                <span>Địa chỉ:</span>
                                <span>{dataOrder?.address}</span>
                            </Col>
                            <Col className='d-flex justify-content-between'>
                                <span>Số điện thoại:</span>
                                <span>{dataOrder?.phone}</span>
                            </Col>
                            <Col className='d-flex justify-content-between'>
                                <span>Phương thức thanh toán:</span>
                                <span>{dataOrder?.paymentMethod}</span>
                            </Col>
                            <Col className='d-flex justify-content-between'>
                                <span>Tình trạng đơn hàng:</span>
                                <span>{dataOrder?.orderStatus}</span>
                            </Col>
                            <Col className='d-flex justify-content-between text-danger'>
                                <strong>Tổng đơn hàng:</strong>
                                <strong>{dataOrder?.totalPriceOrder?.toLocaleString()}đ</strong>
                            </Col>
                        </div>
                    </Col>
                </Row>

                <Col className='d-flex modal-payment-status-change'>
                    <Form.Label>Tình trạng đơn hàng:</Form.Label>
                    <Form.Select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                        <option value={"Đã hủy"}>Hủy</option>
                        <option value={"Đang xử lí"}>Đang xử lý</option>
                        <option value={"Đang giao hàng"}>Đang giao</option>
                        <option value={"Đã hoàn thành"}>Hoàn thành</option>
                    </Form.Select>
                </Col>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary"
                    disabled={loadingApi ? true : false}
                    onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary" type='submit'
                    disabled={loadingApi ||
                        orderStatus === "Đã hoàn thành" || orderStatus === "Đã hủy" ? true : false}
                    onClick={handleUpdateOrderStatus}
                >
                    {loadingApi &&
                        <CSpinner color="light" size="sm" className='me-3' style={{ width: '1.3rem', height: '1.3rem' }} />}
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal>
    )
}