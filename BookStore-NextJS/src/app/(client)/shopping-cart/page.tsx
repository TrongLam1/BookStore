import { GetShoppingCart } from "@/app/api/shoppingCartApi";
import ShoppingCartComponent from "@/components/layouts/client/shoppingCart/shoppingCartComponent";
import { auth } from "../../../../auth";

export default async function ShoppingCartPage() {

    const session = await auth();
    const user = session?.user?.user;

    const res = await GetShoppingCart();
    const shoppingCart = res?.data;

    return (
        <ShoppingCartComponent user={user} />
    )
}