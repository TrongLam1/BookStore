import TableCouponsComponent from "@/components/layouts/dashboard/table/tableCoupons";

export default async function TableCouponsPage({ params }: { params: { current: number } }) {

    return (
        <TableCouponsComponent current={params.current} />
    );
};