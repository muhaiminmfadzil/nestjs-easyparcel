import { LoggerService } from '@nestjs/common';

export const CONFIG_OPTIONS = 'EASYPARCEL_CONFIG_OPTIONS';

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

export interface EasyparcelOptions {
  apiKey: string;
  sandbox: boolean;
  logger?: LoggerService;
}
