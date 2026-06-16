import Link from "next/link";
import { routerPaths } from "~/utils/router";

interface BlogPost {
	id: number;
	title: string;
	excerpt: string;
	date: string;
	category: string;
	slug: string;
}

const BLOG_POSTS: BlogPost[] = [
	{
		id: 1,
		title: "10 thiết bị công nghệ không thể thiếu năm 2025",
		excerpt: "Khám phá những thiết bị công nghệ bạn nhất định phải có để nâng cao cuộc sống hàng ngày và luôn kết nối với thế giới hiện đại.",
		date: "15 tháng 1, 2025",
		category: "Công nghệ",
		slug: "essential-tech-gadgets-2025",
	},
	{
		id: 2,
		title: "Cách chọn smartphone phù hợp với bạn",
		excerpt: "Hướng dẫn toàn diện giúp bạn tìm ra chiếc điện thoại phù hợp nhất với nhu cầu, ngân sách và phong cách sống.",
		date: "10 tháng 1, 2025",
		category: "Hướng dẫn",
		slug: "choose-perfect-smartphone",
	},
	{
		id: 3,
		title: "Mua sắm thông minh: Tiết kiệm mà vẫn chất lượng",
		excerpt: "Những mẹo hay giúp bạn mua được sản phẩm tốt với giá hợp lý, tránh bẫy hàng kém chất lượng.",
		date: "5 tháng 1, 2025",
		category: "Mẹo hay",
		slug: "sustainable-shopping",
	},
	{
		id: 4,
		title: "Xu hướng thương mại điện tử 2025",
		excerpt: "Khám phá những xu hướng mới nhất đang định hình tương lai của mua sắm trực tuyến và cách chúng thay đổi thị trường bán lẻ.",
		date: "28 tháng 12, 2024",
		category: "Kinh doanh",
		slug: "future-ecommerce-trends",
	},
];

const BlogPostItem = ({ post }: { post: BlogPost }) => (
	<article className="border-b border-gray-200 pb-8 md:pb-12 last:border-0 last:pb-0">
		<div className="flex items-center gap-3 mb-3">
			<span className="text-xs md:text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
				{post.category}
			</span>
			<span className="text-xs md:text-sm text-gray-400">{post.date}</span>
		</div>
		<h2 className="text-xl md:text-2xl font-bold text-black mb-3 md:mb-4 hover:text-gray-600 transition-colors">
			<Link href={`${routerPaths.blog}/${post.slug}`}>{post.title}</Link>
		</h2>
		<p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">{post.excerpt}</p>
		<Link
			href={`${routerPaths.blog}/${post.slug}`}
			className="inline-flex items-center text-sm md:text-base font-medium text-black hover:text-gray-600 transition-colors"
		>
			Đọc thêm
			<svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
			</svg>
		</Link>
	</article>
);

export default function BlogPage() {
	return (
		<div className="w-full bg-white min-h-screen font-sans">
			<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8 md:py-[40px]">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl md:text-4xl font-bold text-black mb-4 md:mb-6">Blog</h1>
					<p className="text-base md:text-lg text-gray-600 mb-8 md:mb-12">
						Cập nhật tin tức, mẹo hay và kiến thức công nghệ mới nhất từ đội ngũ của chúng tôi.
					</p>
					<div className="space-y-8 md:space-y-12">
						{BLOG_POSTS.map(post => (
							<BlogPostItem key={post.id} post={post} />
						))}
					</div>
					<div className="mt-12 md:mt-16 text-center">
						<p className="text-base md:text-lg text-gray-600">Sẽ có thêm bài viết mới sớm. Hãy đón chờ!</p>
					</div>
				</div>
			</div>
		</div>
	);
}
