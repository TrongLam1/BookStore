import { GetAllOrdersByUser } from "@/app/api/orderApi";
import HistoryOrdersPageComponent from "@/components/layouts/client/profile/historyOrderPage";

export const metadata = {
    title: 'Lịch sử đơn hàng'
}

export default async function HistoryOrdersPage() {

    const res = await GetAllOrdersByUser();

    return (
        <HistoryOrdersPageComponent
            listOrders={res.data.listOrders}
            totalPages={res.data.totalPages} />
    );
};