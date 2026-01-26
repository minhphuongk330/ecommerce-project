import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const debugUser = config.get<string>('MAIL_USER');
        const debugPass = config.get<string>('MAIL_PASS');
        console.log('=============================================');
        console.log(
          '🔍 [DEBUG EMAIL CONFIG] Đang kiểm tra cấu hình trên Render:',
        );
        console.log(`- Host: smtp-relay.brevo.com`);
        console.log(`- Port: 465 (SSL)`);
        console.log(`- User (Mail): '${debugUser}'`);

        if (!debugPass) {
          console.log(
            '- Pass (Key): ❌ NULL/UNDEFINED (Chưa nhận được biến môi trường)',
          );
        } else {
          console.log(
            `- Pass (Key): ✅ Đã nhận (Độ dài: ${debugPass.length} ký tự)`,
          );

          if (debugPass.length < 50) {
            console.log(
              '   ⚠️ CẢNH BÁO: Key này quá ngắn! Có thể bạn đang nhập sai mật khẩu web thay vì SMTP Key.',
            );
          }
        }
        console.log('=============================================');

        return {
          transport: {
            host: 'smtp-relay.brevo.com',
            port: 465,
            secure: true,
            auth: {
              user: debugUser,
              pass: debugPass,
            },
          },
          defaults: {
            from: `"Support Team" <${debugUser}>`,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MailerModule],
})
export class MailModule {}
