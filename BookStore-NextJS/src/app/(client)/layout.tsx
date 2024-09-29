import HomePageFooter from "@/components/layouts/client/footer/homepage.footer";
import HomePageHeader from "@/components/layouts/client/header/homepage.header";
import { auth } from "../../../auth";

export default async function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth();
    const user = session?.user?.user;

    return (
        <div>
            <HomePageHeader user={user} />
            {children}
            <HomePageFooter />
        </div>
    );
};