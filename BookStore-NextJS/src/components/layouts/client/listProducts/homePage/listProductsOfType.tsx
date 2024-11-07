/* eslint-disable @next/next/no-img-element */
'use client'
import Image from "next/image";
import Link from "next/link";
import CardProduct from "../../cardProduct/cardProduct";
import './listProducts.scss';

const ListProductsType = (props: any) => {

    const { imgBanner, listBooks, link, user } = props;

    return (
        <>
            <section className="section-book-tag-type">
                <div className="container container-custom">
                    <Link href={link} className="banner-tag-img">
                        <Image src={imgBanner} alt="Banner" />
                    </Link>
                    <div className="container-book-cards row mx-sm-0">
                        {listBooks && listBooks.length > 0 ?
                            listBooks.map((item: IBook, index: number) => {
                                return <CardProduct key={index} book={item} col={'col-20'} user={user} />
                            }) : (<div>Không có sản phẩm</div>)
                        }
                    </div>
                </div>
            </section>
        </>
    )
};

export default ListProductsType;