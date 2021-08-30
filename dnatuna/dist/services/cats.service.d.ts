import { CreateCatRequest, CreateCatResponse } from '../dto/CreateCat.dto';
export declare class CatsService {
    create(createCatRequest: CreateCatRequest): CreateCatResponse;
    findAll(): string;
    findOne(id: number): number;
}
