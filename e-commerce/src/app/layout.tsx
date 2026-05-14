import type { Metadata } from "next";
import Providers from "~/components/atoms/Providers";
import Chatbot from "~/components/Chatbot/Index";
import PromoPopup from "~/components/PromoPopup";
import "~/styles/globals.css";

export const metadata: Metadata = {
	title: "Cyber Store - Công nghệ chính hãng",
	description: "Mua sắm điện thoại, laptop, tai nghe và phụ kiện công nghệ chính hãng giá tốt.",
	icons: {
		icon: "/favicon.ico",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="vi">
			<body style={{ margin: 0, padding: 0 }}>
				<Providers>
					{children}
					<Chatbot />
					<PromoPopup />
				</Providers>
			</body>
		</html>
	);
}
