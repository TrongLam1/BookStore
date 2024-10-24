/* eslint-disable @next/next/no-img-element */
'use client'
import { ActiveAccount, ReactiveCode } from '@/app/api/userApi';
import logo from '@/assets/images/logo.png';
import authenticate from "@/utils/actions";
import { CSpinner } from '@coreui/react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function LoginComponent() {
    const router = useRouter();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loadingApi, setLoadingApi] = useState<boolean>(false);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [activeCode, setActiveCode] = useState<number>();

    const handleLogin = async (event: any) => {
        event.preventDefault();

        setLoadingApi(true);
        const res = await authenticate(email, password);

        if (res?.error) {
            if (res?.code === 2) {
                const res = await ReactiveCode(email);
                if (res.statusCode === 200) {
                    toast.success("Kiểm tra email và kích hoạt tài khoản.");
                    setOpenModal(true);
                }
            }
        } else {
            router.push("/home");
        }
        setLoadingApi(false);
    };

    const handleReactive = async () => {
        if (isNaN(activeCode)) {
            toast.error("Mã kích hoạt không phù hợp.");
            return;
        }
        const res = await ActiveAccount(email, activeCode);
        if (res.statusCode === 200) {
            toast.success(res.data);
            setOpenModal(false);
        }
    };

    return (
        <>
            <section className="bg-light py-3 py-md-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                            <div className="card border border-light-subtle rounded-3 shadow-sm">
                                <div className="card-body p-3 p-md-4 p-xl-5">
                                    <div className="text-center mb-3">
                                        <div>
                                            <Image src={logo} alt="BootstrapBrain Logo" width="80" height="80" />
                                        </div>
                                    </div>
                                    <h2 className="fs-2 fw-bold text-center text-secondary mb-4">
                                        Đăng nhập
                                    </h2>
                                    <form onSubmit={(e) => handleLogin(e)}>
                                        <div className="row gy-2 overflow-hidden">
                                            <div className="col-12">
                                                <div className="form-floating mb-3">
                                                    <input type="email" className="form-control" name="email" id="email" placeholder="name@example.com"
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required />
                                                    <label htmlFor="email" className="form-label">Email</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-floating mb-3">
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        name="password" id="password"
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        placeholder="Mật khẩu..." required />
                                                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="d-flex gap-2 justify-content-between">
                                                    <div className="form-check">

                                                    </div>
                                                    <a href="#!" className="link-primary text-decoration-none">Quên mật khẩu?</a>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="d-grid my-3">
                                                    <button className="btn btn-primary btn-lg" type="submit">
                                                        {loadingApi &&
                                                            <CSpinner color="light" size="sm" className='me-3' style={{ width: '1.3rem', height: '1.3rem' }} />}
                                                        Đăng nhập
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <p className="m-0 text-secondary text-center">
                                                    Bạn chưa có tài khoản?
                                                    <Link href='/auth/register' className="link-primary text-decoration-none"> Đăng kí</Link>
                                                </p>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Modal style={{ color: 'black' }}
                size="sm" show={openModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>Kích hoạt tài khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Mã kích hoạt</Form.Label>
                            <Form.Control
                                type="text" autoFocus
                                maxLength={6}
                                onChange={(e) => setActiveCode(+e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type='submit'
                        disabled={loadingApi ? true : false}
                        onClick={() => handleReactive()}>
                        {loadingApi &&
                            <CSpinner color="light" size="sm" className='me-3' style={{ width: '1.3rem', height: '1.3rem' }} />}
                        Kích hoạt
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};