import { SchemaType, Tool } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { CategoriesService } from '../categories/categories.service';
import { FavoritesService } from '../favorites/favorites.service';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ChatbotClientService {
  private cachedCategories: string = '';
  private lastCacheTime: number = 0;
  private readonly CACHE_TTL = 1000 * 60 * 60;

  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly cartService: CartService,
    private readonly favoritesService: FavoritesService,
    private readonly ordersService: OrdersService,
  ) {}

  async getPublicContext(searchQuery: string): Promise<string> {
    const now = Date.now();
    if (now - this.lastCacheTime > this.CACHE_TTL || !this.cachedCategories) {
      const categories = await this.categoriesService.findAll();
      this.cachedCategories = categories.map((c) => c.name).join(', ');
      this.lastCacheTime = now;
    }

    const productsResponse = await this.productsService.findAll();
    const allProducts = productsResponse.items || [];

    const stopWords = [
      'co',
      'khong',
      'ko',
      'ban',
      'cai',
      'bao',
      'nhieu',
      'la',
      'gi',
      'cho',
      'toi',
      're',
      'nhat',
      'dat',
      'mua',
      'tim',
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

    if (finalProducts.length === 0) finalProducts = allProducts.slice(0, 20);

    const productsList = finalProducts
      .map(
        (p) =>
          `- [ID: ${p.id}] ${p.name} (Gia: ${p.price} VND) - ${p.stock > 0 ? 'Con hang' : 'Het hang'}`,
      )
      .join('\n');

    return `Danh muc SP: ${this.cachedCategories}\n\nBANG GIA REALTIME:\n${productsList}`;
  }

  async getPersonalContext(customerId: number): Promise<string> {
    try {
      const [cart, favs, orders] = await Promise.all([
        this.cartService.findAll(customerId),
        this.favoritesService.findAll(customerId),
        this.ordersService.findByCustomerId(customerId),
      ]);

      const cartSummary = cart.length
        ? cart.map((c) => c.product.name).join(', ')
        : 'Trong';
      const favSummary = favs.length
        ? favs.map((f) => f.product.name).join(', ')
        : 'Trong';
      const orderSummary = orders
        .slice(0, 3)
        .map((o) => `Ma #${o.id} (${o.status})`)
        .join(', ');

      return `
        THONG TIN KHACH HANG:
        - Gio hang: ${cartSummary}
        - Da thich: ${favSummary}
        - 3 Don hang gan nhat: ${orderSummary || 'Chua mua gi'}
      `;
    } catch {
      return 'He thong hien khong the tai thong tin ca nhan.';
    }
  }

  getTools(): Tool {
    return {
      functionDeclarations: [
        {
          name: 'addToCart',
          description:
            'Them mot san pham vao gio hang. Goi ham nay khi nguoi dung yeu cau mua hang hoac them vao gio.',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              productId: {
                type: SchemaType.NUMBER,
                description: 'ID cua san pham (lay tu danh sach san pham)',
              },
              quantity: {
                type: SchemaType.NUMBER,
                description: 'So luong can them',
              },
            },
            required: ['productId', 'quantity'],
          } as any,
        },
      ],
    };
  }

  async executeAddToCart(
    customerId: number | null,
    args: { productId: number; quantity: number },
  ): Promise<{ functionResult: object; cartUpdated: boolean }> {
    if (!customerId) {
      return {
        functionResult: {
          success: false,
          message: 'Yeu cau nguoi dung dang nhap truoc khi them vao gio hang.',
        },
        cartUpdated: false,
      };
    }

    try {
      await this.cartService.create(customerId, {
        productId: args.productId,
        quantity: args.quantity,
      });
      return {
        functionResult: {
          success: true,
          message: `Da them thanh cong so luong ${args.quantity} vao gio hang.`,
        },
        cartUpdated: true,
      };
    } catch (error: any) {
      return {
        functionResult: {
          success: false,
          message: error.message || 'Loi khi them vao gio hang.',
        },
        cartUpdated: false,
      };
    }
  }
}
