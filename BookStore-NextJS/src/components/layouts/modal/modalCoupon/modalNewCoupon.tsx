'use client'

import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useState } from "react";
import { CreateNewCoupon } from '@/app/api/couponApi';
import { toast } from 'react-toastify';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSpinner } from '@coreui/react';
import { useRouter } from 'next/navigation';

export default function ModalNewCoupon(props: any) {
    const router = useRouter();
    const { show, handleClose } = props;

    const [loadingApi, setLoadingApi] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [value, setValue] = useState<number>(1000);
    const [quantity, setQuantity] = useState<number>(0);
    const [condition, setCondition] = useState<number>(1000);
    const [expiredDate, setExpiredDate] = useState<string>('');

    const handleCreateNewCoupon = async () => {
        const newCoupon = {
            nameCoupon: name.toUpperCase(),
            valueCoupon: value,
            condition,
            quantity,
            expiredDate
        };

        const valid = checkValidForm();

        if (valid) {
            setLoadingApi(true);
            const res = await CreateNewCoupon(newCoupon);
            if (res.statusCode === 201) {
                toast.success("Thêm coupon thành công.");
                handleClose();
                router.refresh();
            } else {
                toast.error(res.message);
            }
            setLoadingApi(false);
        }
    };

    const checkValidForm = () => {
        if (name === '') {
            toast.error("Chưa nhập tên.");
            return false;
        }

        if (expiredDate === '') {
            toast.error("Chưa nhập ngày hết hạn.");
            return false;
        }

        const now = new Date();
        if (expiredDate < now.toISOString()) {
            toast.error("Ngày hết hạn không hợp lệ.");
            return false;
        }

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
                        <Form.Label>Tên coupon <span className='text-danger'>*</span></Form.Label>
                        <Form.Control type="text" autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Giá trị coupon <span className='text-danger'>*</span></Form.Label>
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
                                <Form.Label>Điều kiện áp dụng <span className='text-danger'>*</span></Form.Label>
                                <Form.Control type="number" min={1000}
                                    value={condition}
                                    onChange={(e) => setCondition(+e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" style={{ maxWidth: '40%', position: 'relative' }}>
                        <Form.Label>Ngày hết hạn <span className='text-danger'>*</span></Form.Label>
                        <Form.Control type="date" style={{ position: 'relative', backgroundColor: 'transparent', zIndex: '2' }}
                            value={expiredDate}
                            onChange={(e) => setExpiredDate(e.target.value)}
                        />
                        <FontAwesomeIcon style={{ zIndex: '1', position: 'absolute', right: '15px', top: '43px' }} icon={faCalendarDays} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary"
                    disabled={loadingApi ? true : false}
                    onClick={handleCreateNewCoupon}>
                    {loadingApi &&
                        <CSpinner color="light" size="sm" className='me-3' style={{ width: '1.3rem', height: '1.3rem' }} />}
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal>
    );
};