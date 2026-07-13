import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AdminModule } from 'src/rest/admin/admin.module';
import { DriverModule } from 'src/rest/driver/driver.module';
import { PassengerModule } from 'src/rest/passenger/passenger.module';

interface SwaggerModuleItem {
  path: string;
  module?: any;
  bearer?: boolean;
}

export function setupSwagger(
  app: INestApplication,
  configService: ConfigService,
) {
  const apiVersion = configService.get('App.version');
  const swaggerTitle = configService.get('Swagger.Title');
  const swaggerDescription = configService.get('Swagger.Description');
  const swaggerVersion = configService.get('Swagger.Version');

  const swaggerOptions = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setVersion(swaggerVersion)
    .setDescription(swaggerDescription)
    .build();
  const documents = SwaggerModule.createDocument(app, swaggerOptions, {
    include: [AdminModule],
  });
  SwaggerModule.setup(`${apiVersion}/docs`, app, documents);

  const modules: SwaggerModuleItem[] = [
    { path: 'admin', module: AdminModule, bearer: false },
    { path: 'driver', module: DriverModule, bearer: true },
    { path: 'passenger', module: PassengerModule, bearer: true },
  ];

  modules.forEach(({ path, module, bearer }) => {
    let optionBuilder = new DocumentBuilder()
      .setTitle(`${swaggerTitle} - ${path}`)
      .setDescription(swaggerDescription)
      .setVersion(swaggerVersion)
    
    if(bearer) {
      optionBuilder = optionBuilder.addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'Authorization'
      )
    }

    const options = optionBuilder.build()
    const doc = SwaggerModule.createDocument(app, options, { include: [module] })
    SwaggerModule.setup(`${apiVersion}/docs/${path}`, app, doc);
  });
}
