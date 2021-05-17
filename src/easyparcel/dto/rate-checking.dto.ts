// https://developers.easyparcel.com/?pg=DocAPI&c=Malaysia&type=Individual#nav_Individual_EPRateCheckingBulk

export class RateCheckingDto {
  // Required data
  pick_code: string;
  pick_state: string;
  pick_country: string;
  send_code: string;
  send_state: string;
  send_country: string;
  weight: number;
  // Optional data
  width?: number;
  length?: number;
  height?: number;
  date_coll?: Date;
  exclude_fields?: string[];
}
