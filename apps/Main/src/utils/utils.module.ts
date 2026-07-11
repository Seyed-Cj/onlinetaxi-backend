import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtHandler } from './handlers/jwt.handler';
import { UtilsService } from './utils.service';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [UtilsService ,JwtHandler],
  exports: [UtilsService ,JwtHandler],
})
export class UtilsModule {}
