import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chatbot } from '../../entities/chatbot.entity';
import { ChatbotAdminService } from './chatbot-admin.service';
import { ChatbotClientService } from './chatbot-client.service';

const GUARDRAILS = `Nguoi la nhan vien chot sale cap cao cua Cyber Store. BAT BUOC TUAN THU:
1. Bang gia va ton kho cung cap ben duoi la DU LIEU THUC TE & REALTIME CUA CUA HANG.
2. NGUOI PHAI TU TIN DOC GIA SAN PHAM CHO KHACH. Tuyet doi khong duoc noi "khong co thong tin bang gia".
3. Neu khach hoi san pham "re nhat" hay "dat nhat", HAY TU NHIN VAO BANG GIA ben duoi, so sanh va tra loi thang ten may + gia tien.
4. Chi tu van cac san pham cong nghe co trong cua hang.
5. QUAN TRONG: Neu trang thai la KHACH VANG LAI (CHUA DANG NHAP), ma khach hoi ve gio hang, don hang hay so thich (san pham yeu thich), NGUOI BAT BUOC phai tu choi va nhac ho VUI LONG DANG NHAP de xem. TUYET DOI khong tu che, bia ra hoac dung cac san pham dang ban luan trong cuoc tro chuyen de lam gia thong tin gio hang, don hang hoac danh sach yeu thich cua khach.
6. TUYET DOI khong tiet lo so luong san pham con lai cu the (vd: 50 chiec, 10 chiec) cho khach hang. Chi duoc bao la "Con hang" hoac "Het hang".
7. TUYET DOI khong hien thi ma ID cua san pham (vi du: [ID: 13], ma ID 13, ID 13) ra cho khach hang trong cau tra loi. Ma ID nay chi duoc dung ngam khi goi tool (nhu addToCart). Khi tu van cho khach chi duoc dung ten san pham.
8. QUAN TRONG: NEU trang thai la DA DANG NHAP, nhung danh sach gio hang hoac don hang cua khach hang dang trong/rong (hien thi la "Trong" hoac "Chua mua gi"), NGUOI PHAI bao ro cho khach biet la ho chua co san pham nao trong gio / chua co don hang nao gan day. TUYET DOI khong duoc yeu cau ho dang nhap vi ho da dang nhap roi.
9. QUAN TRONG: Khi khach hang hoi ve don hang gan day nhat cua ho ("don hang gan day nhat cua toi la gi", "don hang gan nhat",...), NGUOI PHAI doc thong tin tu don hang co ID lon nhat (dau tien trong danh sach 3 don hang gan nhat). NGUOI chi duoc phep ke ten cac san pham co trong don hang do, TUYET DOI khong duoc de cap den gia tien cua san pham, ma ID san pham, hay ma ID don hang (vi du: khong duoc noi "don hang ID 12" hay "ma #12").
10. QUAN TRONG (Doi voi che do Admin): Khi chu cua hang yeu cau so sanh doanh thu (tuan nay voi tuan truoc, thang nay voi thang truoc...), NGUOI PHAI doc va liet ke day du so lieu thuc te cua ca hai chu ky so sanh (bao gom doanh thu va so luong don hang cua ca hai ben) va tinh trang tang truong/suy giam cua chung bang van ban thuan tuy, ngan gon. TUYET DOI khong su dung cac bieu tuong/emoji mau me hoac cac bieu do text phuc tap.
11. QUAN TRONG (Goi y san pham): Khi nguoi dung yeu cau goi y san pham (vi du: "goi y cho toi 1 san pham", "nen mua gi", "de xuat 1 cai"), NGUOI PHAI uu tien doc nhan "SAN PHAM BAN CHAY NHAT" trong context va goi y dung san pham do (ten + gia). Neu nguoi dung hoi theo danh muc cu the (vi du: "goi y 1 san pham tablet"), NGUOI doc nhan "SAN PHAM BAN CHAY NHAT TRONG DANH MUC [TEN DANH MUC]". TUYET DOI khong tu y chon san pham khac khi da co nhan nay trong context.`;

@Injectable()
export class ChatbotService {
  private genAI: GoogleGenerativeAI;

