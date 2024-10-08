import TableProductsComponent from "@/components/layouts/dashboard/table/tableProducts";
import { auth } from "../../../../../../auth";
import { FindAllProducts } from "@/app/api/productsApi";

export default async function TableProductsPage({ params }: { params: { current: number } }) {

    const session = await auth();
    const user = session?.user.user;

    const res = await FindAllProducts();

    return (
        <TableProductsComponent data={res} />
    )
}