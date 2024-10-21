import { GetAllOrders } from "@/app/api/orderApi";
import TableOrdersComponent from "@/components/layouts/dashboard/table/tableOrders";

export const metadata = {
    title: "Danh sách đơn hàng"
}

export default async function TableOrdersPage({ params }: { params: { page: number } }) {

    const res = await GetAllOrders(params.page, 10);

    return (<TableOrdersComponent current={params.page} data={res.data} />);
};