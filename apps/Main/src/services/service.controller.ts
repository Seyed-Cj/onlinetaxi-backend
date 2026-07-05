import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SelfActionService } from './actions.service';
import { SelfEventService } from './events.service';
import { ServiceClientActionInputDto, ServiceClientOutputDto } from './dto';

@Controller()
export class ServiceController {
  constructor(
    private readonly actions: SelfActionService,
    // private readonly events: SelfEventService,
  ) {}

  @MessagePattern('callAction')
  async CallTestMessage(
    data: ServiceClientActionInputDto,
  ): Promise<ServiceClientOutputDto<ServiceClientActionInputDto>> {
    try {
      const res = await this.actions.findAndCall(data);
      return {
        context: data,
        status: 'SUCCEED',
        code: 200,
        message: res?.message || 'Ok',
        error: null,
        data: res?.data || null,
      };
    } catch (e: any) {
      return {
        context: data,
        status: 'FAILED',
        code: e?.code || HttpStatus.INTERNAL_SERVER_ERROR,
        message: e?.msg || null,
        error: e.message || 'err_services_failedToResolve',
        data: null,
      };
    }
  }
}
