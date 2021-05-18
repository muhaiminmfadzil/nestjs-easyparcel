import {
  HttpException,
  HttpService,
  HttpStatus,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { buildMessage } from 'class-validator';
import { CheckOrderStatusDto } from './dto/check-order-status.dto';
import { CheckParcelStatusDto } from './dto/check-parcel-status.dto';
import { MakeOrderDto } from './dto/make-order.dto';
import { OrderPaymentDto } from './dto/order-payment.dto';
import { RateCheckingDto } from './dto/rate-checking.dto';
import { TrackingParcelDto } from './dto/tracking-parcel.dto';
import {
  CONFIG_OPTIONS,
  EasyparcelOptions,
  HttpMethod,
} from './easyparcel.definition';

@Injectable()
export class EasyparcelService {
  // Api endpoint
  private readonly demoUrl = 'https://demo.connect.easyparcel.my/?ac=';
  private readonly liveUrl = 'https://connect.easyparcel.my/?ac=';

  private sandbox: boolean;
  private apiKey: string;
  private logService?: LoggerService;
  private baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(CONFIG_OPTIONS) options: EasyparcelOptions,
  ) {
    this.apiKey = options.apiKey;
    this.sandbox = options.sandbox || false;
    this.apiKey = options.apiKey;
    this.logService = options.logger;
    this.setBaseUrl();
  }

  private setBaseUrl() {
    if (this.sandbox === false) {
      this.baseUrl = this.liveUrl;
    } else {
      this.baseUrl = this.demoUrl;
    }
  }

  private getUrl(action: string) {
    return `${this.baseUrl}${action}`;
  }

  private getApiCaller(httpMethod: HttpMethod, action: string) {
    const url = this.getUrl(action);

    const handleResponse = (response) => {
      return response.data;
    };

    const handlerError = (error) => {
      throw error;
    };

    if (httpMethod === HttpMethod.GET) {
      return (options = {}) => {
        return this.httpService
          .get(url, { ...options })
          .toPromise()
          .then(handleResponse)
          .catch(handlerError);
      };
    }

    if (httpMethod === HttpMethod.DELETE) {
      return (data = {}, options = {}) => {
        return this.httpService
          .delete(url, { ...options })
          .toPromise()
          .then(handleResponse)
          .catch(handlerError);
      };
    }

    if (httpMethod === HttpMethod.POST) {
      return (data = {}, options = {}) => {
        return this.httpService
          .post(url, { api: this.apiKey, ...data }, { ...options })
          .toPromise()
          .then(handleResponse)
          .catch(handlerError);
      };
    }

    if (httpMethod === HttpMethod.PUT) {
      return (data = {}, options = {}) => {
        return this.httpService
          .put(url, { api: this.apiKey, ...data }, { ...options })
          .toPromise()
          .then(handleResponse)
          .catch(handlerError);
      };
    }

    if (httpMethod === HttpMethod.PATCH) {
      return (data = {}, options = {}) => {
        return this.httpService
          .patch(url, { api: this.apiKey, ...data }, { ...options })
          .toPromise()
          .then(handleResponse)
          .catch(handlerError);
      };
    }
  }

  async getRate(data: RateCheckingDto) {
    const api = this.getApiCaller(HttpMethod.POST, 'EPRateCheckingBulk');
    const bulk = { ...data };
    delete bulk.exclude_fields;
    const exclude_fields = data.exclude_fields;
    return await api({ bulk: [bulk], exclude_fields: [exclude_fields] });
  }

  async makeOrder(data: MakeOrderDto) {
    const api = this.getApiCaller(HttpMethod.POST, 'EPSubmitOrderBulk');
    return await api({ bulk: [data] });
  }

  async orderPayment(data: OrderPaymentDto) {
    const api = this.getApiCaller(HttpMethod.POST, 'EPPayOrderBulk');
    return await api({ bulk: [data] });
  }

  async checkOrderStatus(data: CheckOrderStatusDto) {
    const api = this.getApiCaller(HttpMethod.POST, 'EPOrderStatusBulk');
    return await api({ bulk: [data] });
  }

  async checkParcelStatus(data: CheckParcelStatusDto) {
    const api = this.getApiCaller(HttpMethod.POST, 'EPParcelStatusBulk');
    return await api({ bulk: [data] });
  }

  async trackParcel(data: TrackingParcelDto) {
    const api = this.getApiCaller(HttpMethod.POST, 'EPTrackingBulk');
    return await api({ bulk: [data] });
  }

  async checkCredit() {
    const api = this.getApiCaller(HttpMethod.POST, 'EPCheckCreditBalance');
    return await api();
  }
}
