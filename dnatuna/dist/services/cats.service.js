"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatsService = void 0;
const common_1 = require("@nestjs/common");
const CreateCat_dto_1 = require("../dto/CreateCat.dto");
let CatsService = class CatsService {
    create(createCatRequest) {
        const cat = new CreateCat_dto_1.CreateCatResponse();
        console.log(typeof createCatRequest.age);
        const data = createCatRequest.age;
        console.log(data);
        console.log(typeof data);
        cat.age = createCatRequest.age;
        cat.name = createCatRequest.name;
        return cat;
    }
    findAll() {
        return `This action returns all cats`;
    }
    findOne(id) {
        return 1;
    }
};
CatsService = __decorate([
    common_1.Injectable()
], CatsService);
exports.CatsService = CatsService;
//# sourceMappingURL=cats.service.js.map