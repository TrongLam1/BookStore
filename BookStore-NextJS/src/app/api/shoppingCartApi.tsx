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
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart`,
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body
        });

        return res;
    }
};

export async function UpdateQuantityProductCart(body: IUpdateProductCard) {
    const session = await auth();
    const token = session?.user?.token;
    if (session?.user.user) {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart`,
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body
        });

        return res;
    }
};

export async function RemoveProductFromCart(cartItemId: number) {
    const session = await auth();
    const token = session?.user?.token;
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart/remove-product/${cartItemId}`,
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });

    return res;
};

export async function GetShoppingCart() {
    const session = await auth();
    const token = session?.user?.token;
    if (!!session?.user.user) {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart`,
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
            nextOption: {
                next: { tags: [`shopping-cart-${session?.user?.id}`] },
            }
        });

        return res;
    }
};