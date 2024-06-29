import { Controller, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/paginationDto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //@Post()
  @MessagePattern({ cmd : 'createProduct'})
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

 // @Get()
  @MessagePattern({ cmd : 'getAllProducts'})
  findAll(@Payload() paginationDto:PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  //@Get(':id')
  @MessagePattern({ cmd : 'getProductById'})
  findOne(@Payload('id',ParseIntPipe) id:number) {

    return this.productsService.findOne(id);
  }
  //@Patch(':id')
  @MessagePattern({cmd : 'updateProduct'})
  async update(@Payload() updateProductDto: UpdateProductDto) {
    
    return await this.productsService.update(updateProductDto.id, updateProductDto);
  }

  //@Delete(':id')
  @MessagePattern( { cmd: 'deleteProduct'})
  async remove(@Payload('id',ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
