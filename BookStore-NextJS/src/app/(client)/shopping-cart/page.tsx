import ShoppingCartComponent from "@/components/layouts/client/shoppingCart/shoppingCartComponent";
import { auth } from "../../../../auth";
import { GetShoppingCart } from "@/app/api/shoppingCartApi";

export default async function ShoppingCartPage() {

    const session = await auth();
    const user = session?.user.user;

    const res = await GetShoppingCart(user.id, session?.user?.token);
    const shoppingCart = res?.data;

    return (
        <>
            <ShoppingCartComponent user={user} shoppingCart={shoppingCart} />
        </>
    )
}