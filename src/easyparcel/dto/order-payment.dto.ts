interface OrderPaymentBulk {
  order_no: string;
}

export class OrderPaymentDto {
  // Required data
  bulk: OrderPaymentBulk[];
}
