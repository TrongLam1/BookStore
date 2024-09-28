import { sendRequest } from "@/utils/api";

export async function FindAllBrands() {
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/brand/all`,
        method: 'GET'
    });
}