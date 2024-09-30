'use server'
import { sendRequest } from "@/utils/api";
import { auth } from "../../../auth";

interface IAddToCart {
    bookId: number;
    quantity: number;
}

export async function AddProductToCart(body: IAddToCart) {
    const session = await auth();
    const token = session?.user?.token;
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body
    });

    return res;
};

export async function RemoveProductFromCart(bookId: number) {
    const session = await auth();
    const token = session?.user?.token;
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart/remove-product/${bookId}`,
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });

    return res;
};

export async function GetShoppingCart(userId: number, token: string) {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart`,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        nextOption: {
            next: { tags: [`shopping-cart-${userId}`] },
        }
    });

    return res;
};