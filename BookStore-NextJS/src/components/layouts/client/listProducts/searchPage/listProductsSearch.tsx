'use client'
import CardProduct from "../../cardProduct/cardProduct";
import './listProductsSearch.scss';
import '../homePage/listProducts.scss';

interface IListProducts {
    listBooks: [],
    totalItems: number
}

const ListProductsSearch = (props: IListProducts) => {

    const { listBooks, totalItems } = props;

    return (
        <div className='search-page-container'>
            <div className="heading-search-page">
                <div className="heading-search">TÌM KIẾM</div>
                <div className="heading-text">
                    Có <strong> {totalItems} sản phẩm </strong> cho tìm kiếm
                </div>
            </div>
            <div className="body-search-page">
                <div className="list-search-container d-flex">
                    <div className="container-book-cards row mx-sm-0">
                        {listBooks && listBooks.length > 0 ?
                            listBooks.map((item: IBook, index: number) => {
                                return <CardProduct key={index} book={item} col={'col-20'} />
                            }) : (<div>Không có sản phẩm</div>)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListProductsSearch;