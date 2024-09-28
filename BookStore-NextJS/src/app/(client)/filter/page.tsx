import { FindAllBrands } from "@/app/api/brandsApi"
import { FindAllCategories } from "@/app/api/categoriesApi"
import { FindProductsByFilter } from "@/app/api/productsApi"
import { FindAllTypes } from "@/app/api/typesApi"
import SidebarFilter from "@/components/layouts/client/filter/sidebarFilter"
import ListProductsFilter from "@/components/layouts/client/listProducts/filterPage/listProductsFilter"
import '../../../components/layouts/client/filter/filterPage.scss'

export default async function FilterPage({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {

    const types = await FindAllTypes();
    const brands = await FindAllBrands();
    const categories = await FindAllCategories();

    const filters = {
        types: types.data.types,
        brands: brands.data.brands,
        categories: categories.data.categories,
    };

    const current: any = searchParams?.page ?? 1;
    const sort: any = searchParams?.sort ?? 'ASC';
    const orderBy: any = searchParams?.orderBy ?? 'id';
    const categoryParam: any = searchParams.category;
    const brandParam: any = searchParams.brand;
    const typesParam: any = searchParams.type;

    // Convert string to array
    const arrCategories = categoryParam?.split(',') ?? null;
    const arrBrands = brandParam?.split(',') ?? null;
    const arrTypes = typesParam?.split(',') ?? null;

    // Convert array to JSON string
    const typesString: string = JSON.stringify(arrTypes);
    const brandsString: string = JSON.stringify(arrBrands);
    const categoriesString: string = JSON.stringify(arrCategories);

    const res = await FindProductsByFilter(current, '10', sort, orderBy, typesString, brandsString, categoriesString);

    const listProducts = res?.listProducts;
    const totalPages = res?.totalPages;

    return (
        <>
            <div className='types-book-container row'>
                <SidebarFilter filters={filters} searchParams={searchParams} />
                <ListProductsFilter listProducts={listProducts} totalPages={totalPages}
                    searchParams={searchParams} />
            </div>
        </>
    )
};
