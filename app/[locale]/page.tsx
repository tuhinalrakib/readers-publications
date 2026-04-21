"use client";

import Link from "next/link";
import { CircleNav } from "@/components/circle-nav";
import { MainCarousel } from "@/components/main-carousel";
import { SpecialOffersCarousel } from "@/components/special-offers-carousel";
import { TestimonialsSlider } from "@/components/testimonials-slider";
import { useEffect, useState, Suspense } from "react";
import useHttp from "@/hooks/useHttp";
import { API_ENDPOINTS } from "@/constants/apiEnds";
import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";

// Dynamic imports for better code splitting
const DynamicNewsGrid = dynamic(
	() => import("@/components/news-grid").then((mod) => mod.NewsGrid),
	{
		loading: () => (
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
				{Array.from({ length: 8 }).map((_, idx) => (
					<div key={idx} className="animate-pulse">
						<div className="bg-gray-200 rounded-lg aspect-[3/4] mb-3 sm:mb-4"></div>
						<div className="space-y-2">
							<div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
							<div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
						</div>
					</div>
				))}
			</div>
		),
	},
);

/**
 * Home page component that displays the main landing page with categories,
 * carousels, book sections, and other promotional content
 */
export default function Home() {
	const t = useTranslations("home");
	const locale = useLocale();
	const [categories, setCategories] = useState<any[]>([]);
	const [carouselItems, setCarouselItems] = useState<any[]>([]);
	const { sendRequests: fetchCategories, isLoading } = useHttp();
	const { sendRequests: fetchCarousel, isLoading: isCarouselLoading } =
		useHttp();
	const generalData = useSelector((state: any) => state.generalData);
	const [newArrivalBooks, setNewArrivalBooks] = useState<any[]>([]);
	const [popularBooks, setPopularBooks] = useState<any[]>([]);
	const [comingSoonBooks, setComingSoonBooks] = useState<any[]>([]);
	const [bestSellingBooks, setBestSellingBooks] = useState<any[]>([]);
	const { sendRequests: fetchBooks, isLoading: isBooksLoading } = useHttp();
	
console.log(popularBooks)
	/**
	 * Fetch featured categories on component mount
	 */
	useEffect(() => {
		fetchCategories(
			{
				url_info: {
					url: API_ENDPOINTS.CATEGORIES + "?is_featured=true",
				},
			},
			(res: any) => {
				setCategories(res);
				// console.log(res);
			},
		);
	}, []);

	/**
	 * Fetch carousel items for the main banner
	 */
	useEffect(() => {
		fetchCarousel(
			{
				url_info: {
					url: API_ENDPOINTS.HOME_CAROUSEL,
				},
			},
			(res: any) => {
				setCarouselItems(res);
			},
		);
	}, []);

	/**
	 * Fetch featured books for different sections
	 */
	useEffect(() => {
		fetchBooks(
			{
				url_info: {
					url:
						API_ENDPOINTS.BOOKS +
						"?pagination=false&is_featured=true",
				},
			},
			(res: any) => {
				setPopularBooks(res.popular);
				setNewArrivalBooks(res.new_arrival);
				setComingSoonBooks(res.comming_soon);
				setBestSellingBooks(res.best_seller);
			},
		);
	}, []);

	/**
	 * Renders a clean section header with proper styling
	 */
	const SectionHeader = ({ 
		title, 
		linkHref, 
		linkText, 
		subtitle,
		variant = "default"
	}: { 
		title: string; 
		linkHref: string; 
		linkText: string;
		subtitle?: string;
		variant?: "default" | "emerald" | "amber" | "blue" | "violet" | "purple";
	}) => {
		const getVariantClasses = (variant: string) => {
			switch (variant) {
				case "emerald":
					return {
						accent: "bg-emerald-500",
						link: "text-emerald-600 hover:text-emerald-700"
					};
				case "amber":
					return {
						accent: "bg-amber-500",
						link: "text-amber-600 hover:text-amber-700"
					};
				case "blue":
					return {
						accent: "bg-blue-500",
						link: "text-blue-600 hover:text-blue-700"
					};
				case "violet":
					return {
						accent: "bg-violet-500",
						link: "text-violet-600 hover:text-violet-700"
					};
				case "purple":
					return {
						accent: "bg-purple-500",
						link: "text-purple-600 hover:text-purple-700"
					};
				default:
					return {
						accent: "bg-slate-500",
						link: "text-slate-600 hover:text-slate-700"
					};
			}
		};

		const classes = getVariantClasses(variant);

		return (
			<div className="mb-2">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
					<div className="space-y-3">
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
							{title}
						</h2>
						
						<div className="flex items-center gap-2">
							<div className={`h-1 w-16 ${classes.accent} rounded-full`} />
							<div className={`h-1 w-8 ${classes.accent} opacity-60 rounded-full`} />
							<div className={`h-1 w-4 ${classes.accent} opacity-30 rounded-full`} />
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<main className="min-h-screen bg-gray-50">
			{/* Categories Section */}
			{categories?.length > 0 ? (
				<section className="py-2 sm:py-4 bg-white border-b border-gray-200">
					<div className="container mx-auto px-3 sm:px-4 md:px-6">
				<div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
					{isLoading ? (
						Array.from({ length: 6 }).map((_, idx) => (
							<div key={idx} className="flex flex-col items-center w-16 sm:w-20 md:w-24">
								<div className="mb-2 sm:mb-3 md:mb-4 aspect-square w-full rounded-full bg-gray-200 animate-pulse" />
								<div className="h-2 sm:h-3 md:h-4 w-full rounded bg-gray-200 animate-pulse" />
							</div>
						))
					) : (
								<>
									{categories.map((category, index) => (
										<div
											key={category.slug}
											className="group transform hover:scale-105 transition-transform duration-300"
										>
											<CircleNav
												href={"/books?category=" + category.id}
												title={category?.name}
												title_bn={category?.name_bn}
												imageUrl={`http://${category?.image_url}` || ""}
												className="shadow-md hover:shadow-lg transition-shadow duration-300 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
											/>
										</div>
									))}
									{categories?.length > 0 && (
										<div className="group transform hover:scale-105 transition-transform duration-300">
											<CircleNav
												title="More View"
												title_bn="আরও দেখুন"
												imageUrl="/menu.png"
												className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md hover:shadow-lg transition-shadow duration-300 scale-75 sm:scale-90 md:scale-100"
											/>
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</section>
			) : null}

			{/* Main Carousel */}
			<section className="relative">
				<MainCarousel
					carouselItems={carouselItems}
					isLoading={isCarouselLoading}
				/>
			</section>

			{/* New Arrivals Section */}
			{newArrivalBooks?.length > 0 && (
				<section className="py-6 bg-emerald-50/50">
					<div className="container mx-auto px-3 sm:px-4 md:px-6">
						<SectionHeader 
							title={t("new_books")}
							subtitle="Fresh releases and latest additions to our collection"
							linkHref={`${locale}/books/`}
							linkText={t("all_books")}
							variant="emerald"
						/>
						<DynamicNewsGrid
							book_type="new_arrival"
							books={newArrivalBooks}
						/>
					</div>
				</section>
			)}

			{/* Popular Books Section */}
			{popularBooks?.length > 0 && (
				<section className="py-6 bg-white">
					<div className="container mx-auto px-3 sm:px-4 md:px-6">
						<SectionHeader 
							title={t("popular_books")}
							subtitle="Reader favorites and trending titles everyone's talking about"
							linkHref={`${locale}/books/`}
							linkText={t("all_books")}
							variant="amber"
						/>
						<DynamicNewsGrid
							book_type="popular"
							books={popularBooks}
						/>
					</div>
				</section>
			)}

			{/* Special Offers Section */}
			
				<Suspense
					fallback={
						<div className="container mx-auto px-3 sm:px-4 md:px-6">
							<div className="animate-pulse h-48 sm:h-56 md:h-64 bg-gray-200 rounded-lg" />
						</div>
					}>
					<SpecialOffersCarousel />
				</Suspense>

			{/* Best Selling Section */}
			{bestSellingBooks?.length > 0 && (
				<section className="py-6 bg-white">
					<div className="container mx-auto px-3 sm:px-4 md:px-6">
						<SectionHeader 
							title={t("best_selling_books")}
							subtitle="Top-rated books that have captured readers' hearts worldwide"
							linkHref={`${locale}/books/`}
							linkText={t("all_books")}
							variant="blue"
						/>
						<DynamicNewsGrid
							book_type="best_selling"
							books={bestSellingBooks}
						/>
					</div>
				</section>
			)}

			{/* Coming Soon Section */}
			{comingSoonBooks?.length > 0 && (
				<section className="py-6 bg-violet-50/50">
					<div className="container mx-auto px-3 sm:px-4 md:px-6">
						<SectionHeader 
							title={t("coming_soon")}
							subtitle="Highly anticipated releases and pre-order opportunities"
							linkHref={`${locale}/books/`}
							linkText={t("all_books")}
							variant="violet"
						/>
						<DynamicNewsGrid
							book_type="coming_soon"
							books={comingSoonBooks}
						/>
					</div>
				</section>
			)}

			{/* Testimonials Section */}
			<section className="py-6 bg-blue-50/50">
				<Suspense
					fallback={
					<div className="container mx-auto px-3 sm:px-4 md:px-6">
						<div className="animate-pulse h-32 sm:h-40 md:h-48 bg-gray-200 rounded-lg" />
					</div>
				}>
					<TestimonialsSlider />
				</Suspense>
			</section>
		</main>
	);
}
