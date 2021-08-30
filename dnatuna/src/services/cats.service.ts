import { Injectable } from '@nestjs/common';
import { CreateCatRequest, CreateCatResponse } from '../dto/CreateCat.dto';

@Injectable()
export class CatsService {
  create(createCatRequest: CreateCatRequest): CreateCatResponse {
    const cat = new CreateCatResponse();
    console.log(typeof createCatRequest.age);
    const data: number = createCatRequest.age;
    console.log(data);
    console.log(typeof data);
    cat.age = createCatRequest.age;
    cat.name = createCatRequest.name;
    return cat;
  }

  findAll() {
    return `This action returns all cats`;
  }

  findOne(id: number) {
    return 1;
  }
}
