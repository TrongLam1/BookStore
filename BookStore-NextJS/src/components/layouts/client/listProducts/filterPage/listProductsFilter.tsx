'use client'

import { useRouter } from "next/navigation";
import CardProduct from "../../cardProduct/cardProduct";
import './listProductsFilter.scss';
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";

export default function ListProductsFilter(props: any) {

    const router = useRouter();
    const { listProducts, totalPages, params } = props;

    const [page, setPage] = useState<number>(params.page ?? 1);

    useEffect(() => { }, [listProducts]);

    const handleSort = (event, orderBy, sort) => {
        const containerSort = event.target.parentNode.parentNode;
        const btnSort = containerSort.querySelectorAll(".btn-sort");
        btnSort.forEach((item: any) => item.classList.remove("active"));
        event.target.classList.add("active");

        updateUrlPath({ sort, orderBy });
    }

    const updateUrlPath = (newParams: any) => {
        let urlSearch = '';
        urlSearch += `?category=${params.category ?? ''}`;
        urlSearch += `&type=${params.type ?? ''}`;
        urlSearch += `&brand=${params.brand ?? ''}`;
        urlSearch += `&sort=${newParams.sort}`;
        urlSearch += `&orderBy=${newParams.orderBy}`;
        urlSearch += `&page=${params.page ?? 1}`;

        router.push(urlSearch);
    };

    const handlePageClick = (event) => {
        let urlSearch = '';
        urlSearch += `?category=${params.category ?? ''}`;
        urlSearch += `&type=${params.type ?? ''}`;
        urlSearch += `&brand=${params.brand ?? ''}`;
        urlSearch += `&sort=${params.sort ?? ''}`;
        urlSearch += `&orderBy=${params.orderBy ?? ''}`;
        urlSearch += `&page=${event.selected + 1}`;

        router.push(urlSearch);
    };

    return (
        <>
            <div className="types-book-list col-lg-10">
                <div className="heading-types-list">
                    <div className="heading-types-header">
                        TẤT CẢ SẢN PHẨM
                    </div>
                    <div className="heading-types-sort">
                        <span>Sắp xếp:</span>
                        <span>
                            <button className="btn-sort" type="button"
                                onClick={(e) => handleSort(e, "name", "ASC")}>Tên A-{'>'}Z
                            </button>
                        </span>
                        <span>
                            <button className="btn-sort" type="button"
                                onClick={(e) => handleSort(e, "name", "DESC")}>Tên Z-{'>'}A
                            </button>
                        </span>
                        <span>
                            <button className="btn-sort" type="button"
                                onClick={(e) => handleSort(e, "currentPrice", "ASC")}>Giá tăng dần
                            </button>
                        </span>
                        <span>
                            <button className="btn-sort" type="button"
                                onClick={(e) => handleSort(e, "currentPrice", "DESC")}>Giá giảm dần
                            </button>
                        </span>
                    </div>
                </div>
                <div className="book-list-container">
                    <div className="container-book-cards row mx-sm-0">
                        {listProducts && listProducts.length > 0 ?
                            listProducts.map((item: IBook, index: number) => {
                                return <CardProduct key={index} book={item} col={'col-lg-3'} />
                            }) : (<div>Không có sản phẩm</div>)
                        }
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center mt-4">
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={1}
                    pageCount={totalPages}
                    initialPage={page - 1}
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
