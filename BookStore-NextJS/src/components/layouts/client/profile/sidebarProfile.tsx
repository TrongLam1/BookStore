'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarProfileComponent(props: any) {
    const pathName = usePathname();

    return (
        <div className="navbar-profile col-lg-2">
            <div className="navbar-profile-header">Quản lí tài khoản</div>
            <div className="navbar-profile-container">
                <Link
                    href='/profile'
                    className={`profile-item personal ${pathName === '/profile' ? 'active' : ''}`}>
                    Thông tin tài khoản
                </Link>
                <Link
                    href='/profile/history-orders'
                    className={`profile-item orders ${pathName === '/profile/history-orders' ? 'active' : ''}`}>
                    Lịch sử mua hàng
                </Link>
                <Link
                    href='/profile/reset-password'
                    className={`profile-item orders ${pathName === '/profile/reset-password' ? 'active' : ''}`}>
                    Đổi mật khẩu
                </Link>
            </div>
        </div>
    );
};