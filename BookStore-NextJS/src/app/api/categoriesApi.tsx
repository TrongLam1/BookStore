import { sendRequest } from "@/utils/api";

export async function FindAllCategories() {
    return await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/all`,
        method: 'GET',
        nextOption: {
            next: { tags: ['list-categories'] }
        }
    });
}