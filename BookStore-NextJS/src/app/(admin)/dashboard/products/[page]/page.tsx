import TableProductsComponent from "@/components/layouts/dashboard/table/tableProducts";
import { auth } from "../../../../../../auth";
import { FindAllProducts } from "@/app/api/productsApi";
import { FindAllTypes } from "@/app/api/typesApi";
import { FindAllBrands } from "@/app/api/brandsApi";
import { FindAllCategories } from "@/app/api/categoriesApi";

export const metadata = {
    title: "Danh sách sản phẩm"
}

export default async function TableProductsPage({ params }: { params: { current: number } }) {

    const session = await auth();
    const user = session?.user.user;

    const dataProducts = await FindAllProducts();

    const dataTypes = await FindAllTypes();
    const dataBrands = await FindAllBrands();
    const dataCategories = await FindAllCategories();

    const dataSelect = {
        types: dataTypes.data,
        brands: dataBrands.data,
        categories: dataCategories.data
    }

    return (
        <TableProductsComponent dataProducts={dataProducts}
            dataSelect={dataSelect}
            current={params.current} />
    )
}