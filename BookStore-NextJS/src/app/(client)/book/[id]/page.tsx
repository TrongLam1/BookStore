import { FindProductById, GetRandomProducts } from "@/app/api/productsApi";
import ProductDetailComponent from "@/components/layouts/client/productDetail/productDetailComponent";
import '@/components/layouts/client/productDetail/productDetailComponent.scss';
import { GetCouponsValid } from "@/app/api/couponApi";
import ListProductsRandom from "@/components/layouts/client/listProducts/random/listProductRandom";
import ListComments from "@/components/layouts/client/comments/listComments";
import { GetCommentsByProduct } from "@/app/api/commentApi";
import { auth } from "../../../../../auth";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {

    const session = await auth();
    const token = session?.user.token;

    const resProduct = await FindProductById(params.id);
    const product = resProduct?.data;

    const resCoupons = await GetCouponsValid(1);
    const coupons = resCoupons?.data;

    const resRandom = await GetRandomProducts();
    const productRandom = resRandom?.data;

    const resComments = await GetCommentsByProduct(+params.id, 1);

    return (
        <div className='product-detail-page'>
            <ProductDetailComponent productDetail={product} coupons={coupons} random={productRandom} user={session?.user.user} />
            <ListComments data={resComments?.data} bookId={+params.id} token={token} />
            <ListProductsRandom listProducts={productRandom} user={session?.user.user} />
        </div>
    );
};