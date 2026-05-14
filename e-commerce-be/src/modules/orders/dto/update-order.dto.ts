export class UpdateOrderDto {
  orderNo?: string;
  customerId?: number;
  addressId?: number;
  status?: string;
  discount?: number;
  totalAmount?: number;
  note?: string;
  // Payment
  paymentMethod?: 'COD' | 'VNPAY';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'cancelled';
  txnRef?: string; // VNPay transaction reference
}


