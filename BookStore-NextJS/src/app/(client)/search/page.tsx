import { FindProductsByKeyword } from "@/app/api/productsApi";
import ListProductsSearch from "@/components/layouts/client/listProducts/searchPage/listProductsSearch";
import { auth } from "../../../../auth";

export default async function SearchPage({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {

    const keyword: any = searchParams.keyword;
    const res = await FindProductsByKeyword(keyword);

    const session = await auth();
    const user = session?.user.user;

    return (
        <ListProductsSearch
            listBooks={res.listProducts} totalItems={res.totalItems} user={user} />
    );
};

