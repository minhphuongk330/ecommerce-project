import { GoogleGenerativeAI, SchemaType, Tool } from '@google/generative-ai';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { CartService } from '../cart/cart.service';
import { CategoriesService } from '../categories/categories.service';
import { CustomersService } from '../customers/customers.service';
import { FavoritesService } from '../favorites/favorites.service';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ChatbotService {
  private genAI: GoogleGenerativeAI;
  private cachedCategories: string = '';
  private lastCacheTime: number = 0;
  private readonly CACHE_TTL = 1000 * 60 * 60;

  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly cartService: CartService,
    private readonly favoritesService: FavoritesService,
    private readonly ordersService: OrdersService,
    private readonly adminService: AdminService,
    private readonly customersService: CustomersService,
  ) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  private async getPublicContext(searchQuery: string): Promise<string> {
    const now = Date.now();
    if (now - this.lastCacheTime > this.CACHE_TTL || !this.cachedCategories) {
      const categories = await this.categoriesService.findAll();
      this.cachedCategories = categories.map((c) => c.name).join(', ');
      this.lastCacheTime = now;
    }
    const productsResponse = await this.productsService.findAll();
    const allProducts = productsResponse.items || [];

    const stopWords = [
      'có',
      'không',
      'ko',
      'bán',
      'cái',
      'bao',
      'nhiêu',
      'là',
      'gì',
      'cho',
      'tôi',
      'rẻ',
      'nhất',
      'đắt',
      'mua',
      'tìm',
      'xem',
    ];
    const keywords = searchQuery
      .toLowerCase()
      .split(' ')
      .filter((word) => word.length >= 2 && !stopWords.includes(word));

    const scoredProducts = allProducts.map((p) => {
      let score = 0;
      const productName = p.name.toLowerCase();
      const categoryName = p.category ? p.category.name.toLowerCase() : '';
      keywords.forEach((kw) => {
        if (productName.includes(kw)) score += 3;
        else if (categoryName.includes(kw)) score += 1;
      });
      return { product: p, score };
    });

    let finalProducts = scoredProducts
      .filter((sp) => sp.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((sp) => sp.product);
    if (finalProducts.length === 0) {
      finalProducts = allProducts.slice(0, 20);
    }

    const productsList = finalProducts
      .map(
        (p) =>
          `- [ID: ${p.id}] ${p.name} (Giá: ${p.price} VNĐ) - ${p.stock > 0 ? 'Còn hàng' : 'Hết hàng'}`,
      )
      .join('\n');

    return `Danh mục SP: ${this.cachedCategories}\n\nBẢNG GIÁ REALTIME TỪ KHO HÀNG:\n${productsList}`;
  }

  private async getPersonalContext(customerId: number): Promise<string> {
    try {
      const [cart, favs, orders] = await Promise.all([
        this.cartService.findAll(customerId),
        this.favoritesService.findAll(customerId),
        this.ordersService.findByCustomerId(customerId),
      ]);

      const cartSummary = cart.length
        ? cart.map((c) => c.product.name).join(', ')
        : 'Trống';
      const favSummary = favs.length
        ? favs.map((f) => f.product.name).join(', ')
        : 'Trống';
      const orderSummary = orders
        .slice(0, 3)
        .map((o) => `Mã #${o.id} (${o.status})`)
        .join(', ');

      return `
        THÔNG TIN KHÁCH HÀNG:
        - Giỏ hàng: ${cartSummary}
        - Đã thích: ${favSummary}
        - 3 Đơn hàng gần nhất: ${orderSummary || 'Chưa mua gì'}
      `;
    } catch (error) {
      return 'Hệ thống hiện không thể tải thông tin cá nhân.';
    }
  }

  private async getAdminDashboardContext(): Promise<string> {
    try {
      const stats = await this.adminService.getDashboardStats();
      const productsResponse = await this.productsService.findAll();
      const allProducts = productsResponse.items || [];

      return `
        THỐNG KÊ QUẢN TRỊ:
        - Doanh thu tháng này: ${stats.monthRevenue.toLocaleString('vi-VN')} VNĐ
        - Doanh thu toàn bộ: ${stats.totalRevenue.toLocaleString('vi-VN')} VNĐ
        - Đơn hàng hôm nay: ${stats.todayOrders}
        - Tổng đơn hàng: ${stats.totalOrders}
        - Tổng khách hàng: ${stats.totalCustomers}
        - Sản phẩm tồn kho thấp (≤10): ${stats.lowStockProducts}
        
        THỐNG KÊ SẢN PHẨM:
        - Tổng số sản phẩm: ${allProducts.length}
        - Sản phẩm có sẵn: ${allProducts.filter((p) => p.stock > 0).length}
        - Top sản phẩm bán chạy (top 5 theo view):
        ${allProducts
          .slice(0, 5)
          .map(
            (p) => `  • ${p.name} - Giá: ${p.price} VNĐ, Tồn kho: ${p.stock}`,
          )
          .join('\n')}
      `;
    } catch (error) {
      return 'Không thể tải dữ liệu thống kê.';
    }
  }

  private async searchCustomersData(query: string): Promise<string> {
    try {
      const allCustomers = await this.customersService.findAll();
      const searchTerm = query.toLowerCase();

      const results = allCustomers.filter(
        (c) =>
          c.fullName.toLowerCase().includes(searchTerm) ||
          c.email.toLowerCase().includes(searchTerm),
      );

      if (results.length === 0) {
        return 'Không tìm thấy khách hàng nào phù hợp.';
      }

      return results
        .slice(0, 10)
        .map(
          (c) =>
            `- ID: ${c.id}, Tên: ${c.fullName}, Email: ${c.email}, Trạng thái: ${c.isActive ? 'Hoạt động' : 'Bị khóa'}, Ngày tạo: ${new Date(c.createdAt).toLocaleDateString('vi-VN')}`,
        )
        .join('\n');
    } catch (error) {
      return 'Lỗi khi tìm kiếm khách hàng.';
    }
  }

  private async getProductStatsData(): Promise<string> {
    try {
      const response = await this.productsService.findAll();
      const products = response.items || [];
      const lowStockProducts = products.filter((p) => p.stock <= 20);
      const outOfStockProducts = products.filter((p) => p.stock === 0);

      let stats = `
        THỐNG KÊ SẢN PHẨM:
        - Tổng số sản phẩm: ${products.length}
        - Sản phẩm có sẵn: ${products.filter((p) => p.stock > 0).length}
        - Sản phẩm hết hàng: ${outOfStockProducts.length}
        - Sản phẩm sắp hết (≤20): ${lowStockProducts.length}`;

      if (outOfStockProducts.length > 0) {
        stats += `\n\nCẢNH BÁO - Sản phẩm hết hàng:\n${outOfStockProducts
          .slice(0, 5)
          .map((p) => `  • ${p.name} (ID: ${p.id})`)
          .join('\n')}`;
      }

      if (lowStockProducts.length > 0) {
        stats += `\n\nSản phẩm sắp hết hàng:\n${lowStockProducts
          .slice(0, 10)
          .map((p) => `  • ${p.name} - Tồn kho: ${p.stock}`)
          .join('\n')}`;
      }

      return stats;
    } catch (error) {
      return 'Lỗi khi tải thống kê sản phẩm.';
    }
  }

  private async getOrderStatsData(): Promise<string> {
    try {
      const monthlyRevenue =
        await this.adminService.getRevenueByPeriod('monthly');
      const weeklyRevenue =
        await this.adminService.getRevenueByPeriod('weekly');
      const yearlyRevenue =
        await this.adminService.getRevenueByPeriod('yearly');

      return `
        THỐNG KÊ DOANH THU:
        
        📊 THÁNG NÀY (${monthlyRevenue.periodLabel}):
        - Doanh thu: ${monthlyRevenue.revenue.toLocaleString('vi-VN')} VNĐ
        - Số lượng đơn hàng: ${monthlyRevenue.orders}
        - Thay đổi so với tháng trước: ${monthlyRevenue.revenuePercent >= 0 ? '↑' : '↓'} ${Math.abs(monthlyRevenue.revenuePercent).toFixed(2)}%
        
        📈 TUẦN NÀY (${weeklyRevenue.periodLabel}):
        - Doanh thu: ${weeklyRevenue.revenue.toLocaleString('vi-VN')} VNĐ
        - Số lượng đơn hàng: ${weeklyRevenue.orders}
        - Thay đổi so với tuần trước: ${weeklyRevenue.revenuePercent >= 0 ? '↑' : '↓'} ${Math.abs(weeklyRevenue.revenuePercent).toFixed(2)}%
        
        📅 NĂM NÀY (${yearlyRevenue.periodLabel}):
        - Doanh thu: ${yearlyRevenue.revenue.toLocaleString('vi-VN')} VNĐ
        - Số lượng đơn hàng: ${yearlyRevenue.orders}
        - Thay đổi so với năm trước: ${yearlyRevenue.revenuePercent >= 0 ? '↑' : '↓'} ${Math.abs(yearlyRevenue.revenuePercent).toFixed(2)}%
      `;
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      return 'Lỗi khi tải thống kê doanh thu. Vui lòng thử lại.';
    }
  }

  private async getCustomerDetailsData(customerId: number): Promise<string> {
    try {
      const customer = await this.customersService.findOne(customerId);
      const orders = await this.ordersService.findByCustomerId(customerId);

      const totalSpent = orders
        .filter((o) => o.status === 'Completed')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      return `
        CHI TIẾT KHÁCH HÀNG:
        - ID: ${customer.id}
        - Tên: ${customer.fullName}
        - Email: ${customer.email}
        - Trạng thái: ${customer.isActive ? 'Hoạt động' : 'Bị khóa'}
        - Ngày tạo: ${new Date(customer.createdAt).toLocaleDateString('vi-VN')}
        - Tổng đơn hàng: ${orders.length}
        - Tổng chi tiêu: ${totalSpent.toLocaleString('vi-VN')} VNĐ
        - Đơn hàng gần nhất: ${orders.length > 0 ? `Mã #${orders[0].id} (${orders[0].status})` : 'Chưa mua gì'}
      `;
    } catch (error) {
      return 'Không tìm thấy khách hàng.';
    }
  }

  async chat(
    message: string,
    history: any[],
    mode: 'client' | 'admin',
    customerId: number | null,
  ) {
    try {
      const guardrails = `Ngươi là nhân viên chốt sale cấp cao của Cyber Store. BẮT BUỘC TUÂN THỦ:
      1. Bảng giá và tồn kho cung cấp bên dưới là DỮ LIỆU THỰC TẾ & REALTIME CỦA CỬA HÀNG. 
      2. NGƯƠI PHẢI TỰ TIN ĐỌC GIÁ SẢN PHẨM CHO KHÁCH. Tuyệt đối không được nói "không có thông tin bảng giá".
      3. Nếu khách hỏi sản phẩm "rẻ nhất" hay "đắt nhất", HÃY TỰ NHÌN VÀO BẢNG GIÁ bên dưới, so sánh và trả lời thẳng tên máy + giá tiền.
      4. Chỉ tư vấn các sản phẩm công nghệ có trong cửa hàng.
      5. QUAN TRỌNG: Nếu trạng thái là KHÁCH VÃNG LAI (CHƯA ĐĂNG NHẬP), mà khách hỏi về giỏ hàng, đơn hàng hay sở thích, hãy nhắc họ VUI LÒNG ĐĂNG NHẬP để xem. Tuyệt đối không nói là lỗi hệ thống.`;

      let systemInstruction = '';
      let tools: Tool[] = [];

      const userHistory = history
        ? history.filter((h) => h.sender === 'user')
        : [];
      const lastUserMsg =
        userHistory.length > 0 ? userHistory[userHistory.length - 1].text : '';
      const searchQuery = `${lastUserMsg} ${message}`;

      const publicContext = await this.getPublicContext(searchQuery);

      if (mode === 'admin') {
        const adminContext = await this.getAdminDashboardContext();

        systemInstruction = `
          ${guardrails}
          
          NGỮ CẢNH HIỆN TẠI: NGƯƠI ĐANG Ở TRANG QUẢN TRỊ (ADMIN DASHBOARD).
          - Vai trò: Trợ lý nội bộ cấp cao của chủ cửa hàng.
          - Yêu cầu: Xưng hô là "Trợ lý nội bộ" với chủ cửa hàng. Cung cấp số liệu chi tiết khi được hỏi. Tự động dùng các hàm để tìm kiếm dữ liệu chi tiết.
          - Quyền hạn: Có quyền truy cập đầy đủ vào dữ liệu khách hàng, sản phẩm, đơn hàng, và thống kê.
          
          ${adminContext}
          
          ${publicContext}
        `;

        const adminTools: Tool = {
          functionDeclarations: [
            {
              name: 'searchCustomers',
              description:
                'Tìm kiếm thông tin khách hàng theo tên hoặc email. Sử dụng khi admin cần xem chi tiết khách hàng.',
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  query: {
                    type: SchemaType.STRING,
                    description: 'Tên hoặc email của khách hàng cần tìm',
                  },
                },
                required: ['query'],
              } as any,
            },
            {
              name: 'getProductStats',
              description:
                'Lấy thống kê chi tiết về sản phẩm: hàng hết, sắp hết hàng, v.v.',
              parameters: {
                type: SchemaType.OBJECT,
                properties: {},
                required: [],
              } as any,
            },
            {
              name: 'getOrderStats',
              description:
                'Lấy thống kê chi tiết về đơn hàng: số lượng theo trạng thái, doanh thu, v.v.',
              parameters: {
                type: SchemaType.OBJECT,
                properties: {},
                required: [],
              } as any,
            },
            {
              name: 'getCustomerDetails',
              description:
                'Lấy thông tin chi tiết của một khách hàng cụ thể theo ID.',
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  customerId: {
                    type: SchemaType.NUMBER,
                    description: 'ID của khách hàng',
                  },
                },
                required: ['customerId'],
              } as any,
            },
          ],
        };
        tools.push(adminTools);
      } else {
        const personalContext = customerId
          ? await this.getPersonalContext(customerId)
          : 'THÔNG TIN KHÁCH HÀNG: Đây là khách vãng lai (CHƯA ĐĂNG NHẬP). Hãy yêu cầu họ đăng nhập nếu họ muốn tra cứu cá nhân.';

        systemInstruction = `
          ${guardrails}
          
          NGỮ CẢNH HIỆN TẠI: NGƯƠI ĐANG TRÒ CHUYỆN VỚI KHÁCH MUA HÀNG.
          - Vai trò: Chuyên viên tư vấn bán hàng.
          
          ${publicContext}
          
          ${personalContext}
        `;

        const clientTools: Tool = {
          functionDeclarations: [
            {
              name: 'addToCart',
              description:
                'Thêm một sản phẩm vào giỏ hàng. Gọi hàm này khi người dùng yêu cầu mua hàng hoặc thêm vào giỏ.',
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  productId: {
                    type: SchemaType.NUMBER,
                    description: 'ID của sản phẩm (lấy từ danh sách sản phẩm)',
                  },
                  quantity: {
                    type: SchemaType.NUMBER,
                    description: 'Số lượng cần thêm',
                  },
                },
                required: ['productId', 'quantity'],
              } as any,
            },
          ],
        };
        tools.push(clientTools);
      }

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: systemInstruction,
        tools: tools,
      });

      let validHistory = history || [];
      if (validHistory.length > 0 && validHistory[0].sender === 'bot') {
        validHistory = validHistory.slice(1);
      }
      const formattedHistory = validHistory.map((msg) => ({
        role: msg.sender === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

      const chatSession = model.startChat({ history: formattedHistory });
      let result = await chatSession.sendMessage(message);
      const functionCalls = result.response.functionCalls();
      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        let functionResult = {};

        if (mode === 'admin') {
          if (call.name === 'searchCustomers') {
            const args = call.args as any;
            functionResult = {
              result: await this.searchCustomersData(args.query),
            };
          } else if (call.name === 'getProductStats') {
            functionResult = {
              result: await this.getProductStatsData(),
            };
          } else if (call.name === 'getOrderStats') {
            functionResult = {
              result: await this.getOrderStatsData(),
            };
          } else if (call.name === 'getCustomerDetails') {
            const args = call.args as any;
            functionResult = {
              result: await this.getCustomerDetailsData(args.customerId),
            };
          }
        } else {
          if (call.name === 'addToCart') {
            const args = call.args as any;

            if (!customerId) {
              functionResult = {
                success: false,
                message:
                  'Yêu cầu người dùng đăng nhập trước khi thêm vào giỏ hàng.',
              };
            } else {
              try {
                await this.cartService.create(customerId, {
                  productId: args.productId,
                  quantity: args.quantity,
                });
                functionResult = {
                  success: true,
                  message: `Đã thêm thành công số lượng ${args.quantity} vào giỏ hàng.`,
                };
              } catch (error: any) {
                functionResult = {
                  success: false,
                  message: error.message || 'Lỗi khi thêm vào giỏ hàng.',
                };
              }
            }
          }
        }

        result = await chatSession.sendMessage([
          {
            functionResponse: {
              name: call.name,
              response: functionResult,
            },
          },
        ]);
      }

      return {
        success: true,
        reply: result.response.text(),
      };
    } catch (error) {
      console.error('Lỗi khi gọi Gemini API:', error);
      throw new InternalServerErrorException(
        'Chatbot hiện không thể phản hồi, vui lòng thử lại sau.',
      );
    }
  }
}
