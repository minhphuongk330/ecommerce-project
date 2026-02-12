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
      .map((item) => {
        const selectedVariant = (item.product as any)?.variants?.find(
          (v: any) => Number(v.id) === Number(item.variantId),
        );

        const details: string[] = [];
        if (selectedVariant) details.push(selectedVariant.sku);
        if (item.colorId) details.push(item.colorId);

        const detailHtml =
          details.length > 0
            ? `<div style="color: #6b7280; font-size: 13px; margin: 4px 0 0;">${details.join(' • ')}</div>`
            : '';

        const imageSrc =
          item.product.mainImageUrl || 'https://via.placeholder.com/80';

        return `
        <tr>
          <td style="padding: 20px 0; border-bottom: 1px solid #e5e7eb; width: 80px; vertical-align: middle;">
            <img src="${imageSrc}" alt="${item.product.name}" width="80" height="80" style="border-radius: 10px; border: 1px solid #f1f5f9; object-fit: cover; display: block; background: #f8fafc;">
          </td>

          <td style="padding: 20px 16px; border-bottom: 1px solid #e5e7eb; vertical-align: middle;">
            <div style="font-size: 15px; font-weight: 600; color: #0f172a; line-height: 1.4;">${item.product.name}</div>
            ${detailHtml}
            <div style="margin-top: 6px; font-size: 13px; color: #64748b;">Qty: ${item.quantity}</div>
          </td>

          <td style="padding: 20px 0; border-bottom: 1px solid #e5e7eb; text-align: right; vertical-align: middle; white-space: nowrap;">
            <div style="font-size: 15px; font-weight: 600; color: #0f172a;">$${Number(item.unitPrice || item.product.price).toFixed(2)}</div>
          </td>
        </tr>
        `;
      })
      .join('');

    await this.mailerService.sendMail({
      to: order.customer.email,
      subject: `Order Confirmation #${order.orderNo || order.id}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmed</title>
        </head>
        <body style="margin:0; padding:0; background:#f8fafc; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#1e293b; line-height:1.6;">
          <div style="max-width:620px; margin:24px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px -10px rgba(0,0,0,0.08);">

            <!-- Header - Chỉ phần này đổi sang nền đen -->
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding:40px 24px; text-align:center; color:white;">
              <h1 style="margin:0; font-size:28px; font-weight:700; letter-spacing:-0.5px;">Order Confirmed!</h1>
              <p style="margin:12px 0 0; font-size:15px; opacity:0.95;">Order #${order.orderNo || order.id}</p>
            </div>

            <!-- Content - Giữ nguyên nền trắng/sáng -->
            <div style="padding:32px 28px 40px;">

              <p style="margin:0 0 8px; font-size:16px; font-weight:600; color:#0f172a;">Hello ${order.address.receiverName},</p>
              <p style="margin:0 0 32px; font-size:15px; color:#475569;">Thank you for shopping with Cyber Shop! Your order has been confirmed and we're preparing it for shipment.</p>

              <!-- Order Summary -->
              <div style="margin:0 0 32px;">
                <h3 style="margin:0 0 16px; font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#64748b;">Order Summary</h3>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;">
                  <colgroup>
                    <col style="width:80px">
                    <col>
                    <col style="width:110px">
                  </colgroup>
                  ${itemsHtml}
                </table>
              </div>

              <!-- Totals -->
              <div style="margin:0 0 32px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr><td colspan="2" style="height:1px; background:#e2e8f0; margin:16px 0;"></td></tr>
                  <tr>
                    <td style="padding:8px 0; color:#475569; font-size:14px;">Subtotal</td>
                    <td style="padding:8px 0; text-align:right; font-weight:600; color:#0f172a;">$${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; color:#475569; font-size:14px;">Shipping</td>
                    <td style="padding:8px 0; text-align:right; color:#10b981; font-weight:600;">Free</td>
                  </tr>
                  <tr>
                    <td style="padding:16px 0 0; font-size:16px; font-weight:700; color:#0f172a; border-top:2px solid #e2e8f0;">Total</td>
                    <td style="padding:16px 0 0; text-align:right; font-size:20px; font-weight:700; color:#3b82f6; border-top:2px solid #e2e8f0;">$${total.toFixed(2)}</td>
                  </tr>
                </table>
              </div>

              <!-- Shipping Address -->
              <div style="margin:0 0 32px;">
                <h3 style="margin:0 0 16px; font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#64748b;">Shipping Address</h3>
                <div style="font-size:14px; color:#334155; line-height:1.7; background:#f8fafc; padding:20px; border-radius:10px; border:1px solid #e2e8f0;">
                  <strong style="color:#0f172a;">${order.address.receiverName}</strong><br>
                  ${order.address.phone}<br>
                  ${order.address.address}
                </div>
              </div>

              <!-- Next Steps -->
              <div style="text-align:center; margin:32px 0 0; padding:24px 0; background:#f1f5f9; border-radius:12px;">
                <p style="margin:0 0 12px; font-size:15px; color:#475569;">Track your order anytime</p>
                <a href="#" style="display:inline-block; padding:14px 32px; background:#3b82f6; color:white; font-weight:600; text-decoration:none; border-radius:10px; font-size:15px; box-shadow:0 4px 14px rgba(59,130,246,0.25);">Track Order →</a>
              </div>

            </div>

            <!-- Footer -->
            <div style="padding:28px 24px; text-align:center; background:#f9fafb; border-top:1px solid #e5e7eb; color:#6b7280; font-size:13px; line-height:1.6;">
              <p style="margin:0 0 8px;">Cyber Shop © ${new Date().getFullYear()} — All rights reserved.</p>
              <p style="margin:0; opacity:0.9;">Thank you for choosing us!</p>
            </div>

          </div>
        </body>
        </html>
      `,
    });
  }
}
