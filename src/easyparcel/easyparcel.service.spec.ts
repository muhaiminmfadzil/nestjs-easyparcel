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
    it('should return rate with success api status', async () => {
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

  describe('Make and pay order, check order and parcel status', () => {
    let orderNo: string;

    // Make order test
    it('should return order with success api status', async () => {
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

    // Order payment test
    it('should return payment order with success api status', async () => {
      const payment = await service.orderPayment({
        order_no: orderNo,
      });
      // Api call success
      expect(payment.api_status).toBe('Success');
      // Return result
      expect(payment).toHaveProperty('result');
      expect(payment.result[0].orderno).toBe(orderNo);
    });

    // Check order status test
    it('should return order status with success api status', async () => {
      const orderStatus = await service.checkOrderStatus({
        order_no: orderNo,
      });
      // Api call success
      expect(orderStatus.api_status).toBe('Success');
      // Return result
      expect(orderStatus).toHaveProperty('result');
      expect(orderStatus.result[0].order_no).toBe(orderNo);
    });

    // Check parcel status test
    it('should return parcel status with success api status', async () => {
      const parcelStatus = await service.checkParcelStatus({
        order_no: orderNo,
      });
      // Api call success
      expect(parcelStatus.api_status).toBe('Success');
      // Return result
      expect(parcelStatus).toHaveProperty('result');
      expect(parcelStatus.result[0].order_no).toBe(orderNo);
    });
  });

  describe('Tracking parcel details', () => {
    it('should return tracking parcel details with success api status', async () => {
      const fakeAwb = '238725129086';
      const trackParcel = await service.trackParcel({
        awb_no: fakeAwb,
      });
      // Api call success
      expect(trackParcel.api_status).toBe('Success');
      // Return result
      expect(trackParcel).toHaveProperty('result');
      expect(trackParcel.result[0].awb).toBe(fakeAwb);
    });
  });

  describe('Check credit', () => {
    it('should return credit details with success api status', async () => {
      const credit = await service.checkCredit();
      // Api call success
      expect(credit.api_status).toBe('Success');
      // Return result
      expect(credit).toHaveProperty('wallet');
    });
  });
});
