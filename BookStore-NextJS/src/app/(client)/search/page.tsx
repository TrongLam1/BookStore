import { FindProductsByKeyword } from "@/app/api/productsApi";
import ListProductsSearch from "@/components/layouts/client/listProducts/searchPage/listProductsSearch";
import { auth } from "../../../../auth";
import { AddProductToCart } from "@/app/api/shoppingCartApi";

export default async function SearchPage({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {

    const keyword: any = searchParams.keyword;
    const res = await FindProductsByKeyword(keyword);

    const handleAddProductToCart = async (productId: number) => {
        // 'use server'

        const session = await auth();
        const user = session?.user.user;
        const res = await AddProductToCart({
            bookId: productId,
            quantity: 1
        }, user.access_token);

        console.log(res);
    };

    return (
        <ListProductsSearch
            listBooks={res.listProducts} totalItems={res.totalItems}
            handleAddProductToCart={handleAddProductToCart} />
    );
};

