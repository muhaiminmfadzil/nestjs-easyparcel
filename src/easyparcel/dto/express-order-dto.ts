import { MakeOrderBulk } from './make-order.dto';

interface ExpressOrderBulk
  extends Omit<
    MakeOrderBulk,
    'service_id' | 'reference' | 'hs_code' | 'REQ_ID'
  > {
  reference: string;
}

export class ExpressOrderDto {
  courier: string[];
  dropoff: number;
  bulk: ExpressOrderBulk[];
}
