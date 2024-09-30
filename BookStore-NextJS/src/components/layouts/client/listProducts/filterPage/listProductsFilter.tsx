'use client'

import { useRouter } from "next/navigation";
import CardProduct from "../../cardProduct/cardProduct";
import './listProductsFilter.scss';

export default function ListProductsFilter(props: any) {

    const router = useRouter();
    const { listProducts, totalPages } = props;

    const handleSort = (event, orderBy, sort) => {
        const containerSort = event.target.parentNode.parentNode;
        const btnSort = containerSort.querySelectorAll(".btn-sort");
        btnSort.forEach((item: any) => item.classList.remove("active"));
        event.target.classList.add("active");

        updateUrlPath({ sort, orderBy });
    }

    const updateUrlPath = (newParams: any) => {
        let urlSearch = window.location.search;
        if (urlSearch.includes('?category')) {
            if (urlSearch.includes('&sort')) {
                const indexClear = urlSearch.indexOf('&sort');
                const clear = urlSearch.slice(indexClear);
                urlSearch = urlSearch.replace(clear, '');
            }

            urlSearch += `&sort=${newParams.sort}&orderBy=${newParams.orderBy}`;
        } else {
            urlSearch += `?category=&type=&brand=&sort=${newParams.sort}&orderBy=${newParams.orderBy}`;
        }

        router.push(urlSearch);
    };

    return (
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
                            onClick={(e) => handleSort(e, "salePrice", "ASC")}>Giá tăng dần
                        </button>
                    </span>
                    <span>
                        <button className="btn-sort" type="button"
                            onClick={(e) => handleSort(e, "salePrice", "DESC")}>Giá giảm dần
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
    );
};
