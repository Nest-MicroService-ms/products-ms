import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

/*
* Link
* - https://docs.nestjs.com/microservices/basics
* - https://www.proofpoint.com/es/threat-reference/osi-model
* - https://docs.nestjs.com/recipes/prisma
* - https://nats.io/
* - https://hub.docker.com/_/nats
* - - docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats:lates
* - - http://localhost:8222/
* Instalar Packege
* - npm i --save @nestjs/microservices
* - npm install prisma --save-dev
* - npx prisma init (Editar archivo .env)
* - NOTA : Modificar "prisma/schema.prima" segun el modelo de la bdd, una vez realizado ejecuta
* el siguiente comando para realizar la migracion 
* - npx prisma migrate dev --name init | npx prisma migrate dev --name updateChange
* - npm install @prisma/client
* - npx prisma generate (genera el cliente de prisma - reintalar project)
*  - npm i --save nats

*/

async function bootstrap() {
  
  const logger = new Logger('ProductMs');


  

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport : Transport.NATS,
      options : {
        servers : envs.NATS_SERVERS //['nats://localhost:4222']
      } 
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );



  await app.listen();

  //Configuracion de MS  hibrida entre  API RES FULL y MS
  //await app.startAllMicroservices();

  logger.log(`Server Running On Port ${ envs.PORT }`);
}
bootstrap();
