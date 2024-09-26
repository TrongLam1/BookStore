import { IsOptional } from "class-validator";

export class FilterBooksRequest {
    @IsOptional()
    current: number = 1;

    @IsOptional()
    pageSize: number = 10;

    @IsOptional()
    sort: string = 'ASC';

    @IsOptional()
    orderBy: string = 'id';

    @IsOptional()
    typeNames: string[] = null;

    @IsOptional()
    brandNames: string[] = null;

    @IsOptional()
    categoryNames: string[] = null;
}