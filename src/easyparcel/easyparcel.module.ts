import { DynamicModule, HttpModule, Module } from '@nestjs/common';
import { CONFIG_OPTIONS, EasyparcelOptions } from './easyparcel.definition';
import { EasyparcelService } from './easyparcel.service';

@Module({})
export class EasyparcelModule {
  static forRoot(options: EasyparcelOptions): DynamicModule {
    return {
      module: EasyparcelModule,
      imports: [HttpModule],
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        EasyparcelService,
      ],
      exports: [EasyparcelService],
    };
  }
}
