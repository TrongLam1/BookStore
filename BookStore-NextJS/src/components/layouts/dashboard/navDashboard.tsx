'use client'

import avatar from '@/assets/images/customer-support.jpg';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

export default function NavDashboard() {

    const [quantityNewOrder, setQuantityNewOrder] = useState<number>(0);

    useEffect(() => {
        socket.emit('joinAdminRoom');

        // Listen for the 'newOrder' event, which is sent to all admins
        socket.on('newOrder', (orderDetails) => {
            if (orderDetails.id) {
                toast.success("Có đơn hàng mới.");
                setQuantityNewOrder(quantityNewOrder + 1);
            }
        });

        return () => {
            socket.off('newOrder');
        };
    }, [quantityNewOrder]);

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
                        <Link href='/dashboard/orders/1'>
                            <div className="redirect-table-orders">
                                <FontAwesomeIcon icon={faBell} />
                                Bạn có <input type="number"
                                    id="quantity-new-orders"
                                    value={quantityNewOrder}
                                    readOnly
                                /> đơn hàng mới.
                            </div>
                        </Link>
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