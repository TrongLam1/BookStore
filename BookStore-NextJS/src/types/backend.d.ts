export { };
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
    }

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }

    interface ILogin {
        user: {
            id: number;
            name: string;
            email: string;
            role: any;
        },
        access_token: string;
        refresh_token: string;
    }

    interface IUser {
        id: number;
        name: string;
        email: string;
    }

    interface IBook {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        currentPrice: number;
        name: string;
        type: IType;
        brand: IBrand;
        category: ICategory;
        description: string;
        sale: number;
        inventory: number;
        isAvailable: boolean;
        imageId: string;
        imageUrl: string;
        rating: number;
    }

    interface IType {
        id: number;
        typeName: string;
        isAvailable: boolean;
    }

    interface IBrand {
        id: number;
        brandName: string;
        isAvailable: boolean;
    }

    interface ICategory {
        id: number;
        categoryName: string;
        isAvailable: boolean;
    }
}
