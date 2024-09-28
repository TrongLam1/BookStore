import { FindAllProducts, FindProductsByFilter } from '@/app/api/productsApi';
import ListProducts from '@/components/layouts/client/listProducts/homePage/listProducts';
import ListProductsType from '@/components/layouts/client/listProducts/homePage/listProductsOfType';
import imgBanner1 from '../../../assets/images/banner/banner-thieunhi.webp';
import imgBanner2 from '../../../assets/images/banner/banner-tudien.webp';

const HomePage = async () => {

    const type1: string = JSON.stringify(["Truyện Tranh Thiếu Nhi"]);
    const type2: string = JSON.stringify(["Từ Điển Anh Việt"]);

    const res1 = await FindAllProducts(1, 5, 'ASC', 'sale');
    const res2 = await FindProductsByFilter('1', '5', 'ASC', 'sale', type1);
    const res3 = await FindProductsByFilter('1', '5', 'ASC', 'sale', type2);

    return (
        <div>
            <ListProducts listBooks={res1.listProducts} />
            <ListProductsType listBooks={res2.listProducts} imgBanner={imgBanner1} type={type1} />
            <ListProductsType listBooks={res3.listProducts} imgBanner={imgBanner2} type={type2} />
        </div>
    )
};

export default HomePage;