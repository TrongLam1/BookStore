import CheckOutPageComponent from "@/components/layouts/client/checkOut/checkOutPageConponent";
import { auth } from "../../../../auth";

export const metadata = {
    title: 'Thanh toán'
}

export default async function CheckOutPage() {

    const session = await auth();
    const user = session?.user?.user;

    return (
        <CheckOutPageComponent user={user} />
    )
}