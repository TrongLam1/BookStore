'use client'
import Link from "next/link";
import CardProduct from "../../cardProduct/cardProduct";
import './listProducts.scss';

const ListProducts = (props: any) => {

    const { listBooks } = props;

    return (
        <section className="section-book-tag">
            <div className="container container-custom">
                <div
                    className="title_module_main heading-bar e-tabs not-dqtab d-flex justify-content-between align-items-center flex-wrap">
                    <h4 className="heading-bar__title">
                        <div className="link">Top sách bán chạy</div>
                    </h4>
                    <h6 className="heading-bar__showall">
                        <Link href="/filter" className="link">Xem tất cả</Link>
                    </h6>
                </div>
                <div className="container-book-cards row mx-sm-0">
                    {listBooks && listBooks.length > 0 ?
                        listBooks.map((item: IBook, index: number) => {
                            return <CardProduct key={index} book={item} col={'col-20'} />
                        }) : (<div>Không có sản phẩm</div>)
                    }
                </div>
            </div>
        </section>
    );
};

export default ListProducts;
