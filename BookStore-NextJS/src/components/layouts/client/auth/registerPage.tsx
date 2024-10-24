'use client'

import Image from "next/image";
import Link from "next/link";
import logo from '@/assets/images/logo.png';
import { useState } from "react";
import { sendRequest } from "@/utils/api";
import { toast } from "react-toastify";
import ActiveAccountComponent from "./activeAccountComponent";

export default function RegisterPage() {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [loadingApi, setLoadingApi] = useState<boolean>(false);
    const [isActiveCode, setIsActiveCode] = useState<boolean>(false);

    const handleSignUp = async (e: any) => {
        e.preventDefault();
        setLoadingApi(true);
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
            method: 'POST',
            body: {
                username, email, password
            }
        });

        if (res.statusCode !== 201) {
            toast.error(res.message);
            return;
        }
        setLoadingApi(false);
        setIsActiveCode(true);
        toast.success("Kiểm tra email để kích hoạt tài khoản.");
    }

    return (
        <>
            {!isActiveCode ? <section className="bg-light py-3 py-md-5" >
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
                                        Đăng kí
                                    </h2>
                                    <form onSubmit={(e) => handleSignUp(e)}>
                                        <div className="row gy-2 overflow-hidden">
                                            <div className="col-12">
                                                <div className="form-floating mb-3">
                                                    <input type="text" className="form-control" name="username" placeholder='Nguyễn Văn A' id="username"
                                                        onChange={(e) => setUsername(e.target.value)}
                                                        required />
                                                    <label htmlFor="username" className="form-label">
                                                        Họ và tên
                                                    </label>
                                                </div>
                                            </div>
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
                                                    <input type="password" className="form-control" name="password" id="password"
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        placeholder="Mật khẩu..." required />
                                                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="d-grid my-3">
                                                    <button className="btn btn-primary btn-lg" type="submit">
                                                        {loadingApi && <i className="fa-solid fa-sync fa-spin loader"></i>}
                                                        Đăng kí
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <p className="m-0 text-secondary text-center">Bạn đã có tài khoản?
                                                    <Link href='/auth/login' className="link-primary text-decoration-none"> Đăng nhập</Link>
                                                </p>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section > : <ActiveAccountComponent email={email} />}
        </>
    )
};