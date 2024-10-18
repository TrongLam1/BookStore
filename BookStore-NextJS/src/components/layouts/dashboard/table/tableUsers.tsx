'use client'

import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import UserItemComponent from "./tableItem/userItemComponent";
import './table.scss';
import { FindUsersByNameContaining } from "@/app/api/userApi";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";

export default function TableUsersComponent(props: any) {
    const router = useRouter();
    const { data, current } = props;

    const [loadingApi, setLoadingApi] = useState(false);
    const [listUsers, setListUsers] = useState(data?.listUsers ?? []);
    const [totalPages, setTotalPages] = useState(data.totalPages ?? 1);
    const [search, setSearch] = useState('');

    useEffect(() => { }, [listUsers]);

    const handleSearchByName = async () => {
        const res = await FindUsersByNameContaining(current, 10, search);
        if (res.statusCode === 200) {
            setListUsers(res.data.result);
            setTotalPages(res.data.totalPages);
        }
    };

    const handlePageClick = (event) => {
        const pathName = window.location.pathname;
        const index = pathName.lastIndexOf('/');
        let url = pathName.slice(0, index);
        url += `/${event.selected + 1}`;
        router.push(url);
    };

    return (
        <>
            <div className="container-fluid">
                <div className="container">
                    <div className="d-flex justify-content-between mt-3 mb-3 align-items-center">
                        <div className="d-flex search-container">
                            <input
                                className='search-form'
                                type="search"
                                placeholder="Nhập tên người dùng ..."
                                aria-label="Search"
                                value={search} onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button
                                variant="outline-success"
                                onClick={handleSearchByName}
                            >
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </Button>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button type="button" id="create-admin" className="dropdown-item dropdown-custom btn-create-account"
                                data-bs-toggle="modal" data-bs-target="#ModalFormCreateAdmin">
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
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
            <div className="d-flex justify-content-center mt-4">
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={1}
                    pageCount={totalPages}
                    initialPage={current - 1}
                    previousLabel="< Previous"
                    pageClassName='page-item'

                    pageLinkClassName='page-link'
                    previousClassName='page-item'
                    previousLinkClassName='page-link'
                    nextClassName='page-item'
                    nextLinkClassName='page-link'
                    breakClassName='page-item'
                    breakLinkClassName='page-link'
                    containerClassName='pagination'
                    activeClassName='active'
                />
            </div>
        </>
    );
};