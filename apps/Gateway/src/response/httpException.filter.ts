import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ServiceClientOutputDto } from 'src/services/dto';

export function throwHttpErr(errorData: ServiceClientOutputDto<any>) {
  throw new HttpException(
    errorData?.error || errorData?.message || 'err_service_failed',
    errorData?.code || HttpStatus.FAILED_DEPENDENCY,
  );
}

export function handleServCliResonse(data: ServiceClientOutputDto<any>) {
  if (data?.status != 'SUCCEED') throwHttpErr(data);
  return data.data;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const error: any = exception.getResponse();

    let errorMessage = error.error || error.message || exception.name || null;
    let errorDescription = error.message || exception.message || null;

    response.status(exception.getStatus()).send({
      code: exception.getStatus(),
      status: 'FAILED',
      message: errorMessage,
      error: Array.isArray(errorDescription)
        ? errorDescription
        : [errorDescription],
      data: error.data || null,
    });
  }
}
