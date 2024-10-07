import DashboardComponent from "@/components/layouts/dashboard/dashboardComponent";
import { auth } from "../../../../auth";
import { GetStatisticOrders } from "@/app/api/orderApi";

export const metadata = {
    title: "Dashboard",
}

export default async function Dashboard() {

    const session = await auth();
    const user = session?.user.user;

    const res = await GetStatisticOrders(session?.user.token);

    return (<DashboardComponent user={user} statistic={res?.data} />)
}