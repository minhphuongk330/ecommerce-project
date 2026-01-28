import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Order } from '../../entities/order.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOrderConfirmation(order: Order) {
    const total = Number(order.totalAmount) || 0;
    const subtotal = total;

    const itemsHtml = order.orderItems
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 0; vertical-align: middle;">
                <div style="font-weight: 600; font-size: 14px; color: #1a1a1a;">${item.product.name}</div>
                ${item.colorId ? `<div style="font-size: 12px; color: #888; margin-top: 2px;">Color: ${item.colorId}</div>` : ''}
            </td>
            
            <td style="padding: 12px 10px; vertical-align: middle; text-align: center; color: #555; white-space: nowrap;">
                x${item.quantity}
            </td>
            
            <td style="padding: 12px 0; vertical-align: middle; text-align: right; font-weight: 600; color: #1a1a1a; white-space: nowrap;">
                $${Number(item.unitPrice || item.product.price).toFixed(2)}
            </td>
        </tr>
      `,
      )
      .join('');

    await this.mailerService.sendMail({
      to: order.customer.email,
      subject: `Order Confirmation #${order.orderNo || order.id}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: sans-serif; color: #333; line-height: 1.5; }
                .container { max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #eee; }
                .header { padding: 20px; text-align: center; border-bottom: 1px solid #eee; background: #f9fafb; }
                .content { padding: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Thank You For Your Order!</h2>
                </div>
                <div class="content">
                    <p>Hi <strong>${order.address.receiverName}</strong>,</p>
                    <p>
                        Order ID: <strong>#${order.orderNo || order.id}</strong><br>
                        Date: ${new Date(order.createdAt).toLocaleDateString()}
                    </p>

                    <h3>Items Ordered</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        ${itemsHtml}
                    </table>

                    <table style="width: 100%; background: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px; border-collapse: separate; border-spacing: 0;">
                        <tr>
                            <td style="padding: 5px 0; color: #555;">Subtotal</td>
                            <td style="padding: 5px 0; text-align: right; font-weight: bold; color: #333;">$${subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0; color: #555;">Shipping</td>
                            <td style="padding: 5px 0; text-align: right; color: #333;">Free</td>
                        </tr>
                        <tr>
                            <td style="padding-top: 10px; border-top: 1px solid #ddd; color: #e11d48; font-weight: bold; font-size: 18px;">Total</td>
                            <td style="padding-top: 10px; border-top: 1px solid #ddd; text-align: right; color: #e11d48; font-weight: bold; font-size: 18px;">$${total.toFixed(2)}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </body>
        </html>
      `,
    });
  }
}
