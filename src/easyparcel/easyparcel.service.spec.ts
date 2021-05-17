import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EasyparcelService } from './easyparcel.service';

describe('Easyparcel Service', () => {
  let service: EasyparcelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EasyparcelService,
          useValue: new EasyparcelService(null, {
            apiKey: 'EP-nGHBeBdiV',
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
});
