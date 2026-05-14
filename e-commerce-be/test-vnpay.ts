import { VNPay, ProductCode } from 'vnpay';
import * as dotenv from 'dotenv';
dotenv.config();

const vnpay = new VNPay({
    tmnCode: process.env.VNPAY_TMN_CODE || '',
    secureSecret: process.env.VNPAY_HASH_SECRET || '',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true,
});

const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Amount: 100000,
    vnp_IpAddr: '1.1.1.1',
    vnp_TxnRef: '123456',
    vnp_OrderInfo: 'Thanh toan don hang ORD-1234',
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: 'http://localhost:3000/payment/result',
});

console.log(paymentUrl);
