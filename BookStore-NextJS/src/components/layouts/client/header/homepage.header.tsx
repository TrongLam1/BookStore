/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import { ConvertShoppingCartFromSession, GetShoppingCart, GetShoppingCartSession } from '@/app/api/shoppingCartApi';
import logo from '@/assets/images/logo.png';
import { useShoppingCart } from '@/provider/shoppingCartProvider';
import { faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    Button,
    Container, Nav, Navbar,
    NavDropdown
} from 'react-bootstrap';
import ShoppingCartDropdown from '../shoppingCartDropdown/shoppingCartDropdown';
import style from './homepage.header.module.scss';
import { toast } from 'react-toastify';

const HomePageHeader = (props: any) => {
    const router = useRouter();

    const { user, token } = props;
    const [search, setSearch] = useState('');

    const { setShoppingCart } = useShoppingCart();

    useEffect(() => {
        const sessionId = Cookies.get('sessionId');
        if (sessionId !== undefined) {
            handleMoveShoppingCartFromSession(sessionId);
            getShoppingCart();
            Cookies.remove('sessionId');
        } else {
            getShoppingCart();
        }
    }, []);

    const getShoppingCart = async () => {
        let shoppingCart = null;

        if (user) {
            const res = await GetShoppingCart();
            if (res.statusCode === 200) {
                if (typeof res?.data === 'string') {
                    shoppingCart = JSON.parse(res?.data);
                } else {
                    shoppingCart = res?.data;
                }
            }
        } else {
            const sessionId = Cookies.get('sessionId');
            const res = await GetShoppingCartSession(sessionId);
            if (res.statusCode === 200) {
                if (typeof res.data === 'string') {
                    shoppingCart = JSON.parse(res.data);
                } else {
                    shoppingCart = {
                        totalItems: res.data.shoppingCart.totalItems,
                        totalPrices: res.data.shoppingCart.totalPrices,
                        cartItems: res.data.shoppingCart.cartItems,
                    }
                }
            }
        }

        setShoppingCart(shoppingCart);
    };

    const handleMoveShoppingCartFromSession = async (sessionId: string) => {
        if (user && sessionId) {
            const res = await ConvertShoppingCartFromSession(sessionId, token);
            if (res.statusCode === 201) {
                toast.success("Thêm sản phẩm thành công.");
            }
        }
    };

    const handleSearch = () => {
        router.push(`/search?keyword=${search}`);
    };

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Navbar collapseOnSelect expand="lg" className={style.headerContainer}>
            <Container>
                <Link href="/home" className='navbar-brand'>
                    <Image
                        src={logo}
                        width="120"
                        height="120"
                        className='d-inline-block align-top'
                        alt='logo' />
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse
                    className={style.navbarContainer}
                    id="responsive-navbar-nav"
                >
                    <Nav>
                        <div className={`${style.searchContainer} d-flex`}>
                            <input
                                className={style.searchForm}
                                type="search"
                                placeholder="Tìm kiếm sản phẩm ..."
                                aria-label="Search"
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                }}
                                value={search}
                                onKeyDown={(e) => handleKeyPress(e)}
                            />
                            <Button
                                variant="outline-success"
                                onClick={handleSearch}
                            >
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </Button>
                        </div>
                    </Nav>
                    <Nav>
                        {!user ?
                            <NavDropdown
                                title={
                                    <>
                                        <FontAwesomeIcon icon={faUser} className='mx-2' />
                                        Tài khoản
                                    </>}
                                className={style.accountContainer}
                            >
                                <Link href="/auth/register" className='dropdown-item'>Đăng kí</Link>
                                <Link href="/auth/login" className='dropdown-item'>Đăng nhập</Link>
                            </NavDropdown>
                            :
                            <NavDropdown
                                title={
                                    <>
                                        <FontAwesomeIcon icon={faUser} className='mx-2' />
                                        <div>
                                            <span>Xin chào,</span>
                                            <span>{user.username}</span>
                                        </div>
                                    </>}
                                className={style.accountContainer}
                            >
                                {user.role.includes("ADMIN") &&
                                    <Link href="/dashboard" className='dropdown-item'>
                                        Dashboard
                                    </Link>
                                }
                                <Link href="/profile" className='dropdown-item'>
                                    Thông tin cá nhân
                                </Link>
                                <Link href="/"
                                    className='dropdown-item'
                                    onClick={() => signOut({ callbackUrl: '/home' })}
                                >
                                    Đăng xuất
                                </Link>
                            </NavDropdown>
                        }
                    </Nav>
                    <Nav>
                        <ShoppingCartDropdown user={user} token={token} />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
};

export default HomePageHeader;