"use client";
import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PolicySection {
	heading: string;
	paragraphs: string[];
}

interface PolicyData {
	title: string;
	sections: PolicySection[];
}

const POLICY_CONTENTS: Record<string, PolicyData> = {
	"tuyen-dung": {
		title: "Cơ Hội Nghề Nghiệp Tại Cyber Store",
		sections: [
			{
				heading: "1. Vị trí: Nhân viên tư vấn bán hàng (Full-time / Part-time)",
				paragraphs: [
					"Số lượng: 05 nhân viên.",
					"Mô tả công việc: Tư vấn và giải đáp thắc mắc của khách hàng về sản phẩm công nghệ (điện thoại, laptop, phụ kiện); sắp xếp hàng hóa và đảm bảo không gian mua sắm sạch đẹp.",
					"Yêu cầu: Có đam mê với sản phẩm công nghệ, khả năng giao tiếp tốt, nhanh nhẹn, trung thực.",
					"Quyền lợi: Lương cơ bản + doanh số hấp dẫn, được đào tạo kiến thức chuyên sâu về công nghệ, môi trường trẻ trung năng động."
				]
			},
			{
				heading: "2. Vị trí: Lập trình viên Web Frontend (React/Next.js)",
				paragraphs: [
					"Số lượng: 02 nhân viên.",
					"Mô tả công việc: Phát triển và tối ưu hóa hệ thống website thương mại điện tử của Cyber Store; phối hợp với đội ngũ backend để thiết kế và triển khai API.",
					"Yêu cầu: Tối thiểu 1 năm kinh nghiệm phát triển với ReactJS/Next.js; có tư duy thiết kế tốt, hiểu biết về UI/UX và responsive design.",
					"Quyền lợi: Lương thưởng thỏa thuận theo năng lực, đóng BHXH đầy đủ, thưởng dự án và lương tháng 13."
				]
			},
			{
				heading: "3. Hướng dẫn ứng tuyển",
				paragraphs: [
					"Ứng viên quan tâm vui lòng gửi hồ sơ (CV) về địa chỉ email tuyển dụng: hr@cyberstore.vn với tiêu đề [Vị trí ứng tuyển] - [Họ và tên].",
					"Hoặc liên hệ hotline nhân sự: 0909 xxx xxx để được tư vấn thêm thông tin chi tiết."
				]
			}
		]
	},
	"chinh-sach-ban-hang": {
		title: "Chính Sách Bán Hàng",
		sections: [
			{
				heading: "1. Cam kết chất lượng sản phẩm",
				paragraphs: [
					"Cyber Store cam kết cung cấp 100% sản phẩm chính hãng từ các thương hiệu hàng đầu như Apple, Samsung, Asus, Sony... Tất cả sản phẩm đều có đầy đủ hóa đơn, chứng từ nguồn gốc xuất xứ rõ ràng.",
					"Sản phẩm được trưng bày và bán trực tuyến là hàng mới nguyên seal (đối với hàng mới) hoặc có thông tin mô tả chi tiết, minh bạch (đối với hàng trưng bày)."
				]
			},
			{
				heading: "2. Quy định đặt hàng và xác nhận",
				paragraphs: [
					"Khách hàng có thể đặt hàng trực tuyến qua website hoặc đặt qua số hotline hỗ trợ mua hàng.",
					"Sau khi nhận được đơn hàng, nhân viên của Cyber Store sẽ liên hệ trực tiếp hoặc gửi email/tin nhắn xác nhận đơn hàng kèm theo chi phí vận chuyển và thời gian giao hàng dự kiến."
				]
			},
			{
				heading: "3. Hình thức thanh toán",
				paragraphs: [
					"Cyber Store hỗ trợ đa dạng phương thức thanh toán thuận tiện: Thanh toán tiền mặt khi nhận hàng (COD), hoặc Thanh toán trực tuyến an toàn qua cổng VNPay (hỗ trợ ATM, Thẻ quốc tế, QR Code)."
				]
			}
		]
	},
	"chinh-sach-bao-mat": {
		title: "Chính Sách Bảo Mật Thông Tin",
		sections: [
			{
				heading: "1. Mục đích thu thập thông tin",
				paragraphs: [
					"Cyber Store thu thập thông tin khách hàng (bao gồm email, tên, số điện thoại, địa chỉ giao nhận) nhằm cung cấp dịch vụ giao hàng chính xác, chăm sóc khách hàng tốt hơn, và gửi các thông tin ưu đãi mới nhất.",
					"Khách hàng có trách nhiệm bảo mật tài khoản cá nhân và mật khẩu của mình trên website."
				]
			},
			{
				heading: "2. Phạm vi sử dụng thông tin",
				paragraphs: [
					"Chúng tôi chỉ sử dụng thông tin khách hàng trong nội bộ hệ thống Cyber Store hoặc cung cấp cho đối tác vận chuyển để thực hiện việc giao nhận đơn hàng.",
					"Không chia sẻ, bán hay chuyển giao thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào khác ngoài mục đích giao hàng khi chưa có sự đồng ý của khách hàng."
				]
			},
			{
				heading: "3. Cam kết bảo mật dữ liệu",
				paragraphs: [
					"Thông tin của khách hàng được lưu trữ an toàn bằng hệ thống cơ sở dữ liệu mã hóa. Chúng tôi cam kết bảo vệ dữ liệu khách hàng trước mọi hành vi truy cập trái phép hoặc phát tán thông tin."
				]
			}
		]
	},
	"chinh-sach-doi-tra": {
		title: "Chính Sách Đổi Trả & Hoàn Tiền",
		sections: [
			{
				heading: "1. Điều kiện đổi trả hàng",
				paragraphs: [
					"Sản phẩm được hỗ trợ đổi trả trong vòng 30 ngày kể từ ngày nhận hàng thành công.",
					"Yêu cầu sản phẩm còn nguyên hộp (seal), phụ kiện đi kèm, quà tặng kèm (nếu có), không có dấu hiệu trầy xước, va đập hoặc bị can thiệp kỹ thuật phần cứng."
				]
			},
			{
				heading: "2. Các trường hợp được đổi trả miễn phí",
				paragraphs: [
					"Sản phẩm bị lỗi kỹ thuật từ phía nhà sản xuất (được kiểm tra và xác nhận bởi kỹ thuật viên Cyber Store).",
					"Sản phẩm giao không đúng mẫu mã, màu sắc hoặc thiếu phụ kiện so với đơn hàng đã đặt."
				]
			},
			{
				heading: "3. Quy trình hoàn tiền",
				paragraphs: [
					"Đối với các đơn hàng thanh toán trực tuyến qua VNPay, tiền hoàn sẽ được chuyển về thẻ thanh toán của quý khách trong vòng 3-7 ngày làm việc kể từ lúc nhận lại sản phẩm hợp lệ.",
					"Đối với COD, quý khách vui lòng cung cấp số tài khoản ngân hàng để thực hiện chuyển khoản hoàn tiền."
				]
			}
		]
	},
	"chinh-sach-bao-hanh": {
		title: "Chính Sách Bảo Hành Chính Hãng",
		sections: [
			{
				heading: "1. Thời hạn bảo hành",
				paragraphs: [
					"Tất cả các sản phẩm điện thoại, laptop, máy tính bảng mua tại Cyber Store đều được hưởng chính sách bảo hành 12 tháng chính hãng của nhà sản xuất (hoặc theo quy định cụ thể của từng dòng sản phẩm).",
					"Phụ kiện đi kèm như sạc, cáp, tai nghe được bảo hành đổi mới trong vòng 6 tháng đầu nếu xảy ra lỗi kỹ thuật."
				]
			},
			{
				heading: "2. Các trường hợp không được bảo hành",
				paragraphs: [
					"Sản phẩm bị nứt vỡ, cấn móp, hư hỏng do tác động vật lý (rơi rớt, va đập, vô nước) hoặc sử dụng sai quy cách khuyến cáo.",
					"Sản phẩm đã bị tháo dỡ, sửa chữa tại các cơ sở dịch vụ không thuộc hệ thống ủy quyền của Cyber Store."
				]
			},
			{
				heading: "3. Địa điểm tiếp nhận bảo hành",
				paragraphs: [
					"Quý khách có thể mang trực tiếp sản phẩm đến các showroom của Cyber Store, hoặc liên hệ bộ phận hỗ trợ bảo hành qua hotline 1900 232 465 để được hỗ trợ thủ tục gửi bảo hành qua đường bưu điện miễn phí."
				]
			}
		]
	}
};

