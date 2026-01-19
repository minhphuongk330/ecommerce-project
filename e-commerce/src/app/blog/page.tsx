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
		title: "10 Essential Tech Gadgets for 2025",
		excerpt:
			"Discover the must-have technology gadgets that will enhance your daily life and keep you connected in the modern world.",
		date: "January 15, 2025",
		category: "Technology",
		slug: "essential-tech-gadgets-2025",
	},
	{
		id: 2,
		title: "How to Choose the Perfect Smartphone",
		excerpt: "A comprehensive guide to help you find the smartphone that best fits your needs, budget, and lifestyle.",
		date: "January 10, 2025",
		category: "Guides",
		slug: "choose-perfect-smartphone",
	},
	{
		id: 3,
		title: "Sustainable Shopping: Making Eco-Friendly Choices",
		excerpt: "Learn how to make more environmentally conscious purchasing decisions and reduce your carbon footprint.",
		date: "January 5, 2025",
		category: "Lifestyle",
		slug: "sustainable-shopping",
	},
	{
		id: 4,
		title: "The Future of E-Commerce: Trends to Watch",
		excerpt:
			"Explore the latest trends shaping the future of online shopping and how they're changing the retail landscape.",
		date: "December 28, 2023",
		category: "Business",
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
			Read more
			<svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
			</svg>
		</Link>
	</article>
);

export default function BlogPage() {
	return (
		<div className="w-full bg-white min-h-screen">
			<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8 md:py-[80px]">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl md:text-4xl font-bold text-black mb-4 md:mb-6">Blog</h1>
					<p className="text-base md:text-lg text-gray-600 mb-8 md:mb-12">
						Stay updated with the latest news, tips, and insights from our team.
					</p>
					<div className="space-y-8 md:space-y-12">
						{BLOG_POSTS.map(post => (
							<BlogPostItem key={post.id} post={post} />
						))}
					</div>
					<div className="mt-12 md:mt-16 text-center">
						<p className="text-base md:text-lg text-gray-600">More articles coming soon. Stay tuned!</p>
					</div>
				</div>
			</div>
		</div>
	);
}
