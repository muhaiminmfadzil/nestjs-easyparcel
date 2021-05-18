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
      bulk: [
        {
          pick_code: '55100',
          pick_state: 'kul',
          pick_country: 'MY',
          send_code: '11900',
          send_state: 'png',
          send_country: 'MY',
          weight: 1,
        },
      ],
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
    // Single rate checking
    it('should return single rate with success api status', async () => {
      const rate = await service.getRate({
        bulk: [
          {
            pick_code: '55100',
            pick_state: 'kul',
            pick_country: 'MY',
            send_code: '11900',
            send_state: 'png',
            send_country: 'MY',
            weight: 1,
          },
        ],
      });
      // Api call success
      expect(rate.api_status).toBe('Success');
      // Return result
      expect(rate).toHaveProperty('result');
      expect(rate.result).toHaveLength(1);
      expect(rate.result[0].status).toBe('Success');
    });

    // Multiple rate checking
    it('should return multiple rates with success api status', async () => {
      // Set timeout overriding default timeout
      jest.setTimeout(30000);

      const rate = await service.getRate({
        bulk: [
          {
            pick_code: '55100',
            pick_state: 'kul',
            pick_country: 'MY',
            send_code: '11900',
            send_state: 'png',
            send_country: 'MY',
            weight: 1,
          },
          {
            pick_code: '55100',
            pick_state: 'kul',
            pick_country: 'MY',
            send_code: '08000',
            send_state: 'kdh',
            send_country: 'MY',
            weight: 1,
          },
          {
            pick_code: '55100',
            pick_state: 'kul',
            pick_country: 'MY',
            send_code: '02500',
            send_state: 'pls',
            send_country: 'MY',
            weight: 1,
          },
        ],
      });
      // Api call success
      expect(rate.api_status).toBe('Success');
      // Return result
      expect(rate).toHaveProperty('result');
      expect(rate.result).toHaveLength(3);
      expect(rate.result[0].status).toBe('Success');
      expect(rate.result[1].status).toBe('Success');
      expect(rate.result[2].status).toBe('Success');
    });
  });

  describe('Make & pay order, check order and parcel status for single item', () => {
    let orderNo: string;

    // Make order test
    it('should return single order with success api status', async () => {
      const order = await service.makeOrder({
        bulk: [
          {
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
          },
        ],
      });
      // Api call success
      expect(order.api_status).toBe('Success');
      // Return result
      expect(order).toHaveProperty('result');
      expect(order.result).toHaveLength(1);
      expect(order.result[0].status).toBe('Success');
      // Save order no
      orderNo = order.result[0].order_number;
    });

    // Order payment test
    it('should return single payment order with success api status', async () => {
      const payment = await service.orderPayment({
        bulk: [
          {
            order_no: orderNo,
          },
        ],
      });
      // Api call success
      expect(payment.api_status).toBe('Success');
      // Return result
      expect(payment).toHaveProperty('result');
      expect(payment.result).toHaveLength(1);
      expect(payment.result[0].orderno).toBe(orderNo);
    });

    // Check order status test
    it('should return single order status with success api status', async () => {
      const orderStatus = await service.checkOrderStatus({
        bulk: [
          {
            order_no: orderNo,
          },
        ],
      });
      // Api call success
      expect(orderStatus.api_status).toBe('Success');
      // Return result
      expect(orderStatus).toHaveProperty('result');
      expect(orderStatus.result).toHaveLength(1);
      expect(orderStatus.result[0].order_no).toBe(orderNo);
    });

    // Check parcel status test
    it('should return single parcel status with success api status', async () => {
      const parcelStatus = await service.checkParcelStatus({
        bulk: [
          {
            order_no: orderNo,
          },
        ],
      });
      // Api call success
      expect(parcelStatus.api_status).toBe('Success');
      // Return result
      expect(parcelStatus).toHaveProperty('result');
      expect(parcelStatus.result).toHaveLength(1);
      expect(parcelStatus.result[0].order_no).toBe(orderNo);
    });
  });

  describe('Make & pay order, check order and parcel status for multiple items', () => {
    let orderNo: string[] = [];

    // Set timeout overriding default timeout
    jest.setTimeout(30000);

    // Make order test
    it('should return multiple order with success api status', async () => {
      const order = await service.makeOrder({
        bulk: [
          {
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
          },
          {
            content: 'Baju',
            value: 10,
            weight: 1,
            service_id: 'EP-CS023',
            pick_point: '',
            pick_name: 'Min',
            pick_contact: '0123456789',
            pick_addr1: 'Hello world',
            pick_code: '09000',
            pick_city: 'Kulim',
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
          },
          {
            content: 'Baju',
            value: 10,
            weight: 1,
            service_id: 'EP-CS023',
            pick_point: '',
            pick_name: 'Min',
            pick_contact: '0123456789',
            pick_addr1: 'Hello world',
            pick_code: '11900',
            pick_city: 'Bayan Lepas',
            pick_state: 'png',
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
          },
        ],
      });
      // Api call success
      expect(order.api_status).toBe('Success');
      // Return result
      expect(order).toHaveProperty('result');
      expect(order.result).toHaveLength(3);
      expect(order.result[0].status).toBe('Success');
      expect(order.result[1].status).toBe('Success');
      expect(order.result[2].status).toBe('Success');
      // Save order no
      order.result.forEach((item) => {
        orderNo.push(item.order_number);
      });
    });

    // Order payment test
    it('should return multiple payment order with success api status', async () => {
      const payment = await service.orderPayment({
        bulk: [
          {
            order_no: orderNo[0],
          },
          {
            order_no: orderNo[1],
          },
          {
            order_no: orderNo[2],
          },
        ],
      });
      // Api call success
      expect(payment.api_status).toBe('Success');
      // Return result
      expect(payment).toHaveProperty('result');
      expect(payment.result).toHaveLength(3);
      expect(payment.result[0].orderno).toBe(orderNo[0]);
      expect(payment.result[1].orderno).toBe(orderNo[1]);
      expect(payment.result[2].orderno).toBe(orderNo[2]);
    });

    // Check order status test
    it('should return multiple order status with success api status', async () => {
      const orderStatus = await service.checkOrderStatus({
        bulk: [
          {
            order_no: orderNo[0],
          },
          {
            order_no: orderNo[1],
          },
          {
            order_no: orderNo[2],
          },
        ],
      });
      // Api call success
      expect(orderStatus.api_status).toBe('Success');
      // Return result
      expect(orderStatus).toHaveProperty('result');
      expect(orderStatus.result).toHaveLength(3);
      expect(orderStatus.result[0].order_no).toBe(orderNo[0]);
      expect(orderStatus.result[1].order_no).toBe(orderNo[1]);
      expect(orderStatus.result[2].order_no).toBe(orderNo[2]);
    });

    // Check parcel status test
    it('should return multiple parcel status with success api status', async () => {
      const parcelStatus = await service.checkParcelStatus({
        bulk: [
          {
            order_no: orderNo[0],
          },
          {
            order_no: orderNo[1],
          },
          {
            order_no: orderNo[2],
          },
        ],
      });
      // Api call success
      expect(parcelStatus.api_status).toBe('Success');
      // Return result
      expect(parcelStatus).toHaveProperty('result');
      expect(parcelStatus.result).toHaveLength(3);
      expect(parcelStatus.result[0].order_no).toBe(orderNo[0]);
      expect(parcelStatus.result[1].order_no).toBe(orderNo[1]);
      expect(parcelStatus.result[2].order_no).toBe(orderNo[2]);
    });
  });

  describe('Tracking parcel details', () => {
    it('should return single tracking parcel details with success api status', async () => {
      const fakeAwb = '238725129086';
      const trackParcel = await service.trackParcel({
        bulk: [
          {
            awb_no: fakeAwb,
          },
        ],
      });
      // Api call success
      expect(trackParcel.api_status).toBe('Success');
      // Return result
      expect(trackParcel).toHaveProperty('result');
      expect(trackParcel.result).toHaveLength(1);
      expect(trackParcel.result[0].awb).toBe(fakeAwb);
    });

    it('should return multiple tracking parcel details with success api status', async () => {
      const fakeAwb = ['238725129086', '238725129087', '238725129088'];
      const trackParcel = await service.trackParcel({
        bulk: [
          {
            awb_no: fakeAwb[0],
          },
          {
            awb_no: fakeAwb[1],
          },
          {
            awb_no: fakeAwb[2],
          },
        ],
      });
      // Api call success
      expect(trackParcel.api_status).toBe('Success');
      // Return result
      expect(trackParcel).toHaveProperty('result');
      expect(trackParcel.result).toHaveLength(3);
      expect(trackParcel.result[0].awb).toBe(fakeAwb[0]);
      expect(trackParcel.result[1].awb).toBe(fakeAwb[1]);
      expect(trackParcel.result[2].awb).toBe(fakeAwb[2]);
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

  describe('Express order', () => {
    // Set timeout overriding default timeout
    jest.setTimeout(30000);

    it('should return single express order details with success api status', async () => {
      const expressOrder = await service.expressOrder({
        bulk: [
          {
            content: 'Baju',
            value: 10,
            weight: 1,
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
            reference: 'Testing',
          },
        ],
        courier: ['Poslaju'],
        dropoff: 1,
      });
      // Api call success
      expect(expressOrder.api_status).toBe('Success');
      // Return result
      expect(expressOrder).toHaveProperty('result');
      expect(expressOrder).toHaveProperty('result.summary');
      expect(expressOrder).toHaveProperty('result.success');
      expect(expressOrder).toHaveProperty('result.fail');
    });

    it('should return multiple express order details with success api status', async () => {
      const expressOrder = await service.expressOrder({
        bulk: [
          {
            content: 'Baju',
            value: 10,
            weight: 1,
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
            reference: 'Testing',
          },
          {
            content: 'Baju',
            value: 10,
            weight: 1,
            pick_point: '',
            pick_name: 'Min',
            pick_contact: '0123456789',
            pick_addr1: 'Hello world',
            pick_code: '09000',
            pick_city: 'Kulim',
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
            reference: 'Testing',
          },
          {
            content: 'Baju',
            value: 10,
            weight: 1,
            pick_point: '',
            pick_name: 'Min',
            pick_contact: '0123456789',
            pick_addr1: 'Hello world',
            pick_code: '11900',
            pick_city: 'Bayan Lepas',
            pick_state: 'png',
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
            reference: 'Testing',
          },
        ],
        courier: ['Poslaju'],
        dropoff: 1,
      });
      // Api call success
      expect(expressOrder.api_status).toBe('Success');
      // Return result
      expect(expressOrder).toHaveProperty('result');
      expect(expressOrder).toHaveProperty('result.summary');
      expect(expressOrder).toHaveProperty('result.success');
      expect(expressOrder).toHaveProperty('result.fail');
    });
  });
});
