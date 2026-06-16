"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { FaHeadphones, FaGift, FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function Header() {
	const t = useTranslations("header");
	const router = useRouter();
	const pathname = usePathname();
	const { isAuthenticated } = useSelector((state) => state.user);
	const locale = useLocale();
	const [searchQuery, setSearchQuery] = useState("");
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
	const userInfo = useSelector((state) => state.user.userInfo);
	const generalData = useSelector((state) => state.generalData);

	const searchParams = useSearchParams();
	const query = searchParams.get("query");

	const currentLocale = locale;
	const restOfPath = pathname.split("/").slice(2).join("/");
	// const imageUrl = ;
	console.log(generalData?.website_logo, "logo from redux")

	/**
	 * Change language and navigate to new locale
	 * @param {string} lang - Target language code
	 */
	const changeLanguage = (lang) => {
		const newPath = `/${lang}/${restOfPath}`;
		router.push(newPath);
	};
	const cartItems = useSelector((state) => state.cart.cart_items);

	/**
	 * Handle search form submission
	 * @param {Event} e - Form submission event
	 */
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			const searchPath = `/${currentLocale}/books?query=${encodeURIComponent(
				searchQuery.trim(),
			)}`;
			router.push(searchPath);
			setSearchQuery(""); // Clear the search input after submission
			setIsMobileSearchOpen(false); // Close mobile search after submission
		} else{
			router.push(`/${currentLocale}/books`);
			setIsMobileSearchOpen(false); // Close mobile search
		}
	};

	/**
	 * Handle Enter key press in search input
	 * @param {KeyboardEvent} e - Keyboard event
	 */
	const handleSearchKeyDown = (e) => {
		if (e.key === "Enter") {
			handleSearchSubmit(e);
		}
	};

	/**
	 * Toggle mobile search visibility
	 */
	const toggleMobileSearch = () => {
		setIsMobileSearchOpen(!isMobileSearchOpen);
	};

	// Update search query when URL query parameter changes
	useEffect(() => {
		if(query?.length > 0) {
			setSearchQuery(query)
		}
	}, [query])

	return (
		<header className="hidden md:block sticky top-0 z-50 bg-white shadow-sm">
			{/* Main Header Content */}
			<div className="container mx-auto px-4 py-3">
				<div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
					{/* Mobile Header Row - Hidden since navigation handles mobile UI */}
					<div className="hidden">
						{/* Mobile content moved to navigation component */}
					</div>

					{/* Desktop Logo */}
					<div className="hidden md:flex items-center">
						<Link
							href="/"
							className="transition-transform hover:scale-105">
							<div className="relative h-12 w-32">
								<Image
									src={generalData?.website_logo || "/rafi-publications.png"}
									alt="Readers Publications Logo"
									fill
									className="object-contain"
									priority
								/>
							</div>
						</Link>
					</div>

					{/* Desktop Search Bar */}
					<div className="hidden md:block flex-1 px-4 md:max-w-md">
						<form onSubmit={handleSearchSubmit} className="relative w-full">
							<Input
								type="search"
								placeholder={t("search")}
								className="w-full rounded-full border-gray-200 bg-gray-50 pl-4 pr-12 focus:border-brand-500 focus:ring-brand-500"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onKeyDown={handleSearchKeyDown}
							/>
							<Button
								type="submit"
								className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-brand-600 p-2 text-white hover:bg-brand-700"
								size="icon">
								<Search className="h-4 w-4" />
								<span className="sr-only">{t("search")}</span>
							</Button>
						</form>
					</div>

					{/* Desktop Navigation Icons */}
					<div className="hidden md:flex flex-wrap items-center justify-center gap-4 md:gap-6">
						{/* Language Switcher - Desktop Only */}
						<div className="flex items-center space-x-2">
							<span className="text-sm font-medium">En</span>
							<div
								className="relative h-5 w-10 cursor-pointer rounded-full bg-gray-200 transition-colors"
								onClick={() =>
									changeLanguage(
										currentLocale === "en" ? "bn" : "en",
									)
								}>
								<div
									className={`absolute top-0 h-5 w-5 rounded-full bg-brand-600 shadow-md transition-all ${
										currentLocale === "en"
											? "right-0"
											: "left-0"
									}`}></div>
							</div>
							<span className="text-sm font-medium">বাংলা</span>
						</div>

						<Link
							href={`/${currentLocale}/support`}
							className="group flex flex-col items-center transition-transform hover:scale-105"
							aria-label={t("support")}>
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 p-1.5 text-brand-600 transition-colors group-hover:bg-brand-100">
								<FaHeadphones />
							</div>
							<span className="mt-1 text-xs font-medium">
								{t("support")}
							</span>
						</Link>
						<Link
							href={`/${currentLocale}/wishlist`}
							className="group flex flex-col items-center transition-transform hover:scale-105"
							aria-label={t("wishlist")}>
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 p-1.5 text-brand-600 transition-colors group-hover:bg-brand-100">
								<FaGift />
							</div>
							<span className="mt-1 text-xs font-medium">
								{t("wishlist")}
							</span>
						</Link>
						<Link
							href={`/${currentLocale}/cart`}
							className="group flex flex-col items-center transition-transform hover:scale-105"
							aria-label={t("cart")}>
							<div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 p-1.5 text-brand-600 transition-colors group-hover:bg-brand-100">
								<FaShoppingCart />
								{cartItems && cartItems.length > 0 && (
									<span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold leading-none shadow">
										{cartItems.length > 9
											? "9+"
											: cartItems.length}
									</span>
								)}
							</div>
							<span className="mt-1 text-xs font-medium">
								{t("cart")}
							</span>
						</Link>

						{/* Desktop Auth Buttons */}
						<div className="flex items-center space-x-4">
							{isAuthenticated ? (
								<Link
									href={`/${currentLocale}/profile`}
									className="flex flex-col items-center text-sm font-medium text-gray-700 hover:text-brand-700">
									<div className="h-8 w-8 rounded-full bg-brand-50 overflow-hidden flex items-center justify-center">
										<Image
											src={
												userInfo?.profile_picture ||
												"/default_profile.png"
											}
											alt={t("profile")}
											width={40}
											height={40}
											className="object-cover h-full w-full"
										/>
									</div>
									<span className="mt-1">{t("profile")}</span>
								</Link>
							) : (
								<>
									<Link href={`/${currentLocale}/signin`}>
										<Button size="sm">{t("signIn")}</Button>
									</Link>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
