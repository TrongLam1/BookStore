'use server'
import { sendRequest, sendRequestFile } from "@/utils/api";
import { auth } from "../../../auth";

export async function AddNewProduct(formData) {
    const session = await auth();
    const token = session?.user.token;
    return await sendRequestFile<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/books/create`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });
}

export async function UploadExcel(formData) {
    const session = await auth();
    const token = session?.user.token;
    return await sendRequestFile<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/books/upload-excel`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });
}

export async function UpdateProduct(formData) {
    const session = await auth();
    const token = session?.user.token;
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/books/update-book`,
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });
}

export async function UpdateImgProduct(formData) {
    const session = await auth();
    const token = session?.user.token;
    return await sendRequestFile<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/books/update-img`,
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });
}

export async function FindProductsByKeyword(keyword: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/books/find/name`,
        method: 'GET',
        queryParams: { name: keyword },
        nextOption: {
            next: { tags: [`list-books-${keyword}`] }
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
            next: { tags: [`book-${id}`] }
        }
    });

    return res;
}

export async function GetRandomProducts() {
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/books/random`,
        method: 'GET'
    });
}