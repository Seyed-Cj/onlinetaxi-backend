export class ServiceClientOutputDto<ContextDto> {
  context!: ContextDto;
  status!: 'SUCCEED' | 'FAILED' | null;
  code!: number | null;
  message?: string | null;
  error?: string | null;
  data?: any;
}