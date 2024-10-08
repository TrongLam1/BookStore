'use client'
import { faFaceLaughWink, faFileLines, faList, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";
import { Collapse } from "react-bootstrap";

export default function SidebarDashboard() {

    const [openTable, setOpenTable] = useState(false);
    const [openAuth, setOpenAuth] = useState(false);

    return (
        <aside id="sidebar" className="js-sidebar active">
            <div className="h-100">
                <div className="sidebar-logo">
                    <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/dashboard">
                        <div className="sidebar-brand-icon rotate-n-15">
                            <FontAwesomeIcon icon={faFaceLaughWink} />
                        </div>
                        <div className="sidebar-brand-text mx-3">Admin Panel</div>
                    </a>
                </div>
                <ul className="sidebar-nav">
                    <li className="sidebar-item">
                        <Link href="/dashboard" className="sidebar-link">
                            <FontAwesomeIcon icon={faList} className="pe-2" />
                            Dashboard
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <div
                            onClick={() => setOpenTable(!openTable)}
                            className="sidebar-link collapsed"
                            aria-controls="table-collapse"
                            aria-expanded={openTable}
                            data-bs-toggle="collapse"
                        >
                            <FontAwesomeIcon icon={faFileLines} className="pe-2" />
                            Bảng
                        </div>
                        <Collapse in={openTable}>
                            <ul id="table-collapse">
                                <li className="sidebar-item">
                                    <Link href='/dashboard/products/1'
                                        className="sidebar-link sidebar-link-custom"
                                    >
                                        <button className="btn-dashboard" id="tableBooks" type="button">
                                            Sản phẩm
                                        </button>
                                    </Link>
                                </li>
                                <li className="sidebar-item">
                                    <Link href='/dashboard/orders/1'
                                        className="sidebar-link sidebar-link-custom"
                                    >
                                        <button className="btn-dashboard" id="tableBooks" type="button">
                                            Đơn hàng
                                        </button>
                                    </Link>
                                </li>
                                <li className="sidebar-item">
                                    <Link href='/dashboard/users/1'
                                        className="sidebar-link sidebar-link-custom"
                                    >
                                        <button className="btn-dashboard" id="tableBooks" type="button">
                                            Khách hàng
                                        </button>
                                    </Link>
                                </li>
                                <li className="sidebar-item">
                                    <Link href='/dashboard/coupons/1'
                                        className="sidebar-link sidebar-link-custom"
                                    >
                                        <button className="btn-dashboard" id="tableBooks" type="button">
                                            Coupon
                                        </button>
                                    </Link>
                                </li>
                            </ul>
                        </Collapse>
                    </li>
                    <li className="sidebar-item">
                        <div
                            onClick={() => setOpenAuth(!openAuth)}
                            className="sidebar-link collapsed"
                            aria-controls="auth-collapse"
                            aria-expanded={openAuth}
                            data-bs-toggle="collapse"
                        >
                            <FontAwesomeIcon icon={faUser} className="pe-2" />
                            Xác thực
                        </div>
                        <Collapse in={openAuth}>
                            <ul id="auth-collapse">
                                <li className="sidebar-item">
                                    <Link href={'/login'}
                                        className="sidebar-link sidebar-link-custom"
                                    >
                                        <button className="btn-dashboard" type="button" data-bs-toggle="modal"
                                            data-bs-target="#ModalFormSignIn">
                                            Đăng nhập
                                        </button>
                                    </Link>
                                </li>
                                <li className="sidebar-item">
                                    <a className="sidebar-link sidebar-link-custom">
                                        <button className="btn-dashboard" type="button" data-bs-toggle="modal" data-bs-target="#ModalFormSignUp">
                                            Đăng kí tài khoản thường
                                        </button>
                                    </a>
                                </li>
                            </ul>
                        </Collapse>
                    </li>
                    <li className="sidebar-item">
                        <Link href='/dashboard/chart/1'
                            id="chart" className="sidebar-link collapsed"
                        >
                            <i className="fa-solid fa-chart-simple pe-2"></i>
                            Biểu đồ thống kê doanh thu
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
}