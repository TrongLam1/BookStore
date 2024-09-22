import Image from "next/image";
import Link from "next/link";
import CardProduct from "../cardProduct/cardProduct";
import './listProducts.scss';

const ListProductsType = (props: any) => {

    const { imgBanner } = props;

    return (
        <>
            <section className="section-book-tag-type">
                <div className="container container-custom">
                    <Link href="/category/dictionary" className="banner-tag-img">
                        <Image src={imgBanner} alt="Banner" />
                    </Link>
                    <div className="container-book-cards row mx-sm-0">
                        <CardProduct col={'col-20'} />
                    </div>
                </div>
            </section>
        </>
    )
};

export default ListProductsType;