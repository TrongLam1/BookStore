import HomePageBanner from "@/components/layouts/client/banner/homepage.banner";

export const metadata = {
    title: 'Trang chủ'
}

const HomeLayout = async ({
    children,
}: {
    children: React.ReactNode
}) => {

    return (
        <div>
            <HomePageBanner></HomePageBanner>
            {children}
        </div>
    );
};

export default HomeLayout;