import { FindProductById } from "@/app/api/productsApi";
import ProductDetailComponent from "@/components/layouts/client/productDetail/productDetailComponent";
import '../../../../components/layouts/client/productDetail/productDetailComponent.scss';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {

    const res = await FindProductById(params.id);

    const product = res?.data;
    console.log(product.name);

    return (
        <div className='product-detail-page'>
            <ProductDetailComponent productDetail={product} />
        </div>
    );
};