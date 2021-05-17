import {
  HttpException,
  HttpService,
  HttpStatus,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import {
  CONFIG_OPTIONS,
  EasyparcelOptions,
  HttpMethod,
} from './easyparcel.definition';

@Injectable()
export class EasyparcelService {
  private sandbox: boolean;
  private apiKey: string;
  private logService?: LoggerService;
  private baseUrl: string;
  private demoUrl: string;
  private liveUrl: string;

  constructor(
    private httpService: HttpService,
    @Inject(CONFIG_OPTIONS) options: EasyparcelOptions,
  ) {
    this.apiKey = options.apiKey;
    this.sandbox = options.sandbox || false;
    this.apiKey = options.apiKey;
    this.logService = options.logger;
    this.demoUrl = 'https://demo.connect.easyparcel.my/?ac=';
    this.liveUrl = 'https://connect.easyparcel.my/?ac=';
    this.setBaseUrl();
  }

  private greeting() {
    return 'Hello World API wrapper';
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

  listAll() {
    return `
    ${this.apiKey}
    ${this.sandbox}
    ${this.demoUrl}
    ${this.liveUrl}
    ${this.baseUrl}
    `;
  }

  private getApiCaller(httpMethod: HttpMethod, action: string) {
    const url = this.getUrl(action);

    const handleResponse = (response) => {
      const data = response.data;
      if (data.api_status !== 'Success') {
        throw new HttpException(data.error_remark, HttpStatus.BAD_REQUEST);
      }
      return data;
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
      return (options = {}) => {
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
          .post(url, data, { ...options })
          .toPromise()
          .then(handleResponse)
          .catch(handlerError);
      };
    }

    if (httpMethod === HttpMethod.PUT) {
      return (data = {}, options = {}) => {
        return this.httpService
          .put(url, data, { ...options })
          .toPromise()
          .then(handleResponse)
          .catch(handlerError);
      };
    }

    if (httpMethod === HttpMethod.PATCH) {
      return (data = {}, options = {}) => {
        return this.httpService
          .patch(url, data, { ...options })
          .toPromise()
          .then(handleResponse)
          .catch(handlerError);
      };
    }
  }
}
