'use server'
import { sendRequest } from "@/utils/api";
import { auth } from "../../../auth";

interface IAddToCart {
    bookId: number;
    quantity: number;
}

interface IUpdateProductCard {
    cartItemId: number;
    quantity: number;
}

export async function AddProductToCart(body: IAddToCart) {
    const session = await auth();
    const token = session?.user?.token;
    if (session?.user.user) {
        return await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart`,
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body
        });
    }
};

export async function UpdateQuantityProductCart(body: IUpdateProductCard) {
    const session = await auth();
    const token = session?.user?.token;
    if (session?.user.user) {
        return await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart`,
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body
        });
    }
};

export async function RemoveProductFromCart(cartItemId: number) {
    const session = await auth();
    const token = session?.user?.token;
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart/remove-product/${cartItemId}`,
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
};

export async function GetShoppingCart() {
    const session = await auth();
    const token = session?.user?.token;
    if (!!session?.user.user) {
        return await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart/user/${session?.user?.user.id}`,
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
            nextOption: {
                next: { tags: [`shopping-cart-${session?.user?.id}`] },
            }
        });
    }
};

export async function AddProductToCartSession(body: any) {
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart/session`,
        method: 'POST',
        body
    });
};

export async function GetShoppingCartSession(sessionId: string) {
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart/session`,
        method: 'GET',
        queryParams: { sessionId: sessionId ?? null }
    });
};

export async function UpdateQuantityProductCartSession(sessionId: string, body: IUpdateProductCard) {
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart/session`,
        method: 'PUT',
        queryParams: { sessionId },
        body
    });
};

export async function RemoveProductFromCartSession(sessionId: string, cartItemId: number) {
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart/session`,
        method: 'DELETE',
        queryParams: { sessionId, cartItemId }
    });
};

export async function ConvertShoppingCartFromSession(sessionId: string, token: string) {
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart/convert-session`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        queryParams: { sessionId }
    });
}