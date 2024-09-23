
export class ExcelBookDto {
    name: string;

    category: string;

    type: string;

    brand: string;

    description: string;

    price: number;

    sale: number;

    inventory: number;

    file: Express.Multer.File;
};