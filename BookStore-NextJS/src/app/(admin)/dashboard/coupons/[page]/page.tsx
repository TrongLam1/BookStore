import TableCouponsComponent from "@/components/layouts/dashboard/table/tableCoupons";

export const metadata = {
    title: "Danh sách mã giảm giá"
}


export default async function TableCouponsPage({ params }: { params: { current: number } }) {

    return (
        <TableCouponsComponent current={params.current} />
    );
};