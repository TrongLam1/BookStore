import { FindAllUsers } from "@/app/api/userApi";
import TableUsersComponent from "@/components/layouts/dashboard/table/tableUsers";

export const metadata = {
    title: "Danh sách người dùng"
}

export default async function TableUsersPage({ params }: { params: { page: number } }) {

    const res = await FindAllUsers(params.page, 10);

    return (<TableUsersComponent data={res} current={params.page} />);
};