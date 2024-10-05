'use server'

import { sendRequest } from "@/utils/api";
import { auth } from "../../../auth";

export async function PlaceOrder(request: IRequestPlaceOrder) {
    const session = await auth();
    const token = session?.user?.token;
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/place-order`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: request
    });
}

export async function FindOrderByCodeBill(codeBill: string) {
    const session = await auth();
    const token = session?.user?.token;
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/one-order/${codeBill}`,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function PaymentBanking(orderId: number) {
    const session = await auth();
    const token = session?.user?.token;
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/vnpay/${orderId}`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    });
}