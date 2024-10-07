'use client'

import avatar from '@/assets/images/customer-support.jpg';
import Image from "next/image";
import { useState } from 'react';

export default function NavDashboard() {

    const [quantityNewOrder, setQuantityNewOrder] = useState(0);

    const handleSidebar = () => {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('active');
    };

    return (
        <nav className="navbar navbar-expand px-3 border-bottom">
            <button className="btn"
                id="sidebar-toggle"
                type="button"
                onClick={() => handleSidebar()}
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="navbar-collapse navbar">
                <ul className="navbar-nav">
                    <li className="nav-item dropdown noti-new-orders">
                        <div className="redirect-table-orders">
                            <i className="fa-solid fa-bell"></i>
                            Bạn có <input type="number"
                                id="quantity-new-orders"
                                value={quantityNewOrder}
                                readOnly
                            /> đơn hàng mới.
                        </div>
                    </li>
                    <li className="nav-item dropdown">
                        <a data-bs-toggle="dropdown" className="nav-icon pe-md-0">
                            <Image src={avatar} className="avatar img-fluid rounded" alt="" />
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                            <button id="logout-admin" type="button">
                                <a className="dropdown-item">Đăng xuất</a>
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    )
}