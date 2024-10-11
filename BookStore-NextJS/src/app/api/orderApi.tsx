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
        headers: { Authorization: `Bearer ${token}` },
        nextOption: {
            cache: 'no-store'
        }
    });
}

export async function FindOrderById(orderId: number) {
    const session = await auth();
    const token = session?.user?.token;
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/order-id/${orderId}`,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        nextOption: {
            next: { tags: [`order-detail-${orderId}`] }
        }
    });
}

export async function AdminFindOrderById(orderId: number) {
    const session = await auth();
    const token = session?.user?.token;
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/admin/order-id/${orderId}`,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        nextOption: {
            next: { tags: [`order-detail-${orderId}`] }
        }
    });
}

export async function GetAllOrdersByUser() {
    const session = await auth();
    const token = session?.user?.token;
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/history-orders`,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        nextOption: {
            next: { tags: [`list-orders-${session?.user?.user?.userId}`] },
        }
    });
}

export async function CancelOrder(orderId: number) {
    const session = await auth();
    const token = session?.user?.token;
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/cancel/${orderId}`,
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function UpdateOrderStatus(orderId: number, orderStatus: string) {
    const session = await auth();
    const token = session?.user?.token;
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/update-status`,
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: {
            id: orderId,
            orderStatus
        }
    });
}

export async function GetStatisticOrders(token: string) {
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/statistic-orders`,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function GetAllOrders(current: number, pageSize: number, token: string) {
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/all-orders`,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        queryParams: { current, pageSize }
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