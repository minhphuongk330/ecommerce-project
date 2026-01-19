import type { Metadata } from "next";
import Providers from "~/components/atoms/Providers";
import "~/styles/globals.css";

export const metadata: Metadata = {
	title: "Cyber Store",
	description: "The best place to buy phones, laptops and accessories.",
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
		<html lang="en">
			<body style={{ margin: 0, padding: 0 }}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
