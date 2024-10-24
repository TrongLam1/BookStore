'use client'
import Image from "next/image";
import Link from "next/link";
import logo from '@/assets/images/logo.png';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ActiveAccount } from "@/app/api/userApi";
import { toast } from "react-toastify";

export default function ActiveAccountComponent(props: any) {
    const router = useRouter();
    const { email } = props;
    const [activeCode, setActiveCode] = useState<number>();
    const [loadingApi, setLoadingApi] = useState<boolean>(false);

    const handleActiveAccount = async (e: any) => {
        e.preventDefault();

        setLoadingApi(true);
        const res = await ActiveAccount(email, activeCode);
        if (res.statusCode === 200) {
            router.push('/auth/login');
            toast.success(res.data);
        } else {
            toast.error(res.message);
            setLoadingApi(false);
        }
    };

    return (
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
                                    Kích hoạt tài khoản
                                </h2>
                                <form onSubmit={(e) => handleActiveAccount(e)}>
                                    <div className="row gy-2 overflow-hidden">
                                        <div className="col-12">
                                            <div className="form-floating mb-3">
                                                <input type="text" className="form-control" name="code" id="code"
                                                    onChange={(e) => setActiveCode(+e.target.value)}
                                                    placeholder="Mã kích hoạt..." required />
                                                <label htmlFor="code" className="form-label">Mã kích hoạt</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="d-grid my-3">
                                                <button className="btn btn-primary btn-lg" type="submit"
                                                    disabled={loadingApi ? true : false}>
                                                    {loadingApi && <i className="fa-solid fa-sync fa-spin loader"></i>}
                                                    Kích hoạt
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
        </section>
    );
};