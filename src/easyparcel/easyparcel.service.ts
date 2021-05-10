import { HttpService, Inject, Injectable, LoggerService } from '@nestjs/common';
import { CONFIG_OPTIONS, EasyparcelOptions } from './easyparcel.definition';

@Injectable()
export class EasyparcelService {
  sandbox: boolean;
  private apiKey: string;
  private logService?: LoggerService;
  private demoUrl: 'https://demo.connect.easyparcel.my/?ac=';
  private liveUrl: 'https://connect.easyparcel.my/?ac=';
  private baseUrl: string;

  constructor(
    private httpService: HttpService,
    @Inject(CONFIG_OPTIONS) options: EasyparcelOptions,
  ) {
    this.apiKey = options.apiKey;
    this.sandbox = options.sandbox || false;
    this.apiKey = options.apiKey;
    this.logService = options.logger;
    this.setBaseUrl();
  }

  setBaseUrl() {
    if (this.sandbox === false) {
      this.baseUrl = this.liveUrl;
    } else {
      this.baseUrl = this.demoUrl;
    }
  }
}
