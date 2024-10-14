'use client'

import { GetOneCoupon, UpdateCoupon } from '@/app/api/couponApi';
import { CSpinner } from '@coreui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function ModalUpdateCoupon(props: any) {
    const router = useRouter();
    const { show, handleClose, idCouponUpdate } = props;

    const [loadingApi, setLoadingApi] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [value, setValue] = useState<number>(1000);
    const [quantity, setQuantity] = useState<number>(0);
    const [condition, setCondition] = useState<number>(1000);
    const [expiredDate, setExpiredDate] = useState<string>('');

    useEffect(() => {
        if (idCouponUpdate !== undefined) getCoupon();
    }, [idCouponUpdate]);

    const getCoupon = async () => {
        const res = await GetOneCoupon(idCouponUpdate);
        if (res.statusCode === 200) {
            setName(res.data.nameCoupon);
            setValue(res.data.valueCoupon);
            setQuantity(res.data.quantity);
            setCondition(res.data.condition);
            setExpiredDate(res.data.expiredDate);
        }
    };

    const handleUpdateCoupon = async () => {
        const updateCoupon = {
            id: idCouponUpdate,
            valueCoupon: value,
            condition,
            quantity,
            expiredDate
        };

        if (checkValidForm()) {
            setLoadingApi(true);
            const res = await UpdateCoupon(updateCoupon);
            if (res.statusCode === 200) {
                toast.success("Cập nhật coupon thành công.");
                handleClose();
                router.refresh();
            } else {
                toast.error(res.message);
            }
            setLoadingApi(false);
        }
    };

    const checkValidForm = () => {
        if (expiredDate === '') {
            toast.error("Chưa nhập ngày hết hạn.");
            return false;
        }

        const now = new Date();
        // if (expiredDate < now.toISOString()) {
        //     toast.error("Ngày hết hạn không hợp lệ.");
        //     return false;
        // }

        return true;
    }

    return (
        <Modal style={{ color: 'black' }} size="lg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Coupon</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên coupon</Form.Label>
                        <Form.Control type="text" readOnly disabled value={name} />
                    </Form.Group>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Giá trị coupon <span className='require'>*</span></Form.Label>
                                <Form.Control min={1000} type="number"
                                    value={value}
                                    onChange={(e) => setValue(+e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Số lượng</Form.Label>
                                <Form.Control type="number" min={0}
                                    value={quantity}
                                    onChange={(e) => setQuantity(+e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Điều kiện áp dụng <span className='require'>*</span></Form.Label>
                                <Form.Control type="number" min={1000}
                                    value={condition}
                                    onChange={(e) => setCondition(+e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" style={{ maxWidth: '40%' }}>
                        <Form.Label>Ngày hết hạn</Form.Label>
                        <Form.Control type="date" value={expiredDate}
                            onChange={(e) => setExpiredDate(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary"
                    disabled={loadingApi ? true : false}
                    onClick={handleUpdateCoupon}
                >
                    {loadingApi &&
                        <CSpinner color="light" size="sm" className='me-3' style={{ width: '1.3rem', height: '1.3rem' }} />}
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal>
    );
};