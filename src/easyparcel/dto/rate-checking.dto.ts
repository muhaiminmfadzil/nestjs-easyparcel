export interface RateCheckingBulk {
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
}
export class RateCheckingDto {
  bulk: RateCheckingBulk[];
  exclude_fields?: string[];
}
