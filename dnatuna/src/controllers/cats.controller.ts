import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCatRequest } from '../dto/CreateCat.dto';
import { CatsService } from '../services/cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  create(@Body() createCatRequest: CreateCatRequest) {
    console.log(typeof createCatRequest.age);
    return this.catsService.create(createCatRequest);
  }

  @Get()
  findAll() {
    return this.catsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catsService.findOne(+id);
  }
}
