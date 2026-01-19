import React from "react";

const CONTENTS = {
	story: {
		title: "Our Story",
		text: "Welcome to our e-commerce platform, where quality meets convenience. We are dedicated to providing you with the best shopping experience, offering a wide range of products that cater to your needs and lifestyle.",
	},
	mission: {
		title: "Our Mission",
		text: "Our mission is to make online shopping simple, enjoyable, and accessible to everyone. We strive to offer high-quality products at competitive prices while maintaining excellent customer service.",
	},
	contact: {
		title: "Contact Information",
		text: "If you have any questions or need assistance, please don't hesitate to reach out to us through our contact page. We're here to help!",
	},
};

const FEATURES = [
	"Wide selection of quality products",
	"Fast and reliable shipping",
	"Secure payment options",
	"24/7 customer support",
	"Easy returns and refunds",
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
			<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8 md:py-[80px]">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl md:text-4xl font-bold text-black mb-6 md:mb-8">About Us</h1>

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
							<SectionTitle>Why Choose Us</SectionTitle>
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