const SIDEBAR_ITEMS = [
	{ name: "Tuyển dụng", slug: "tuyen-dung", path: "/info/tuyen-dung" },
	{ name: "Chính sách bán hàng", slug: "chinh-sach-ban-hang", path: "/info/chinh-sach-ban-hang" },
	{ name: "Chính sách bảo mật", slug: "chinh-sach-bao-mat", path: "/info/chinh-sach-bao-mat" },
	{ name: "Chính sách đổi trả", slug: "chinh-sach-doi-tra", path: "/info/chinh-sach-doi-tra" },
	{ name: "Chính sách bảo hành", slug: "chinh-sach-bao-hanh", path: "/info/chinh-sach-bao-hanh" },
	{ name: "Giới thiệu chúng tôi", slug: "about", path: "/about" },
	{ name: "Liên hệ & Góp ý", slug: "contact", path: "/contact" }
];

export default function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = use(params);
	const data = POLICY_CONTENTS[slug];

	if (!data) {
		notFound();
	}

	return (
		<div className="w-full bg-white min-h-screen font-sans">
			<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8 md:py-[40px]">
				<div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
					
					{/* Sidebar Navigation */}
					<aside className="border-r border-gray-100 pr-6 hidden md:block">
						<h3 className="text-lg font-bold text-black mb-6">Mục lục thông tin</h3>
						<nav className="flex flex-col gap-2">
							{SIDEBAR_ITEMS.map((item) => {
								const isActive = item.slug === slug;
								return (
									<Link
										key={item.slug}
										href={item.path}
										className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left block
											${isActive 
												? "bg-black text-white" 
												: "text-gray-600 hover:bg-gray-50 hover:text-black"
											}`}
									>
										{item.name}
									</Link>
								);
							})}
						</nav>
					</aside>

					{/* Main Content Area */}
					<main className="max-w-3xl">
						{/* Mobile navigation links */}
						<div className="mb-6 md:hidden">
							<label htmlFor="mobile-nav" className="block text-xs font-bold text-gray-400 uppercase mb-2">
								Xem thông tin khác
							</label>
							<select
								id="mobile-nav"
								defaultValue={slug}
								onChange={(e) => {
									const item = SIDEBAR_ITEMS.find(i => i.slug === e.target.value);
									if (item) {
										window.location.href = item.path;
									}
								}}
								className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
							>
								{SIDEBAR_ITEMS.map(item => (
									<option key={item.slug} value={item.slug}>
										{item.name}
									</option>
								))}
							</select>
						</div>

						{/* Content */}
						<article className="space-y-8">
							<header className="border-b border-gray-100 pb-4">
								<h1 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight leading-tight">
									{data.title}
								</h1>
							</header>

							<div className="space-y-6">
								{data.sections.map((section, idx) => (
									<section key={idx} className="space-y-3">
										<h2 className="text-lg font-bold text-gray-900">
											{section.heading}
										</h2>
										<div className="space-y-2 text-gray-600 text-sm md:text-base leading-relaxed">
											{section.paragraphs.map((p, pIdx) => (
												<p key={pIdx}>{p}</p>
											))}
										</div>
									</section>
								))}
							</div>
						</article>
					</main>

				</div>
			</div>
		</div>
	);
}
