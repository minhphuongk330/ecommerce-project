import React from "react";

const CONTENTS = {
	story: {
		title: "Câu chuyện của chúng tôi",
		text: "Chào mừng bạn đến với Cyber Store — nơi công nghệ gặp gỡ sự tiện lợi. Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất với đa dạng sản phẩm công nghệ chính hãng, phù hợp với mọi nhu cầu và phong cách sống.",
	},
	mission: {
		title: "Sứ mệnh",
		text: "Sứ mệnh của chúng tôi là làm cho việc mua sắm trực tuyến trở nên đơn giản, thú vị và dễ tiếp cận với tất cả mọi người. Chúng tôi nỗ lực cung cấp sản phẩm chất lượng cao với giá cạnh tranh, đồng thời duy trì dịch vụ khách hàng xuất sắc.",
	},
	contact: {
		title: "Thông tin liên hệ",
		text: "Nếu bạn có bất kỳ câu hỏi nào hoặc cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi qua trang Liên hệ. Chúng tôi luôn sẵn sàng giúp đỡ!",
	},
};

const FEATURES = [
	"Đa dạng sản phẩm công nghệ chính hãng",
	"Giao hàng nhanh chóng và đáng tin cậy",
	"Thanh toán bảo mật, nhiều hình thức",
	"Hỗ trợ khách hàng 24/7",
	"Đổi trả dễ dàng trong 30 ngày",
];

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
	<h2 className="text-xl md:text-2xl font-semibold text-black mb-4">{children}</h2>
);

const SectionText = ({ children }: { children: React.ReactNode }) => (
	<p className="text-base md:text-lg leading-relaxed text-gray-700">{children}</p>
);

export default function AboutPage() {
	return (
		<div className="w-full bg-white min-h-screen">
			<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8 md:py-[40px]">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl md:text-4xl font-bold text-black mb-6 md:mb-8">Về chúng tôi</h1>

					<div className="space-y-6 md:space-y-8 text-gray-700">
						<section>
							<SectionTitle>{CONTENTS.story.title}</SectionTitle>
							<SectionText>{CONTENTS.story.text}</SectionText>
						</section>

						<section>
							<SectionTitle>{CONTENTS.mission.title}</SectionTitle>
							<SectionText>{CONTENTS.mission.text}</SectionText>
						</section>

						<section>
							<SectionTitle>Tại sao chọn chúng tôi</SectionTitle>
							<ul className="list-disc list-inside space-y-3 text-base md:text-lg leading-relaxed">
								{FEATURES.map((feature, index) => (
									<li key={index}>{feature}</li>
								))}
							</ul>
						</section>

						<section>
							<SectionTitle>{CONTENTS.contact.title}</SectionTitle>
							<SectionText>{CONTENTS.contact.text}</SectionText>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
}
