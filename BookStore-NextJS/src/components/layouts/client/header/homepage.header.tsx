/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import logo from '@/assets/images/logo.png';
import { useShoppingCart } from '@/provider/shoppingCartProvider';
import { faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signOut } from 'next-auth/react';
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

const HomePageHeader = (props: any) => {
    const router = useRouter();

    const { user, dataShoppingCart } = props;
    const [search, setSearch] = useState('');

    const { setShoppingCart } = useShoppingCart();

    useEffect(() => {
        if (!user) return;
        if (user.role.includes("ADMIN")) {
            router.push("/dashboard");
        }
    })

    useEffect(() => {
        setShoppingCart(dataShoppingCart);
    }, []);

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
                                    console.log(e.target.value);
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
                                <Link href="/profile" className='dropdown-item'>
                                    Thông tin cá nhân
                                </Link>
                                <Link href="/"
                                    className='dropdown-item'
                                    onClick={() => signOut()}
                                >
                                    Đăng xuất
                                </Link>
                            </NavDropdown>
                        }
                    </Nav>
                    <Nav>
                        <ShoppingCartDropdown />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
};

export default HomePageHeader;