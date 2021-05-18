require('dotenv').config();
import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EasyparcelService } from './easyparcel.service';

const { APIKEY } = process.env;

describe('Easyparcel Wrong API key', () => {
  let service: EasyparcelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EasyparcelService,
          useValue: new EasyparcelService(new HttpService(), {
            apiKey: 'wrong-api-key',
            sandbox: true,
          }),
        },
      ],
    }).compile();

    service = module.get<EasyparcelService>(EasyparcelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return unauthorized user error', async () => {
    const rate = await service.getRate({
      pick_code: '55100',
      pick_state: 'kul',
      pick_country: 'MY',
      send_code: '11900',
      send_state: 'png',
      send_country: 'MY',
      weight: 1,
    });
    // Api call success
    expect(rate.api_status).toBe('Error');
    // Return result
    expect(rate.error_remark).toBe('Unauthorized user');
  });
});

describe('Easyparcel Service', () => {
  let service: EasyparcelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EasyparcelService,
          useValue: new EasyparcelService(new HttpService(), {
            apiKey: APIKEY,
            sandbox: true,
          }),
        },
      ],
    }).compile();

    service = module.get<EasyparcelService>(EasyparcelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get rate', () => {
    it('should return rate with success status', async () => {
      const rate = await service.getRate({
        pick_code: '55100',
        pick_state: 'kul',
        pick_country: 'MY',
        send_code: '11900',
        send_state: 'png',
        send_country: 'MY',
        weight: 1,
        exclude_fields: ['exclude_field'],
      });
      // Api call success
      expect(rate.api_status).toBe('Success');
      // Return result
      expect(rate).toHaveProperty('result');
      expect(rate.result[0].status).toBe('Success');
    });
  });

  describe('Make and pay order', () => {
    let orderNo: string;
    it('should return order with success status', async () => {
      const order = await service.makeOrder({
        content: 'Baju',
        value: 10,
        weight: 1,
        service_id: 'EP-CS023',
        pick_point: '',
        pick_name: 'Min',
        pick_contact: '0123456789',
        pick_addr1: 'Hello world',
        pick_code: '08000',
        pick_city: 'Sungai Petani',
        pick_state: 'kdh',
        pick_country: 'MY',
        send_point: '',
        send_name: 'Mon',
        send_contact: '0123456789',
        send_addr1: 'Hai world',
        send_code: '55100',
        send_city: 'Kuala Lumpur',
        send_state: 'kul',
        send_country: 'MY',
        sms: false,
        collect_date: '',
        send_email: 'helloworld@gmail.com',
      });
      // Api call success
      expect(order.api_status).toBe('Success');
      // Return result
      expect(order).toHaveProperty('result');
      expect(order.result[0].status).toBe('Success');
      // Save order no
      orderNo = order.result[0].order_number;
    });

    it('should return payment order with success status', async () => {
      const payment = await service.orderPayment({
        order_no: orderNo,
      });
      // Api call success
      expect(payment.api_status).toBe('Success');
      // Return result
      expect(payment).toHaveProperty('result');
      expect(payment.result[0].orderno).toBe(orderNo);
    });
  });
});
