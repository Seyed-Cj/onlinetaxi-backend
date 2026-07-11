import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        if (req.method === 'POST' && res.statusCode === HttpStatus.CREATED)
          res.status(HttpStatus.OK);
        return {
          code: res.statusCode,
          status: 'SUCCEED',
          message: 'Here you go!',
          error: null,
          data
        };
      }),
    );
  }
}
