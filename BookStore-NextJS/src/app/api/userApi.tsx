'use server'
import { sendRequest } from "@/utils/api";
import { auth } from "../../../auth";

interface IUpdateInfo {
    username: string;
    phone: string;
    address: string;
}

export async function LoginWithGoogle() {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/login`;
}

export async function ResetPasswordApi(body: any) {
    const session = await auth();
    const token = session?.user?.token;
    if (session?.user.user) {
        return await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`,
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body
        });
    }
}

export async function ActiveAccount(email: string, code: number) {
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/active`,
        method: 'GET',
        queryParams: { email: email, code: code }
    });
}

export async function ReactiveCode(email: string) {
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/reactive`,
        method: 'GET',
        queryParams: { email }
    });
}

export async function FindAllUsers(current: number, pageSize: number) {
    const session = await auth();
    const token = session?.user?.token;
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/find/all-users`,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        queryParams: { current, pageSize }
    });

    return {
        listUsers: res.data.result,
        totalItems: res.data.totalItems,
        totalPages: res.data.totalPages
    }
}

export async function FindUsersByNameContaining(current: number, pageSize: number, username: string) {
    const session = await auth();
    const token = session?.user?.token;
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/find/username`,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        queryParams: { current, pageSize, username }
    });
}

export async function GetProfileUser() {
    const session = await auth();
    const token = session?.user?.token;
    const userId = session?.user?.user.userId;
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile/${userId}`,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function UpdateProfileUser(body: IUpdateInfo) {
    const session = await auth();
    const token = session?.user?.token;
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/update`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body
    });
}