import { GetAllOrders } from "@/app/api/orderApi";
import { auth } from "../../../../../../auth";
import TableOrdersComponent from "@/components/layouts/dashboard/table/tableOrders";

export const metadata = {
    title: "Danh sách đơn hàng"
}

export default async function TableOrdersPage({ params }: { params: { current: number } }) {

    const session = await auth();
    const token = session?.user.token;

    const res = await GetAllOrders(params.current, 10, token);

    return (<TableOrdersComponent data={res.data} />);
};