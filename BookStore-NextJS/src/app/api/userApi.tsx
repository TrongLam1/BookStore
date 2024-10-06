'use server'
import { sendRequest } from "@/utils/api";
import { auth } from "../../../auth";

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