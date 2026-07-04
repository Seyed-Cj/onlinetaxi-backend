import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AdminModule } from 'src/rest/admin/admin.module';
import { DriverModule } from 'src/rest/driver/driver.module';
import { PassengerModule } from 'src/rest/passenger/passenger.module';

interface SwaggerModuleItem {
  path: string;
  module?: any;
}

export function setupSwagger(
  app: INestApplication,
  configService: ConfigService,
) {
  const apiVersion = configService.get('App.version');
  const swaggerTitle = configService.get('Swagger.title');
  const swaggerDescription = configService.get('Swagger.Description');
  const swaggerVersion = configService.get('Swagger.Version');

  const swaggerOptions = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setVersion(swaggerVersion)
    .setDescription(swaggerDescription)
    .build();
  const documents = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(`${apiVersion}/docs`, app, documents);

  const modules: SwaggerModuleItem[] = [
    { path: 'admin', module: AdminModule },
    { path: 'driver', module: DriverModule },
    { path: 'passenger', module: PassengerModule },
  ];

  modules.forEach(({ path, module }) => {
    const doc = SwaggerModule.createDocument(app, swaggerOptions, {
      include: [module],
    });
    SwaggerModule.setup(`${apiVersion}/docs/${path}`, app, doc);
  });
}
