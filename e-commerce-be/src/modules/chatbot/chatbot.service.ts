import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChatbotAdminService } from './chatbot-admin.service';
import { ChatbotClientService } from './chatbot-client.service';

const GUARDRAILS = `Nguoi la nhan vien chot sale cap cao cua Cyber Store. BAT BUOC TUAN THU:
1. Bang gia va ton kho cung cap ben duoi la DU LIEU THUC TE & REALTIME CUA CUA HANG.
2. NGUOI PHAI TU TIN DOC GIA SAN PHAM CHO KHACH. Tuyet doi khong duoc noi "khong co thong tin bang gia".
3. Neu khach hoi san pham "re nhat" hay "dat nhat", HAY TU NHIN VAO BANG GIA ben duoi, so sanh va tra loi thang ten may + gia tien.
4. Chi tu van cac san pham cong nghe co trong cua hang.
5. QUAN TRONG: Neu trang thai la KHACH VANG LAI (CHUA DANG NHAP), ma khach hoi ve gio hang, don hang hay so thich, hay nhac ho VUI LONG DANG NHAP de xem.`;

@Injectable()
export class ChatbotService {
  private genAI: GoogleGenerativeAI;

  constructor(
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
  ) {
    try {
      const userHistory = history
        ? history.filter((h) => h.sender === 'user')
        : [];
      const lastUserMsg =
        userHistory.length > 0 ? userHistory[userHistory.length - 1].text : '';
      const searchQuery = `${lastUserMsg} ${message}`;
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
          ? await this.clientService.getPersonalContext(customerId)
          : 'THONG TIN KHACH HANG: Day la khach vang lai (CHUA DANG NHAP).';
        const publicContext =
          await this.clientService.getPublicContext(searchQuery);
        systemInstruction = `
          ${GUARDRAILS}
          NGU CANH: TRO CHUYEN VOI KHACH MUA HANG
          - Vai tro: Chuyen vien tu van ban hang.
          ${publicContext}
          ${personalContext}
        `;
        tools = [this.clientService.getTools()];
      }

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
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
}
