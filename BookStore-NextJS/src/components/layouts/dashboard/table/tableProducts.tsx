'use client'

import { FindProductsByKeyword, UploadExcel } from "@/app/api/productsApi";
import { CSpinner } from "@coreui/react";
import { faDownload, faFileImport, faMagnifyingGlass, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalLoading from "../../modal/modalProduct/modalLoading";
import ModalNewProduct from "../../modal/modalProduct/modalNewProduct";
import ModalUpdateProduct from "../../modal/modalProduct/modalUpdateProduct";
import './table.scss';
import ProductItemComponent from "./tableItem/productItemComponent";

export default function TableProductsComponent(props: any) {
    const router = useRouter();
    const { dataProducts, current, dataSelect, token } = props;

    const [loadingApi, setLoadingApi] = useState(false);
    const [loadingUploadApi, setLoadingUploadApi] = useState(false);
    const [listProducts, setListProducts] = useState(dataProducts?.listProducts ?? []);
    const [totalItems, setTotalItems] = useState(dataProducts?.totalItems ?? 0);
    const [totalPages, setTotalPages] = useState(dataProducts?.totalPages ?? 1);

    const [search, setSearch] = useState();

    const [isShowModalNewProduct, setIsShowModalNewProduct] = useState(false);
    const [isShowModalEditProduct, setIsShowModalEditProduct] = useState(false);
    const [productIdUpdate, setProductIdUpdate] = useState();

    const [uploadFile, setUploadFile] = useState('');
    const [fileName, setFileName] = useState<string>('');

    useEffect(() => {
        setListProducts(dataProducts?.listProducts ?? []);
        setTotalPages(dataProducts?.totalPages ?? 1);
    }, [dataProducts]);

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

    const handlePageClick = (event) => {
        const pathName = window.location.pathname;
        const index = pathName.lastIndexOf('/');
        let url = pathName.slice(0, index);
        url += `/${event.selected + 1}`;
        router.push(url);
    };

    const removeFile = () => {
        setFileName('');
        setUploadFile('');
    };

    const handleUploadExcel = async () => {
        const file = new FormData();
        file.append('file', uploadFile);

        setLoadingUploadApi(true);
        const res = await UploadExcel(file);
        if (res.statusCode === 201) {
            toast.success("Thêm sản phẩm thành công.");
            router.refresh();
        } else {
            toast.error(res.message);
        }
        setLoadingUploadApi(false);
    };

    const handleExportExcel = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/books/export-excel`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const currentTime = new Date();
            const formattedTime = `${currentTime.getFullYear()}${(currentTime.getMonth() + 1).toString().padStart(2, '0')}${currentTime.getDate().toString().padStart(2, '0')}_${currentTime.getHours().toString().padStart(2, '0')}${currentTime.getMinutes().toString().padStart(2, '0')}${currentTime.getSeconds().toString().padStart(2, '0')}`;

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `books_${formattedTime}.xlsx`);
            document.body.appendChild(link);
            link.click();

            // Clean up after the download
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }

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
                            <div className="upload-excel">
                                <label htmlFor="upload-excel">
                                    <FontAwesomeIcon icon={faFileImport} />
                                    Upload Excel
                                </label>
                                <input
                                    type="file" id="upload-excel"
                                    accept=".xlsx, .xls, .csv"
                                    onChange={(e) => {
                                        setFileName(e.target.files[0].name);
                                        setUploadFile(e.target.files[0]);
                                    }}
                                />
                                <span>{fileName}</span>
                                {uploadFile !== '' &&
                                    <span className="remove-file" onClick={removeFile}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </span>}
                            </div>
                            <div>
                                <button className="button" id="btn-import-excel"
                                    disabled={uploadFile !== '' ? false : true}
                                    onClick={handleUploadExcel}
                                >
                                    <FontAwesomeIcon icon={faUpload} />
                                    Import Excel
                                </button>
                                <button className="button" id="btn-export-excel"
                                    onClick={() => handleExportExcel()}
                                >
                                    <FontAwesomeIcon icon={faDownload} />
                                    Export Excel
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex search-container mt-3 mb-3">
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
            <ModalLoading show={loadingUploadApi} />
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