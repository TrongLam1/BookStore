'use client'

import { useRouter } from "next/navigation";

export default function SidebarFilter(props: any) {

    const router = useRouter();
    const { filters, params } = props;

    const listBrands = filters.brands;
    const listTypes = filters.types;
    const listCategories = filters.categories;

    const handleFilterProducts = async () => {
        const containerBrands = document.querySelector(".types-book-brand");
        const containerTypes = document.querySelector(".types-book-type");
        const containerCategories = document.querySelector(".types-book-category");

        const brands = containerBrands!.querySelectorAll(".form-check-input");
        const types = containerTypes!.querySelectorAll(".form-check-input");
        const categories = containerCategories!.querySelectorAll(".form-check-input");

        const listBrandsFilter: string[] | string = [];
        const listTypesFilter: string[] = [];
        const listCategoriesFilter: string[] = [];

        brands.forEach((item: any) => {
            if (item.checked) {
                listBrandsFilter.push(item.value);
            }
        });

        types.forEach((item: any) => {
            if (item.checked) {
                listTypesFilter.push(item.value);
            }
        });

        categories.forEach((item: any) => {
            if (item.checked) {
                listCategoriesFilter.push(item.value);
            }
        });

        updateUrlPath({
            category: listCategoriesFilter,
            type: listTypesFilter,
            brand: listBrandsFilter
        });
    }

    const updateUrlPath = (newParams: any) => {
        let urlSearch = '';
        urlSearch = `?category=${newParams.category}`;
        urlSearch += `&type=${newParams.type}`;
        urlSearch += `&brand=${newParams.brand}`;
        urlSearch += `&sort=${params.sort ?? ''}&orderBy=${params.orderBy ?? ''}`;
        urlSearch += `&page=${params.page ?? 1}`;

        router.push(urlSearch);
    }

    return (
        <div className="types-book-filter-container col-lg-2">
            <div className="types-book-filter">
                <div className="types-book-brand">
                    <div className="heading-brand">HÃNG SẢN XUẤT</div>
                    {listBrands && listBrands.length > 0 &&
                        listBrands.map((item: any, index: number) => (
                            <div key={`brands-${index}`} className="form-check form-check-custom">
                                <input type="checkbox"
                                    className="form-check-input"
                                    id={`brand-${index}`}
                                    name={item.brandName} value={item.brandName}
                                />
                                <label className="form-check-label" htmlFor={`brand-${index}`}>
                                    {item.brandName}
                                </label>
                            </div>
                        ))
                    }
                </div>
                <div className="types-book-type">
                    <div className="heading-brand">THỂ LOẠI SÁCH</div>
                    {listTypes && listTypes.length > 0 &&
                        listTypes.map((item: any, index: number) => (
                            <div key={`types-${index}`} className="form-check form-check-custom">
                                <input type="checkbox"
                                    className="form-check-input"
                                    id={`types-${index}`}
                                    name={item.typeName} value={item.typeName}
                                />
                                <label className="form-check-label" htmlFor={`types-${index}`}>
                                    {item.typeName}
                                </label>
                            </div>
                        ))
                    }
                </div>
                <div className="types-book-category">
                    <div className="heading-brand">DANH MỤC SÁCH</div>
                    {listCategories && listCategories.length > 0 &&
                        listCategories.map((item: any, index: number) => (
                            <div key={`types-${index}`} className="form-check form-check-custom">
                                <input type="checkbox"
                                    className="form-check-input"
                                    id={`category-${index}`}
                                    name={item.categoryName} value={item.categoryName}
                                />
                                <label className="form-check-label" htmlFor={`category-${index}`}>
                                    {item.categoryName}
                                </label>
                            </div>
                        ))
                    }
                </div>
                <div className="types-book-btn">
                    <button
                        type="button"
                        id="filterBook"
                        className="filter-book"
                        onClick={() => handleFilterProducts()}
                    >Lọc</button>
                </div>
            </div>
        </div>
    );
};


