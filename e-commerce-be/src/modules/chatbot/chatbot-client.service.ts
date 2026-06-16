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

    const stopWords = [
      'co', 'khong', 'ko', 'ban', 'cai', 'bao', 'nhieu',
      'la', 'gi', 'cho', 'toi', 're', 'nhat', 'dat', 'mua', 'tim', 'xem',
      'san', 'pham', 'hang', 'cac', 'chiec', 'mau', 'dong', 'loai', 'nhung', 'de'
    ];

    const removeAccents = (str: string) =>
      str.normalize('NFD')
         .replace(/[\u0300-\u036f]/g, '')
         .replace(/đ/g, 'd')
         .replace(/Đ/g, 'd');

    const keywords = searchQuery
      .toLowerCase()
      .split(' ')
      .filter((word) => {
        const cleanWord = removeAccents(word);
        return cleanWord.length >= 2 && !stopWords.includes(cleanWord);
      });

    // Chạy song song: tìm sản phẩm + lấy bảng giá sale đang active (1 query mỗi loại)
    const [rawMatchedProducts, salePriceMap] = await Promise.all([
      this.productsService.searchByKeywords(keywords),
      this.productsService.getActiveSalePriceMap(),
    ]);

    let matchedProducts = rawMatchedProducts;

    // Kiểm tra xem khách có đang hỏi về khuyến mãi, giảm giá hay Flash Sale không
    const isAskingForPromo = keywords.some((kw) =>
      ['flash', 'sale', 'giam', 'khuyen', 'mai', 'uu', 'dai'].includes(removeAccents(kw)),
    );

    // Nếu người dùng hỏi về khuyến mãi/Flash Sale, luôn lấy toàn bộ sản phẩm Flash Sale và gộp vào kết quả
    if (isAskingForPromo) {
      const promoResult = await this.productsService.findAll({ flashSale: true, limit: 100 });
      const promoProducts = promoResult.items;

      const merged = [...matchedProducts];
      for (const p of promoProducts) {
        if (!merged.some((mp) => mp.id === p.id)) {
          merged.push(p);
        }
      }
      matchedProducts = merged;
    }

    const productsList = matchedProducts
      .map((p) => {
        const saleInfo = salePriceMap.get(Number(p.id));
        const stockText = p.stock > 0 ? 'Con hang' : 'Het hang';

        if (saleInfo && p.stock > 0) {
          const isSaleSoldOut = saleInfo.soldQuantity >= saleInfo.quantity;
          if (isSaleSoldOut) {
            // Giá ưu đãi Flash Sale đã bán hết, khách chỉ mua được giá gốc
            return `- [ID: ${p.id}] ${p.name} (Gia goc: ${p.price} VND | GIA FLASH SALE UU DAI DA BAN HET) - ${stockText}`;
          } else {
            // Còn suất mua giá Flash Sale
            const saleRemaining = saleInfo.quantity - saleInfo.soldQuantity;
            return `- [ID: ${p.id}] ${p.name} (Gia goc: ${p.price} VND | GIA FLASH SALE UU DAI: ${saleInfo.salePrice} VND - CON LAI ${saleRemaining} SUAT SALE) - ${stockText}`;
          }
        }
        return `- [ID: ${p.id}] ${p.name} (Gia: ${p.price} VND) - ${stockText}`;
      })
      .join('\n');

    // --- Phát hiện intent "gợi ý sản phẩm" ---
    // Nếu người dùng hỏi gợi ý/nên mua gì, ta tra cứu sản phẩm bán chạy nhất để AI có dữ liệu chính xác.
    const suggestionKeywords = ['goi y', 'de xuat', 'nen mua', 'nen chon', 'muon mua', 'recommend', 'chon gi', 'mua gi'];
    const isAskingForSuggestion = keywords.some((kw) =>
      suggestionKeywords.some((sk) => removeAccents(kw).includes(sk) || sk.includes(removeAccents(kw))),
    );

    let bestSellerContext = '';
    if (isAskingForSuggestion) {
      // Trích xuất tên danh mục từ keywords (nếu có) bằng cách so khớp với danh sách categories
      const categoryNames = this.cachedCategories.split(', ');
      const matchedCategory = categoryNames.find((cat) =>
        keywords.some((kw) => removeAccents(cat.toLowerCase()).includes(removeAccents(kw))),
      );

      const bestSellers = await this.productsService.getBestSellers(matchedCategory, 1);

      if (bestSellers.length > 0) {
        const { product: bp, totalSold } = bestSellers[0];
        const saleInfo = salePriceMap.get(Number(bp.id));
        const categoryLabel = matchedCategory ? ` TRONG DANH MUC ${matchedCategory.toUpperCase()}` : '';
        let priceText = `Gia: ${bp.price} VND`;
        if (saleInfo && bp.stock > 0) {
          const isSaleSoldOut = saleInfo.soldQuantity >= saleInfo.quantity;
          if (!isSaleSoldOut) {
            priceText = `Gia goc: ${bp.price} VND | GIA FLASH SALE: ${saleInfo.salePrice} VND`;
          }
        }
        bestSellerContext = `\n\nSAN PHAM BAN CHAY NHAT${categoryLabel} (DANH GIA DE GOI Y):\n- [ID: ${bp.id}] ${bp.name} (${priceText}) - Da ban: ${totalSold} chiec`;
      }
    }

    return `Danh muc SP: ${this.cachedCategories}\n\nBANG GIA REALTIME:\n${productsList}${bestSellerContext}`;
  }

  async getProductById(id: number) {
    try {
      return await this.productsService.findOne(id);
    } catch {
      return null;
    }
  }

  async getActiveFlashSale(productId: number) {
    try {
      return await this.productsService.getActiveFlashSaleItem(productId);
    } catch {
      return null;
    }
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
        .map((o) => {
          const products = o.orderItems
            ?.map((item) => item.product?.name)
            .filter(Boolean)
            .join(', ') || 'Chua xac dinh';
          return `Don hang ID ${o.id} (Trang thai: ${o.status}) co cac san pham: [${products}]`;
        })
        .join('; ');

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
