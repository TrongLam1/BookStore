/* eslint-disable @next/next/no-img-element */
'use client'
import { faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    Button,
    Container, Nav, Navbar,
    NavDropdown
} from 'react-bootstrap';
import logo from '@/assets/images/logo.png';
import ShoppingCartDropdown from '../shoppingCartDropdown/shoppingCartDropdown';
import style from './homepage.header.module.scss';

const HomePageHeader = () => {
    const router = useRouter();

    const [search, setSearch] = useState('');

    const handleSearch = () => {
        router.push(`/search?keyword=${search}`);
    };

    const handleKeyPress = (event: any) => {
        console.log(event.key);
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <>
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
                            {/* {user && user?.auth === false ?
                                <NavDropdown
                                    title={
                                        <>
                                            <FontAwesomeIcon icon={faUser} />
                                            Tài khoản
                                        </>}
                                    className={style.accountContainer}
                                >
                                    <Link href="/register" className='dropdown-item'>Đăng kí</Link>
                                    <Link href="/login" className='dropdown-item'>Đăng nhập</Link>
                                </NavDropdown>
                                :
                                <NavDropdown
                                    title={
                                        <>
                                            <i className="fa-regular fa-user mx-2"></i>
                                            <div>
                                                <span>Xin chào,</span>
                                                <span>{user.email}</span>
                                            </div>
                                        </>}
                                    className='account-container'
                                >
                                    <Link to={"/users/profile"} className='dropdown-item'>
                                        Thông tin cá nhân
                                    </Link>
                                    <Link to={"/"}
                                        className='dropdown-item'
                                        onClick={() => handleLogout()}
                                    >
                                        Đăng xuất
                                    </Link>
                                </NavDropdown>
                            } */}
                        </Nav>
                        <Nav>
                            <ShoppingCartDropdown />
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
};

export default HomePageHeader;