import HomePageBanner from "@/components/layouts/client/banner/homepage.banner";
import HomePageFooter from "@/components/layouts/client/footer/homepage.footer";
import HomePageHeader from "@/components/layouts/client/header/homepage.header";
import ListProducts from "@/components/layouts/client/listProducts/listProducts";
import ListProductsType from "@/components/layouts/client/listProducts/listProductsOfType";
import imgBanner1 from '../../../assets/images/banner/banner-thieunhi.webp';
import imgBanner2 from '../../../assets/images/banner/banner-tudien.webp';

const ClientLayout = async ({ children }: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <div>
            <HomePageHeader></HomePageHeader>
            <HomePageBanner></HomePageBanner>
            <ListProducts />
            <ListProductsType imgBanner={imgBanner1} />
            <ListProductsType imgBanner={imgBanner2} />
            <HomePageFooter></HomePageFooter>
        </div>
    );
};

export default ClientLayout;