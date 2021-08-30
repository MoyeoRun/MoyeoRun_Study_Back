import { CreateCatRequest } from '../dto/CreateCat.dto';
import { CatsService } from '../services/cats.service';
export declare class CatsController {
    private readonly catsService;
    constructor(catsService: CatsService);
    create(createCatRequest: CreateCatRequest): import("../dto/CreateCat.dto").CreateCatResponse;
    findAll(): string;
    findOne(id: string): number;
}
