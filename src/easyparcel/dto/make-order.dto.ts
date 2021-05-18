import { OmitType } from '@nestjs/mapped-types';
import { RateCheckingDto } from './rate-checking.dto';

export class MakeOrderDto extends OmitType(RateCheckingDto, [
  'date_coll',
  'exclude_fields',
] as const) {
  // Required data
  content: string;
  value: number;
  service_id: string;
  pick_point: string = '';
  pick_name: string;
  pick_contact: string;
  pick_addr1: string;
  pick_city: string;
  send_point: string = '';
  send_name: string;
  send_contact: string;
  send_addr1: string;
  send_city: string;
  sms: boolean = false;
  collect_date: string = '';
  send_email: string;
  // Optional data
  pick_company?: string;
  pick_mobile?: string;
  pick_addr2?: string;
  pick_addr3?: string;
  pick_addr4?: string;
  send_company?: string;
  send_mobile?: string;
  send_addr2?: string;
  send_addr3?: string;
  send_addr4?: string;
  hs_code?: string;
  REQ_ID?: string;
  reference?: string;
}
