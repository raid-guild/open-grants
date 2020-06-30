import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Param } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UserModule } from './server/user/user.module';
import { AuthModule } from './server/auth/auth.module';
import { GrantModule } from './server/grant/grant.module';
import { GrantFundModule } from './server/funding/grantFund.module';

const Path = require('path');


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('Grants Platform API docs')
    .setDescription('The Grants API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const userDocument = SwaggerModule.createDocument(app, options, {
    include: [UserModule, AuthModule, GrantModule, GrantFundModule],
  });
  SwaggerModule.setup('api/v1', app, userDocument);

  // const imagesRoot = Path.join(__dirname, '..', 'uploads');
  // app.use('/files', express.static(imagesRoot));

  // app.useGlobalGuards(new Guard());

  let port = process.env.PORT || 7001;
  await app.listen(port);
  console.log("Server running on port", port);


}


bootstrap();
