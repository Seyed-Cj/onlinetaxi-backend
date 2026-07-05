import { HttpStatus } from '@nestjs/common';

export class ServiceClientContextDto {
  query?: string;
  set?: string;
  options?: string;
}

export class ServiceClientActionInputDto extends ServiceClientContextDto {
  provider!: string;
  action!: string;
}

export class ServiceClientEventInputDto extends ServiceClientContextDto {
  provider!: string;
  event!: string;
}

export class ServiceClientOutputDto<ContextDto> {
  context!: ContextDto;
  status!: 'SUCCEED' | 'FAILED' | null;
  code!: number | null;
  message?: string | null;
  error?: string | null;
  data?: any;
}

export class ServiceResponseData {
  message?: string;
  data?: any;
}

export class SrvErr extends Error {
  readonly code!: HttpStatus;
  constructor(
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    error: string,
  ) {
    super(error);
    this.code = status;
  }
}
