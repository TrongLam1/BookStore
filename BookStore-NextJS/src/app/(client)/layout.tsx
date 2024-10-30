import HomePageFooter from "@/components/layouts/client/footer/homepage.footer";
import HomePageHeader from "@/components/layouts/client/header/homepage.header";
import { auth } from "../../../auth";
import { GetShoppingCart, GetShoppingCartSession } from "../api/shoppingCartApi";
import Cookies from 'js-cookie';

export default async function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth();
    const user = session?.user?.user;
    const token = session?.user?.token;

    let shoppingCart = null;

    if (user) {
        const res = await GetShoppingCart();
        if (res.statusCode === 200) { shoppingCart = res?.data; }
    } else {
        const sessionId = Cookies.get('sessionId');
        const res = await GetShoppingCartSession(sessionId);
        if (res.statusCode === 200) { shoppingCart = res?.data.shoppingCart; }
    }

    return (
        <div>
            <HomePageHeader user={user} token={token} dataShoppingCart={shoppingCart} />
            {children}
            <HomePageFooter />
        </div>
    );
};