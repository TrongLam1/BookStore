'use server'

import { sendRequest } from "@/utils/api";
import { auth } from "../../../auth"

export async function CreateNewCoupon(formData) {
    const session = await auth();
    const token = session?.user.token;
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/coupons`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });
};

export async function UpdateCoupon(formData) {
    const session = await auth();
    const token = session?.user.token;
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/coupons`,
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });
};

export async function RemoveCoupon(idCoupon: number) {
    const session = await auth();
    const token = session?.user.token;
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/coupons/remove/${idCoupon}`,
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
};

export async function GetAllCoupons(current: number) {
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/coupons/${current}`,
        method: 'GET',
        nextOption: {
            next: { tags: [`list-coupons-${current}`] }
        }
    });
};

export async function GetOneCoupon(idCoupon: number) {
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/coupons/id/${idCoupon}`,
        method: 'GET',
        nextOption: {
            next: { tags: [`coupon-${idCoupon}`] }
        }
    });
};