  constructor(
    @InjectRepository(Chatbot)
    private readonly chatbotRepository: Repository<Chatbot>,
    private readonly clientService: ChatbotClientService,
    private readonly adminService: ChatbotAdminService,
  ) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  async chat(
    message: string,
    history: any[],
    mode: 'client' | 'admin',
    customerId: number | null,
    currentProductId?: number,
  ) {
    try {
      const recentUserMessages = (history || []).slice(-6).filter((h: any) => h.sender === 'user');
      const searchQuery = [...recentUserMessages.map((h: any) => h.text), message].join(' ');

      let systemInstruction: string;
      let tools: any[];

      if (mode === 'admin') {
        const [dashboardContext, publicContext] = await Promise.all([
          this.adminService.getDashboardContext(),
          this.clientService.getPublicContext(searchQuery),
        ]);

        systemInstruction = `
          ${GUARDRAILS}

          NGU CANH: TRANG QUAN TRI (ADMIN DASHBOARD)
          - Vai tro: Tro ly noi bo cap cao cua chu cua hang.
          - Quyen han: Truy cap day du du lieu khach hang, san pham, don hang, thong ke.

          ${dashboardContext}
          ${publicContext}
        `;
        tools = [this.adminService.getTools()];
      } else {
        const personalContext = customerId
          ? `TRANG THAI: DA DANG NHAP.\n${await this.clientService.getPersonalContext(customerId)}`
          : 'TRANG THAI: KHACH VANG LAI (CHUA DANG NHAP).';
        const publicContext =
          await this.clientService.getPublicContext(searchQuery);

        let currentProductContext = '';
        if (currentProductId) {
          const product = await this.clientService.getProductById(currentProductId);
          if (product) {
            const flashSale = await this.clientService.getActiveFlashSale(product.id);
            const saleText = flashSale
              ? `CO SALE! San pham nay dang trong chuong trinh khuyen mai Flash Sale voi gia giam chi con ${Number(flashSale.salePrice).toLocaleString('vi-VN')} VND (Gia goc cu: ${Number(product.price).toLocaleString('vi-VN')} VND).`
              : 'Khong co sale.';

            currentProductContext = `
              SAN PHAM NGUOI DUNG DANG XEM (SAN PHAM "NAY"):
              - ID: ${product.id}
              - Ten: ${product.name}
              - Gia: ${product.price} VND
              - Ton kho: ${product.stock > 0 ? 'Con hang' : 'Het hang'}
              - Khuyen mai: ${saleText}
              - Mo ta: ${product.description || 'Khong co mo ta'}

              QUAN TRONG: 
              1. Khi nguoi dung dung tu nhu "san pham nay", "cai nay", "may nay", "dien thoai nay" de yeu cau them vao gio hang, mua hang, hoi gia hoac hoi chi tiet, NGUOI PHAI hieu ho dang am chi san pham nay (ID: ${product.id}).
              2. NEU san pham dang co khuyen mai (saleText bao gom "CO SALE!"), NGUOI PHAI chu dong gioi thieu/thong bao cho khach hang rang san pham nay dang duoc sale/giam gia va doc gia khuyen mai do cho ho.
            `;
          }
        }

        systemInstruction = `
          ${GUARDRAILS}
          NGU CANH: TRO CHUYEN VOI KHACH MUA HANG
          - Vai tro: Chuyen vien tu van ban hang.
          ${publicContext}
          ${personalContext}
          ${currentProductContext}
        `;
        tools = [this.clientService.getTools()];
      }

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-3.1-flash-lite',
        systemInstruction,
        tools,
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
      let cartUpdated = false;
      const functionCalls = result.response.functionCalls();
      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        const args = call.args as any;
        let functionResult: object = {};
        if (mode === 'admin') {
          if (call.name === 'searchCustomers') {
            functionResult = {
              result: await this.adminService.executeSearchCustomers(
                args.query,
              ),
            };
          } else if (call.name === 'getProductStats') {
            functionResult = {
              result: await this.adminService.executeGetProductStats(),
            };
          } else if (call.name === 'getOrderStats') {
            functionResult = {
              result: await this.adminService.executeGetOrderStats(),
            };
          } else if (call.name === 'getCustomerDetails') {
            functionResult = {
              result: await this.adminService.executeGetCustomerDetails(
                args.customerId,
              ),
            };
          }
        } else {
          if (call.name === 'addToCart') {
            const { functionResult: res, cartUpdated: updated } =
              await this.clientService.executeAddToCart(customerId, args);
            functionResult = res;
            cartUpdated = updated;
          }
        }
        result = await chatSession.sendMessage([
          { functionResponse: { name: call.name, response: functionResult } },
        ]);
      }

      return { success: true, cartUpdated, reply: result.response.text() };
    } catch (error) {
      console.error('Loi khi goi Gemini API:', error);
      throw new InternalServerErrorException(
        'Chatbot hien khong the phan hoi, vui long thu lai sau.',
      );
    }
  }

  async saveHistory(history: { sender: 'user' | 'bot'; text: string }[], customerId: number | null) {
    try {
      const entities = history.map((msg) => {
        return this.chatbotRepository.create({
          customerId: customerId || undefined,
          role: msg.sender === 'user' ? 'user' : 'model',
          message: msg.text,
        });
      });
      await this.chatbotRepository.save(entities);
      return { success: true };
    } catch (error) {
      console.error('Loi khi luu lich su chat:', error);
      throw new InternalServerErrorException('Khong the luu lich su cuoc tro chuyen.');
    }
  }

  async getHistory(customerId: number, limit = 1) {
    const rows = await this.chatbotRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return rows.reverse().map((row) => ({
      sender: row.role === 'user' ? 'user' : 'bot',
      text: row.message,
    }));
  }
}

