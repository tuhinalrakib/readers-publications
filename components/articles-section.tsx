"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import useHttp from "@/hooks/useHttp";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, useRef } from "react";
import { API_ENDPOINTS } from "@/constants/apiEnds";

export function ArticlesSection({ generalData }: { generalData: any }) {
	const [articles, setArticles] = useState<any[]>([]);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const { sendRequests: fetchArticles, isLoading } = useHttp();
	const locale = useLocale();
	const t = useTranslations("home");

	useEffect(() => {
		fetchArticles(
			{
				url_info: {
					url: API_ENDPOINTS.BLOG_LIST + "?is_featured=True",
				},
			},
			(data: any) => {
				setArticles(data.results);
			},
		);
	}, []);

	const checkScrollButtons = () => {
		if (scrollContainerRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } =
				scrollContainerRef.current;
			setCanScrollLeft(scrollLeft > 0);
			setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
		}
	};

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			const cardWidth =
				scrollContainerRef.current.children[0]?.clientWidth || 300;
			const gap = 24; // 1.5rem gap
			const scrollAmount = cardWidth + gap;
			scrollContainerRef.current.scrollBy({
				left: -scrollAmount * 2, // Scroll 2 cards at a time
				behavior: "smooth",
			});
		}
	};

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			const cardWidth =
				scrollContainerRef.current.children[0]?.clientWidth || 300;
			const gap = 24; // 1.5rem gap
			const scrollAmount = cardWidth + gap;
			scrollContainerRef.current.scrollBy({
				left: scrollAmount * 2, // Scroll 2 cards at a time
				behavior: "smooth",
			});
		}
	};

	useEffect(() => {
		const container = scrollContainerRef.current;
		if (container) {
			checkScrollButtons();
			container.addEventListener("scroll", checkScrollButtons);
			window.addEventListener("resize", checkScrollButtons);

			return () => {
				container.removeEventListener("scroll", checkScrollButtons);
				window.removeEventListener("resize", checkScrollButtons);
			};
		}
	}, [articles]);

	if (articles.length === 0) return null;

	return (
		<section className="py-12 bg-gradient-to-r from-white to-gray-50">
			<div className="container mx-auto px-4">
				<div className="p-6">
					<h2 className="text-2xl font-bold mb-2">
						{locale === "bn" && generalData?.title_bn
							? generalData?.title_bn
							: generalData?.title || "Latest Articles"}
					</h2>
					<p className="text-gray-900">
						{locale === "bn" && generalData?.subtitle_bn
							? generalData?.subtitle_bn
							: generalData?.subtitle ||
							  "Explore our latest articles on various topics, including book reviews, author interviews, and literary insights."}
					</p>
				</div>

				<div className="p-6 relative">
					{/* Loading State */}
					{isLoading && (
						<div className="flex justify-center items-center py-12">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						</div>
					)}

					{/* Navigation Buttons */}

					<Button
						variant="outline"
						size="icon"
						className={`absolute left-2 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl ${
							!canScrollLeft
								? "opacity-50 cursor-not-allowed"
								: "hover:scale-110"
						}`}
						onClick={scrollLeft}
						disabled={!canScrollLeft}>
						<ChevronLeft className="h-5 w-5" />
					</Button>

					<Button
						variant="outline"
						size="icon"
						className={`absolute right-2 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl ${
							!canScrollRight
								? "opacity-50 cursor-not-allowed"
								: "hover:scale-110"
						}`}
						onClick={scrollRight}
						disabled={!canScrollRight}>
						<ChevronRight className="h-5 w-5" />
					</Button>

					{/* Carousel Container */}
					<div
						ref={scrollContainerRef}
						className="flex gap-6 overflow-x-auto scroll-smooth px-4 py-2 scrollbar-hide"
						style={{
							scrollbarWidth: "none",
							msOverflowStyle: "none",
						}}>
						{articles.map((article) => (
							<Link
								key={article.id}
								href={`/blog/${article.slug}`}
								className="flex-none">
								<Card className="w-72 sm:w-80 md:w-84 lg:w-88 h-full hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1">
									<CardContent className="p-0">
										<div className="relative overflow-hidden">
											<Image
												src={
													article.cover_image ||
													"/placeholder.svg?height=200&width=300"
												}
												alt={
													locale === "bn" &&
													article.title_bn
														? article.title_bn
														: article.title
												}
												width={300}
												height={200}
												className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
											/>
											{article.category && (
												<Badge className="absolute top-3 left-3 bg-blue-500 hover:bg-blue-600 text-white">
													{article.category}
												</Badge>
											)}
										</div>
										<div className="p-4 space-y-3">
											<h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
												{locale === "bn" &&
												article.title_bn
													? article.title_bn
													: article.title}
											</h3>
											<p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
												{locale === "bn" &&
												article.subtitle_bn
													? article.subtitle_bn
													: article.subtitle}
											</p>
											<div className="flex items-center justify-between text-xs text-gray-500 pt-2">
												<div className="flex items-center gap-1">
													<User className="w-3 h-3" />
													<span className="truncate max-w-24">
														{locale === "bn" &&
														article.author_name_bn
															? article.author_name_bn
															: article.author_name}
													</span>
												</div>
												<div className="flex items-center gap-1">
													<Calendar className="w-3 h-3" />
													<span>
														{article.published_date}
													</span>
												</div>
											</div>
											{article.read_time && (
												<div className="text-xs text-blue-600 font-medium">
													Read time:{" "}
													{article.read_time}
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>

					{/* View All Button */}
					<div className="text-center mt-8">
						<Link
							href="/blog"
							className="inline-flex items-center px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium shadow-md hover:shadow-lg">
							{t("read_all_articles") || "Read all Articles"} →
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}

export default ArticlesSection;
