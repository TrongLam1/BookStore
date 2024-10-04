import HomePageFooter from "@/components/layouts/client/footer/homepage.footer";
import HomePageHeader from "@/components/layouts/client/header/homepage.header";
import { auth } from "../../../auth";
import { GetShoppingCart } from "../api/shoppingCartApi";

export default async function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth();
    const user = session?.user?.user;

    let shoppingCart = null;

    if (user) {
        const res = await GetShoppingCart();
        if (res.statusCode === 200) { shoppingCart = res?.data; }
    }

    return (
        <div>
            <HomePageHeader user={user} dataShoppingCart={shoppingCart} />
            {children}
            <HomePageFooter />
        </div>
    );
};