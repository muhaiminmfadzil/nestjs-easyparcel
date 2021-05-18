import { OmitType } from '@nestjs/mapped-types';
import { MakeOrderDto } from './make-order.dto';

export class ExpressOrderDto extends OmitType(MakeOrderDto, [
  'service_id',
  'reference',
  'hs_code',
  'REQ_ID',
] as const) {
  // Required data
  reference: string;
  courier: string[];
  dropoff: number;
}
