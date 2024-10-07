import { FindOrderById } from "@/app/api/orderApi";
import OrderDetailComponent from "@/components/layouts/client/orderDetail/orderDetailComponent";

export const metadata = {
    title: 'Chi tiết đơn hàng'
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {

    const res = await FindOrderById(+params.id);

    return (
        <OrderDetailComponent order={res.data} />
    );
};