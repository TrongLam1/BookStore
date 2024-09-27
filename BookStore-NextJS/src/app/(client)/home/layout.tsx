import HomePageBanner from "@/components/layouts/client/banner/homepage.banner";
import HomePageFooter from "@/components/layouts/client/footer/homepage.footer";
import HomePageHeader from "@/components/layouts/client/header/homepage.header";

const ClientLayout = async ({
    children,
}: {
    children: React.ReactNode
}) => {

    return (
        <div>
            <HomePageHeader></HomePageHeader>
            <HomePageBanner></HomePageBanner>
            {children}
            <HomePageFooter></HomePageFooter>
        </div>
    );
};

export default ClientLayout;