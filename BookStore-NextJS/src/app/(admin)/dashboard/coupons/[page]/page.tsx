import { GetAllCoupons } from "@/app/api/couponApi";
import TableCouponsComponent from "@/components/layouts/dashboard/table/tableCoupons";

export const metadata = {
    title: "Danh sách mã giảm giá"
}

export default async function TableCouponsPage({ params }: { params: { page: number } }) {

    const res = await GetAllCoupons(params.page);

    return (
        <TableCouponsComponent current={params.page} data={res.data} />
    );
};