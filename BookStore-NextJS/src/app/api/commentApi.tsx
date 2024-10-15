'use server'

import { sendRequest } from "@/utils/api";
import { auth } from "../../../auth"

export async function PostComment(formData) {
    const session = await auth();
    const token = session?.user.token;
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/post`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });
};

export async function GetCommentsByProduct(productId: number, current: number) {
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments`,
        method: 'GET',
        queryParams: { productId, current }
    });
};