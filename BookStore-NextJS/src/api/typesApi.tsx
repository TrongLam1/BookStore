import { sendRequest } from "@/utils/api";

export async function FindAllTypes() {
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/type/all`,
        method: 'GET',
        nextOption: {
            next: { tags: ['list-types'] }
        }
    });
}