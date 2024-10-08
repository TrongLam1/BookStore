'use client'

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import UserItemComponent from "./tableItem/userItemComponent";
import './table.scss';

export default function TableUsersComponent(props: any) {

    const { data, current } = props;

    const [loadingApi, setLoadingApi] = useState(false);
    const [listUsers, setListUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setListUsers(data?.listUsers ?? []);
        setPage(current ?? 1);
        setTotalPages(data.totalPages ?? 1);
    }, [data, current]);

    const handleGetUsersByRole = (role) => {
        // setRole(role);
        // getUsersByRole(role);
        // setSearchParams({ role: role });
    };

    const handleSearchByEmail = async () => {

    };

    return (
        <>
            <div className="container-fluid">
                <div className="container">
                    <div className="d-flex justify-content-between mt-3">
                        <div className="d-flex search-container">
                            <input
                                className='search-form'
                                type="search"
                                placeholder="Nhập email ..."
                                aria-label="Search"
                                value={search} onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button
                                variant="outline-success" onClick={() => {
                                    handleSearchByEmail();
                                    // clearRole();
                                }}
                            >
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </Button>
                        </div>
                        <div className="d-flex justify-content-end">
                            <div className="btn-filter-status-order">
                                <button type="button" id="create-admin" className="dropdown-item dropdown-custom"
                                    data-bs-toggle="modal" data-bs-target="#ModalFormCreateAdmin">
                                    Tạo tài khoản Admin
                                </button>
                            </div>
                            <div className="btn-filter-status-order">
                                <button type="button" onClick={() => handleGetUsersByRole("ADMIN")}>ADMIN</button>
                            </div>
                            <div className="btn-filter-status-order">
                                <button type="button" onClick={() => handleGetUsersByRole("USER")} >USER</button>
                            </div>
                        </div>
                    </div>
                    {loadingApi ? <div className='loader-container'><div className="loader"></div></div> :
                        <table className="table table-striped table-responsive table-dashboard">
                            <thead className="heading-table">
                                <tr>
                                    <th>ID</th>
                                    <th>Khách hàng</th>
                                    <th>Số điện thoại</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody className="body-table">
                                {listUsers && listUsers.length > 0 ?
                                    listUsers.map((item, index: number) => {
                                        return (
                                            <UserItemComponent item={item} key={`user-${index}`} />
                                        )
                                    }) : (<tr><td>Không có danh sách khách hàng.</td></tr>)
                                }
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </>
    );
};