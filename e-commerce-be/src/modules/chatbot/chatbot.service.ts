import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI, SchemaType, Tool } from '@google/generative-ai';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';
import { CartService } from '../cart/cart.service';
import { FavoritesService } from '../favorites/favorites.service';
import { OrdersService } from '../orders/orders.service';

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

    const allProducts = await this.productsService.findAll();

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
          `- [ID: ${p.id}] ${p.name} (Giá: ${p.price} VNĐ) - Còn ${p.stock} cái`,
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

      const userHistory = history
        ? history.filter((h) => h.sender === 'user')
        : [];
      const lastUserMsg =
        userHistory.length > 0 ? userHistory[userHistory.length - 1].text : '';
      const searchQuery = `${lastUserMsg} ${message}`;

      if (mode === 'admin') {
        const allOrders = await this.ordersService.findAll();
        const pendingCount = allOrders.filter(
          (o) => o.status === 'Pending',
        ).length;
        systemInstruction = `${guardrails}\n\n[MODE: QUẢN TRỊ VIÊN]. Có ${pendingCount} đơn hàng đang chờ duyệt.`;
      } else {
        const publicContext = await this.getPublicContext(searchQuery);

        const personalContext = customerId
          ? await this.getPersonalContext(customerId)
          : 'THÔNG TIN KHÁCH HÀNG: Đây là khách vãng lai (CHƯA ĐĂNG NHẬP). Hãy yêu cầu họ đăng nhập nếu họ muốn tra cứu cá nhân.';

        systemInstruction = `${guardrails}\n\n${publicContext}\n\n${personalContext}`;
      }

      const addToCartTool: Tool = {
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

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: systemInstruction,
        tools: [addToCartTool],
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

        if (call.name === 'addToCart') {
          const args = call.args as any;
          let functionResult = {};

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

          result = await chatSession.sendMessage([
            {
              functionResponse: {
                name: 'addToCart',
                response: functionResult,
              },
            },
          ]);
        }
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
