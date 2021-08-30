import { CatsService } from './cats.service';
import { CreateCatRequest } from './dto/CreateCat.dto';
export declare class CatsController {
    private readonly catsService;
    constructor(catsService: CatsService);
    create(createCatRequest: CreateCatRequest): import("./dto/CreateCat.dto").CreateCatResponse;
    findAll(): string;
    findOne(id: string): number;
}
