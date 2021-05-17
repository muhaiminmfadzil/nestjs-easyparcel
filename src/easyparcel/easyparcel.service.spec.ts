require('dotenv').config();
import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EasyparcelService } from './easyparcel.service';

const { APIKEY } = process.env;

xdescribe('Easyparcel Wrong API key', () => {
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

xdescribe('Easyparcel Service', () => {
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
      });
      // Api call success
      expect(rate.api_status).toBe('Success');
      // Return result
      expect(rate).toHaveProperty('result');
    });
  });
});
