'use client'

import CardProduct from "../../cardProduct/cardProduct";

export default function ListProductsRandom(props: any) {

    const { listProducts, user } = props;

    return (
        <section className="section-book-tag-random">
            <div className="container container-custom">
                <div className="title_module_main heading-bar e-tabs not-dqtab d-flex justify-content-between align-items-center flex-wrap">
                    <h4 className="heading-bar__title">
                        <div className="link">Sách ngẫu nhiên</div>
                    </h4>
                </div>
                <div className="container-book-cards row mx-sm-0">
                    {listProducts && listProducts.length > 0 &&
                        listProducts.map((item, index: number) => {
                            return (<CardProduct key={`random-${index}`} book={item} col={'col-20'}
                                user={user} />)
                        })}
                </div>
            </div>
        </section>
    )
}