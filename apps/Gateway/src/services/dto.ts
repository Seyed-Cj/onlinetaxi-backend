export class ServiceClientOutputDto<ContextDto> {
  context: ContextDto | undefined;
  status: 'SUCCEED' | 'FAILED' | null | undefined;
  code: number | null | undefined;
  message?: string | null;
  error?: string | null;
  data?: any;
}