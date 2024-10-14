'use client'

import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FindProductsByKeyword } from "@/app/api/productsApi";
import ProductItemComponent from "./tableItem/productItemComponent";
import './table.scss';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalNewProduct from "../../modal/modalProduct/modalNewProduct";
import ModalUpdateProduct from "../../modal/modalProduct/modalUpdateProduct";
import { CSpinner } from "@coreui/react";

export default function TableProductsComponent(props: any) {

    const { dataProducts, current, dataSelect } = props;

    const [loadingApi, setLoadingApi] = useState(false);
    const [listProducts, setListProducts] = useState(dataProducts?.listProducts ?? []);
    const [totalItems, setTotalItems] = useState(dataProducts?.totalItems ?? 1);
    const [page, setPage] = useState(current ?? 1);
    const [totalPages, setTotalPages] = useState(dataProducts?.totalPages ?? 1);

    const [search, setSearch] = useState();

    const [isShowModalNewProduct, setIsShowModalNewProduct] = useState(false);
    const [isShowModalEditProduct, setIsShowModalEditProduct] = useState(false);
    const [productIdUpdate, setProductIdUpdate] = useState();

    useEffect(() => { }, [listProducts, current]);

    const handleCloseModal = () => {
        setIsShowModalNewProduct(false);
        setIsShowModalEditProduct(false);
    };

    const handleSearchByName = async () => {
        setLoadingApi(true);
        const res = await FindProductsByKeyword(search);
        if (res.listProducts.length > 0) {
            setListProducts(res.listProducts);
            setTotalPages(res.totalPages);
            setTotalItems(res.totalItems);
        } else {
            setListProducts([]);
            setTotalPages(0);
            setTotalItems(0);
        }
        setLoadingApi(false);
    };

    return (
        <>
            <div className="container-fluid">
                <div className="container">
                    <div className="d-flex align-items-center">
                        <button
                            id="add-new-book"
                            className="button"
                            onClick={() => setIsShowModalNewProduct(true)}
                        >
                            Thêm sản phẩm
                        </button>
                        <div className="import-excel-container">
                            <div>
                                <input type="checkbox" name="checkExcel" id="checkExcel" />
                                <label htmlFor="checkExcel">Import Excel</label>
                            </div>
                            <input
                                type="file" id="import-excel"
                                accept=".xlsx, .xls, .csv" disabled
                            />
                            <button className="button" id="btn-import-excel" disabled >
                                <i className="fa-solid fa-upload"></i>
                                Import Excel
                            </button>
                            <button className="button" id="btn-export-excel">
                                <i className="fa-solid fa-download"></i>
                                Export Excel
                            </button>
                        </div>
                    </div>
                    <div className="d-flex search-container mt-3">
                        <input
                            className='search-form'
                            type="search"
                            placeholder="Tìm kiếm sản phẩm ..."
                            aria-label="Search"
                            value={search} onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button
                            variant="outline-success" onClick={handleSearchByName}
                        >
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </Button>
                    </div>

                    {loadingApi ? <CSpinner color="light" size="sm" className='me-3'
                        style={{ width: '5rem', height: '5rem' }} /> :
                        <table className="table table-striped table-responsive table-dashboard">
                            <thead className="heading-table">
                                <tr>
                                    <th>ID</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Hình ảnh</th>
                                    <th>Số lượng</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="body-table">
                                {listProducts && listProducts.length > 0 ?
                                    listProducts.map((item, index: number) => {
                                        return (
                                            <ProductItemComponent
                                                item={item} key={`product-${index}`}
                                                setIsShowModalEditProduct={setIsShowModalEditProduct}
                                                setProductIdUpdate={setProductIdUpdate}
                                            />
                                        )
                                    }) : (<tr><td>Không có danh sách sản phẩm.</td></tr>)
                                }
                            </tbody>
                        </table>
                    }
                </div>
            </div>
            <ModalNewProduct handleClose={handleCloseModal}
                show={isShowModalNewProduct} dataSelect={dataSelect} />
            <ModalUpdateProduct handleClose={handleCloseModal}
                show={isShowModalEditProduct} dataSelect={dataSelect} productId={productIdUpdate} />
        </>
    );
};