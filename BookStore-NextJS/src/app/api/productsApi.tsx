import { sendRequest } from "@/utils/api";

export async function FindProductsByKeyword(keyword: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/books/find/name`,
        method: 'GET',
        queryParams: { name: keyword },
        nextOption: {
            next: { tags: [`list-books-${keyword}`] },
            cache: 'no-store'
        }
    });

    return {
        listProducts: res?.data?.books,
        totalItems: res?.data?.totalItems,
        totalPages: res?.data?.totalPages
    }
}

export async function FindAllProducts(
    current: number = 1,
    pageSize: number = 10,
    sort: string = 'ASC',
    orderBy: string = 'id') {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/books/all`,
        method: 'GET',
        queryParams: { current, pageSize, sort, orderBy },
        nextOption: {
            next: { tags: [`all-products-page-${current}`] }
        }
    });

    return {
        listProducts: res?.data?.books,
        totalItems: res?.data?.totalItems,
        totalPages: res?.data?.totalPages
    }
}

export async function FindProductsByFilter(
    current: string,
    pageSize: string,
    sort: string,
    orderBy: string,
    typesString: string | null = null,
    brandsString: string | null = null,
    categoriesString: string | null = null
) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/books/find/filter`,
        method: 'GET',
        queryParams: { current, pageSize, sort, orderBy, typesString, brandsString, categoriesString },
        nextOption: {
            cache: 'no-store'
        }
    });

    return {
        listProducts: res?.data?.books,
        totalItems: res?.data?.totalItems,
        totalPages: res?.data?.totalPages
    }
}

export async function FindProductById(id: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/books/find-one/${id}`,
        method: 'GET',
        nextOption: {
            cache: 'no-store',
            next: { tags: [`book-${id}`] }
        }
    });

    return res;
}