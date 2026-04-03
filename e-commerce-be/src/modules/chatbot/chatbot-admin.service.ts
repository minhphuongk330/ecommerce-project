import { SchemaType, Tool } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { CustomersService } from '../customers/customers.service';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ChatbotAdminService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly adminService: AdminService,
    private readonly customersService: CustomersService,
    private readonly ordersService: OrdersService,
  ) {}

  async getDashboardContext(): Promise<string> {
    try {
      const stats = await this.adminService.getDashboardStats();
      const productsResponse = await this.productsService.findAll();
      const allProducts = productsResponse.items || [];

      return `
        THONG KE QUAN TRI:
        - Doanh thu thang nay: ${stats.monthRevenue.toLocaleString('vi-VN')} VND
        - Doanh thu toan bo: ${stats.totalRevenue.toLocaleString('vi-VN')} VND
        - Don hang hom nay: ${stats.todayOrders}
        - Tong don hang: ${stats.totalOrders}
        - Tong khach hang: ${stats.totalCustomers}
        - San pham ton kho thap (<=10): ${stats.lowStockProducts}

        THONG KE SAN PHAM:
        - Tong so san pham: ${allProducts.length}
        - San pham co san: ${allProducts.filter((p) => p.stock > 0).length}
        - Top 5 san pham:
        ${allProducts
          .slice(0, 5)
          .map(
            (p) => `  - ${p.name} - Gia: ${p.price} VND, Ton kho: ${p.stock}`,
          )
          .join('\n')}
      `;
    } catch {
      return 'Khong the tai du lieu thong ke.';
    }
  }

  getTools(): Tool {
    return {
      functionDeclarations: [
        {
          name: 'searchCustomers',
          description: 'Tim kiem thong tin khach hang theo ten hoac email.',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              query: {
                type: SchemaType.STRING,
                description: 'Ten hoac email cua khach hang can tim',
              },
            },
            required: ['query'],
          } as any,
        },
        {
          name: 'getProductStats',
          description:
            'Lay thong ke chi tiet ve san pham: hang het, sap het hang.',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {},
            required: [],
          } as any,
        },
        {
          name: 'getOrderStats',
          description:
            'Lay thong ke chi tiet ve don hang: so luong, doanh thu theo tuan/thang/nam.',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {},
            required: [],
          } as any,
        },
        {
          name: 'getCustomerDetails',
          description:
            'Lay thong tin chi tiet cua mot khach hang cu the theo ID.',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              customerId: {
                type: SchemaType.NUMBER,
                description: 'ID cua khach hang',
              },
            },
            required: ['customerId'],
          } as any,
        },
      ],
    };
  }

  async executeSearchCustomers(query: string): Promise<string> {
    try {
      const allCustomers = await this.customersService.findAll();
      const searchTerm = query.toLowerCase();
      const results = allCustomers.filter(
        (c) =>
          c.fullName.toLowerCase().includes(searchTerm) ||
          c.email.toLowerCase().includes(searchTerm),
      );

      if (results.length === 0) return 'Khong tim thay khach hang nao phu hop.';

      return results
        .slice(0, 10)
        .map(
          (c) =>
            `- ID: ${c.id}, Ten: ${c.fullName}, Email: ${c.email}, Trang thai: ${c.isActive ? 'Hoat dong' : 'Bi khoa'}, Ngay tao: ${new Date(c.createdAt).toLocaleDateString('vi-VN')}`,
        )
        .join('\n');
    } catch {
      return 'Loi khi tim kiem khach hang.';
    }
  }

  async executeGetProductStats(): Promise<string> {
    try {
      const response = await this.productsService.findAll();
      const products = response.items || [];
      const lowStock = products.filter((p) => p.stock <= 20);
      const outOfStock = products.filter((p) => p.stock === 0);

      let stats = `
        THONG KE SAN PHAM:
        - Tong so san pham: ${products.length}
        - San pham co san: ${products.filter((p) => p.stock > 0).length}
        - San pham het hang: ${outOfStock.length}
        - San pham sap het (<=20): ${lowStock.length}`;

      if (outOfStock.length > 0) {
        stats += `\n\nCANH BAO - San pham het hang:\n${outOfStock
          .slice(0, 5)
          .map((p) => `  - ${p.name} (ID: ${p.id})`)
          .join('\n')}`;
      }
      if (lowStock.length > 0) {
        stats += `\n\nSan pham sap het hang:\n${lowStock
          .slice(0, 10)
          .map((p) => `  - ${p.name} - Ton kho: ${p.stock}`)
          .join('\n')}`;
      }

      return stats;
    } catch {
      return 'Loi khi tai thong ke san pham.';
    }
  }

  async executeGetOrderStats(): Promise<string> {
    try {
      const [monthly, weekly, yearly] = await Promise.all([
        this.adminService.getRevenueByPeriod('monthly'),
        this.adminService.getRevenueByPeriod('weekly'),
        this.adminService.getRevenueByPeriod('yearly'),
      ]);

      const fmt = (n: number) =>
        n >= 0 ? `+${n.toFixed(2)}%` : `${n.toFixed(2)}%`;

      return `
        THONG KE DOANH THU:

        THANG NAY (${monthly.periodLabel}):
        - Doanh thu: ${monthly.revenue.toLocaleString('vi-VN')} VND
        - Don hang: ${monthly.orders}
        - So voi thang truoc: ${fmt(monthly.revenuePercent)}

        TUAN NAY (${weekly.periodLabel}):
        - Doanh thu: ${weekly.revenue.toLocaleString('vi-VN')} VND
        - Don hang: ${weekly.orders}
        - So voi tuan truoc: ${fmt(weekly.revenuePercent)}

        NAM NAY (${yearly.periodLabel}):
        - Doanh thu: ${yearly.revenue.toLocaleString('vi-VN')} VND
        - Don hang: ${yearly.orders}
        - So voi nam truoc: ${fmt(yearly.revenuePercent)}
      `;
    } catch {
      return 'Loi khi tai thong ke doanh thu.';
    }
  }

  async executeGetCustomerDetails(customerId: number): Promise<string> {
    try {
      const customer = await this.customersService.findOne(customerId);
      const orders = await this.ordersService.findByCustomerId(customerId);
      const totalSpent = orders
        .filter((o) => o.status === 'Completed')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      return `
        CHI TIET KHACH HANG:
        - ID: ${customer.id}
        - Ten: ${customer.fullName}
        - Email: ${customer.email}
        - Trang thai: ${customer.isActive ? 'Hoat dong' : 'Bi khoa'}
        - Ngay tao: ${new Date(customer.createdAt).toLocaleDateString('vi-VN')}
        - Tong don hang: ${orders.length}
        - Tong chi tieu: ${totalSpent.toLocaleString('vi-VN')} VND
        - Don hang gan nhat: ${orders.length > 0 ? `Ma #${orders[0].id} (${orders[0].status})` : 'Chua mua gi'}
      `;
    } catch {
      return 'Khong tim thay khach hang.';
    }
  }
}
