import { HttpStatus, Injectable, Logger,OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/paginationDto';



@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit  {

  private readonly logger = new Logger('ProductService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected')
  }


  create(createProductDto: CreateProductDto) {
    
    //Herreda product del modelo de Prisna (prisma/schema.prisma) 
    return this.product.create( { data : createProductDto });

  }

  async findAll(paginationDto : PaginationDto) {
   
    const { page, limit } = paginationDto;
    

    const totalPage = await this.product.count({where : {available : true}});

    const lastPage = Math.ceil( totalPage / limit );

    const data = await this.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where : { available : true  }
    });

    const meta = {
      page,
      limit,
      total : totalPage,
      lastPage
    }

    return { data , meta}

  }

  async findOne(id: number) {

    const product = await this.product.findFirst({
      where: { id, available: true }
    });

    if ( !product ) {

      throw new RpcException({
        status  : HttpStatus.BAD_REQUEST,
        message : `Product With Id #${ id } Not Found`,
      });
      
    } 

    return product;

  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    //Quitan el Id, updateProduct => NO tiene Id
    const { id:__, ...updateProduct }= updateProductDto;
   
    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: updateProduct
    });
  }

  async remove(id: number) {
    
    await this.findOne(id);

    //Delete from product where id = id
    //return this.product.delete({where: { id } });

    return this.product.update({
      where: { id },
      data: {available : false}
    });
  }

  async validaProducts ( ids : number[] ) {

    //Devuelve todos los ids NO repetidos
    ids = Array.from( new Set( ids ));

    //select * from Prodtc where id in (1,2,3)
    const product = await  this.product.findMany( { where : { id : { in : ids } } });

    if ( product.length !== ids.length ) {
      throw new RpcException({
        status  : HttpStatus.BAD_REQUEST,
        message : `Some Products Not Found`,
      });
    }

    return product;

  }  


}
