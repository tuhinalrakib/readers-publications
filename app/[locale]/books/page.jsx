"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetClose,
} from "@/components/ui/sheet";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale, useTranslations } from "next-intl";
import useHttp from "@/hooks/useHttp";
import { API_ENDPOINTS } from "@/constants/apiEnds";
import {
	Loader2,
	Filter,
	X,
	ChevronLeft,
	ChevronRight,
	SlidersHorizontal,
	ShoppingCart,
	Plus,
	Search,
	Grid3X3,
	List,
	Heart,
	Star,
} from "lucide-react";
import useCart from "@/hooks/useCart";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

// Enhanced loading skeleton component
const BookCardSkeleton = ({ viewMode = "grid" }) => {
	if (viewMode === "list") {
		return (
			<Card className="group overflow-hidden">
				<CardContent className="p-4">
					<div className="flex gap-4">
						<div className="w-20 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md animate-pulse flex-shrink-0" />
						<div className="flex-1 space-y-3">
							<div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
							<div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 animate-pulse" />
							<div className="flex justify-between items-center">
								<div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3 animate-pulse" />
								<div className="flex gap-2">
									<div className="h-6 w-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
									<div className="h-6 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="group overflow-hidden">
			<div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
			<CardContent className="p-4 space-y-3">
				<div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
				<div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 animate-pulse" />
				<div className="flex justify-between items-center">
					<div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse" />
					<div className="h-6 w-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
				</div>
			</CardContent>
		</Card>
	);
};

// Enhanced filter section component
const FilterSection = ({
	categories,
	authors,
	filterParams,
	onCategoryChange,
	onAuthorChange,
	onPriceChange,
	onClearFilters,
	isLoadingCategories,
	isLoadingAuthors,
	locale,
	t,
}) => {
	const [searchCategory, setSearchCategory] = useState("");
	const [searchAuthor, setSearchAuthor] = useState("");

	const activeFiltersCount =
		filterParams.category.length +
		filterParams.author.length +
		(filterParams.price.min > 0 || filterParams.price.max > 0 ? 1 : 0);

	const filteredCategories = categories.filter((category) =>
		(locale === "bn" ? category?.name_bn || "" : category?.name || "")
			.toLowerCase()
			.includes(searchCategory.toLowerCase()),
	);

	const filteredAuthors = authors.filter((author) =>
		(locale === "bn" ? author?.name_bn || "" : author?.name || "")
			.toLowerCase()
			.includes(searchAuthor.toLowerCase()),
	);

	return (
		<div className="space-y-4 md:space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar px-2 sm:px-3 md:px-4">
			{/* Filter Header */}
			<div className="flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-2 md:py-3">
				<div className="flex items-center gap-2 md:gap-3">
					<SlidersHorizontal className="h-4 w-4 md:h-5 md:w-5 text-teal-600" />
					<h3 className="text-base md:text-lg font-semibold text-gray-900">
						{t("filter")}
					</h3>
				</div>
				{activeFiltersCount > 0 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onClearFilters}
						className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-xs md:text-sm">
						<X className="h-3 w-3 md:h-4 md:w-4 mr-1" />
						Clear ({activeFiltersCount})
					</Button>
				)}
			</div>

			<Separator />

			{/* Categories */}
			<details className="group">
				<summary className="flex items-center justify-between cursor-pointer py-2">
					<div className="flex items-center gap-2">
						<h4 className="text-sm md:text-base font-medium text-gray-900">
							{t("category")}
						</h4>
						<Badge variant="secondary" className="text-xs">
							{filterParams.category.length}
						</Badge>
					</div>
					<ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
				</summary>

				<div className="pt-2 space-y-3">
					{/* Category Search */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-gray-400" />
						<Input
							placeholder="Search categories..."
							value={searchCategory}
							onChange={(e) => setSearchCategory(e.target.value)}
							className="pl-8 md:pl-10 text-xs md:text-sm h-8 md:h-10"
						/>
					</div>

					<div className="space-y-1 max-h-36 md:max-h-48 overflow-y-auto custom-scrollbar">
						{isLoadingCategories ? (
							<div className="flex items-center justify-center py-6 md:py-8">
								<Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin text-teal-600" />
							</div>
						) : filteredCategories.length === 0 ? (
							<p className="text-xs md:text-sm text-gray-500 text-center py-3 md:py-4">
								No categories found
							</p>
						) : (
							filteredCategories.map((category) => (
								<div
									key={category.id}
									className="flex items-center space-x-2 md:space-x-3 p-1.5 md:p-2 rounded-lg hover:bg-gray-50 transition-colors">
									<Checkbox
										id={`category-${category.id}`}
										checked={filterParams.category.includes(
											category.id.toString(),
										)}
										onCheckedChange={(checked) =>
											onCategoryChange(
												category.id.toString(),
												!!checked,
											)
										}
										className="h-3.5 w-3.5 md:h-4 md:w-4 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
									/>
									<label
										htmlFor={`category-${category.id}`}
										className="text-xs md:text-sm text-gray-700 cursor-pointer flex-1 font-medium">
										{locale === "bn"
											? category.name_bn
											: category.name}
									</label>
								</div>
							))
						)}
					</div>
				</div>
			</details>

			<Separator />

			{/* Authors */}
			<details className="group">
				<summary className="flex items-center justify-between cursor-pointer py-2">
					<div className="flex items-center gap-2">
						<h4 className="text-sm md:text-base font-medium text-gray-900">
							{t("author")}
						</h4>
						<Badge variant="secondary" className="text-xs">
							{filterParams.author.length}
						</Badge>
					</div>
					<ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
				</summary>

				<div className="pt-2 space-y-3">
					{/* Author Search */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-gray-400" />
						<Input
							placeholder="Search authors..."
							value={searchAuthor}
							onChange={(e) => setSearchAuthor(e.target.value)}
							className="pl-8 md:pl-10 text-xs md:text-sm h-8 md:h-10"
						/>
					</div>

					<div className="space-y-1 max-h-36 md:max-h-48 overflow-y-auto custom-scrollbar">
						{isLoadingAuthors ? (
							<div className="flex items-center justify-center py-6 md:py-8">
								<Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin text-teal-600" />
							</div>
						) : filteredAuthors.length === 0 ? (
							<p className="text-xs md:text-sm text-gray-500 text-center py-3 md:py-4">
								No authors found
							</p>
						) : (
							filteredAuthors.map((author) => (
								<div
									key={author.id}
									className="flex items-center space-x-2 md:space-x-3 p-1.5 md:p-2 rounded-lg hover:bg-gray-50 transition-colors">
									<Checkbox
										id={`author-${author.id}`}
										checked={filterParams.author.includes(
											author.id.toString(),
										)}
										onCheckedChange={(checked) =>
											onAuthorChange(
												author.id.toString(),
												!!checked,
											)
										}
										className="h-3.5 w-3.5 md:h-4 md:w-4 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
									/>
									<label
										htmlFor={`author-${author.id}`}
										className="text-xs md:text-sm text-gray-700 cursor-pointer flex-1 font-medium">
										{locale === "bn"
											? author.name_bn
											: author.name}
									</label>
								</div>
							))
						)}
					</div>
				</div>
			</details>

			<Separator />

			{/* Price Range */}
			<details className="group">
				<summary className="flex items-center justify-between cursor-pointer py-2">
					<h4 className="text-sm md:text-base font-medium text-gray-900">
						{t("price")}
					</h4>
					<ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
				</summary>

				<div className="pt-2 space-y-3">
					<div className="grid grid-cols-2 gap-2 md:gap-3">
						<div className="space-y-1">
							<label className="text-xs text-gray-500 font-medium">
								{t("min")}
							</label>
							<Input
								type="number"
								placeholder="0"
								value={filterParams.price.min || ""}
								onChange={(e) =>
									onPriceChange("min", e.target.value)
								}
								className="text-xs md:text-sm h-8 md:h-10"
							/>
						</div>
						<div className="space-y-1">
							<label className="text-xs text-gray-500 font-medium">
								{t("max")}
							</label>
							<Input
								type="number"
								placeholder="∞"
								value={filterParams.price.max || ""}
								onChange={(e) =>
									onPriceChange("max", e.target.value)
								}
								className="text-xs md:text-sm h-8 md:h-10"
							/>
						</div>
					</div>
					{(filterParams.price.min > 0 ||
						filterParams.price.max > 0) && (
						<div className="text-xs text-teal-600 font-medium">
							Range: ৳{filterParams.price.min || 0} - ৳
							{filterParams.price.max || "∞"}
						</div>
					)}
				</div>
			</details>
		</div>
	);
};
// Enhanced book card component
const BookCard = ({ book, locale, viewMode = "grid", onWishlistUpdate }) => {
	const { addToCart } = useCart();
	const { sendRequests: addToWishlist, isLoading: isAddingToWishlist } =
		useHttp();
	const {
		sendRequests: removeFromWishlist,
		isLoading: isRemovingFromWishlist,
	} = useHttp();

	const [localBook, setLocalBook] = useState(book);

	// Update local book state when prop changes
	useEffect(() => {
		setLocalBook(book);
	}, [book]);

	const discountPercentage =
		localBook.discounted_price &&
		localBook.discounted_price < localBook.price
			? Math.round(
					((localBook.price - localBook.discounted_price) /
						localBook.price) *
						100,
			  )
			: 0;

	const handleAddToCart = (bookData) => {
		let cartData = {
			quantity: 1,
			book_details: {
				id: bookData.id,
				slug: bookData.slug,
				title: bookData.title,
				title_bn: bookData.title_bn,
				cover_image: bookData.cover_image,
				price: bookData.price,
				discounted_price: bookData.discounted_price,
				is_available: bookData.is_available,
			},
			author_details: {
				id: bookData.author_id,
				slug: bookData.author_slug,
				name: bookData.author_full_name,
				name_bn: bookData.author_full_name_bn,
			},
		};
		addToCart(cartData, 1);
	};

	const handleWishlistToggle = () => {
		if (!localBook?.is_in_wishlist) {
			// Add to wishlist
			addToWishlist(
				{
					url_info: {
						url: API_ENDPOINTS.WISHLIST || "/api/wishlist",
					},
					method: "POST",
					data: {
						book_id: localBook.id,
					},
				},
				(data) => {
					const updatedBook = {
						...localBook,
						is_in_wishlist: true,
					};
					setLocalBook(updatedBook);
					if (onWishlistUpdate) {
						onWishlistUpdate(updatedBook);
					}
				},
				(error) => {
					console.error("Error adding to wishlist:", error);
				},
			);
		} else {
			// Remove from wishlist
			const deleteEndpoint = API_ENDPOINTS.WISHLIST_DELETE
				? API_ENDPOINTS.WISHLIST_DELETE(`book_${localBook.id}`)
				: `/api/wishlist/book_${localBook.id}`;

			removeFromWishlist(
				{
					url_info: {
						url: deleteEndpoint,
					},
					method: "DELETE",
				},
				(data) => {
					const updatedBook = {
						...localBook,
						is_in_wishlist: false,
					};
					setLocalBook(updatedBook);
					if (onWishlistUpdate) {
						onWishlistUpdate(updatedBook);
					}
				},
				(error) => {
					console.error("Error removing from wishlist:", error);
				},
			);
		}
	};

	const isWishlistLoading = isAddingToWishlist || isRemovingFromWishlist;

	if (viewMode === "list") {
		return (
			<Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4 border-l-transparent hover:border-l-teal-500">
				<CardContent className="p-4">
					<div className="flex gap-4">
						<div className="relative w-20 h-28 flex-shrink-0">
							{discountPercentage > 0 && (
								<Badge className="absolute -top-1 -left-1 z-10 bg-red-500 text-white text-xs font-bold">
									{discountPercentage}%
								</Badge>
							)}
							<Link href={`/${locale}/books/${localBook.slug}`}>
								<Image
									src={localBook?.cover_image || "/images/book-skeleton.jpg"}
									alt={localBook.title}
									fill
									className="object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
									sizes="80px"
								/>
							</Link>
						</div>
						<div className="flex-1 space-y-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-0.5">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`h-3 w-3 ${
												i < Math.floor(localBook.rating)
													? "fill-yellow-400 text-yellow-400"
													: "text-gray-200"
											}`}
										/>
									))}
									<span className="ml-1 text-xs text-gray-500">
										{localBook.rating}
									</span>
								</div>
							</div>

							<h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-teal-600 transition-colors">
								<Link
									href={`/${locale}/books/${localBook.slug}`}>
									{locale === "bn"
										? localBook.title_bn
										: localBook.title}
								</Link>
							</h3>
							<p className="text-sm text-gray-600">
								<Link
									href={`/${locale}/authors/${localBook.author_slug}`}
									className="hover:text-teal-600 transition-colors">
									{locale === "bn"
										? localBook.author_full_name_bn
										: localBook.author_full_name}
								</Link>
							</p>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									{localBook.discounted_price &&
									localBook.discounted_price <
										localBook.price ? (
										<>
											<span className="font-bold text-teal-600">
												৳{localBook.discounted_price}
											</span>
											<span className="text-sm text-gray-500 line-through">
												৳{localBook.price}
											</span>
										</>
									) : (
										<span className="font-bold text-teal-600">
											৳{localBook.price}
										</span>
									)}
								</div>
								<div className="flex items-center gap-2">
									<Button
										size="sm"
										variant="ghost"
										onClick={handleWishlistToggle}
										disabled={isWishlistLoading}
										className={`h-8 w-8 p-0 transition-colors ${
											localBook.is_in_wishlist
												? "text-red-500 hover:text-red-600"
												: "text-gray-400 hover:text-red-500"
										}`}>
										{isWishlistLoading ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<Heart
												className={`h-4 w-4 ${
													localBook.is_in_wishlist
														? "fill-current"
														: ""
												}`}
											/>
										)}
									</Button>
									<Button
										size="sm"
										onClick={() =>
											handleAddToCart(localBook)
										}
										className="bg-teal-600 hover:bg-teal-700 text-white">
										<ShoppingCart className="h-4 w-4 mr-1" />
										Add
									</Button>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-sm hover:shadow-teal-100/50">
			<div className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100">
				{discountPercentage > 0 && (
					<Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold shadow-lg">
						{discountPercentage}% OFF
					</Badge>
				)}

				{/* Action Buttons */}
				

				<Link href={`/${locale}/books/${localBook.slug}`}>
					<Image
						src={localBook.cover_image || "/images/book-skeleton.jpg"}
						alt={localBook.title}
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-110"
						sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
					/>
				</Link>

				{/* Overlay on hover */}
				<Link href={`/${locale}/books/${localBook.slug}`}>
					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
				</Link>
			</div>

			<CardContent className="p-4 space-y-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-0.5">
						{[...Array(5)].map((_, i) => (
							<Star
								key={i}
								className={`h-3 w-3 ${
									i < Math.floor(localBook.rating)
										? "fill-yellow-400 text-yellow-400"
										: "text-gray-200"
								}`}
							/>
						))}
						<span className="ml-1 text-xs text-gray-500">
							{localBook.rating}
						</span>
					</div>
				</div>
				<h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-teal-600 transition-colors text-sm leading-tight">
					<Link href={`/${locale}/books/${localBook.slug}`}>
						{locale === "bn" ? localBook.title_bn : localBook.title}
					</Link>
				</h3>
				<p className="text-xs text-gray-600 line-clamp-1">
					<Link
						href={`/${locale}/authors/${localBook.author_slug}`}
						className="hover:text-teal-600 transition-colors">
						{locale === "bn"
							? localBook.author_full_name_bn
							: localBook.author_full_name}
					</Link>
				</p>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						{localBook.discounted_price &&
						localBook.discounted_price < localBook.price ? (
							<>
								<span className="font-bold text-teal-600 text-sm">
									৳{localBook.discounted_price}
								</span>
								<span className="text-xs text-gray-500 line-through">
									৳{localBook.price}
								</span>
							</>
						) : (
							<span className="font-bold text-teal-600 text-sm">
								৳{localBook.price}
							</span>
						)}
					</div>

					{/* Mobile Cart Button */}
					<Button
						size="sm"
						onClick={() => handleAddToCart(localBook)}
						className="h-8 w-8 p-0 bg-teal-600 hover:bg-teal-700 text-white shadow-lg">
						<ShoppingCart className="h-4 w-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default function BooksPage() {
	const t = useTranslations("books");
	const pt = useTranslations("pagination");
	const locale = useLocale();

	const { sendRequests: fetchCategories, isLoading: isLoadingCategories } =
		useHttp();
	const { sendRequests: fetchAuthors, isLoading: isLoadingAuthors } =
		useHttp();
	const { sendRequests: fetchBooks, isLoading: isLoadingBooks } = useHttp();

	const [categories, setCategories] = useState([]);
	const [authors, setAuthors] = useState([]);
	const [books, setBooks] = useState([]);
	const [viewMode, setViewMode] = useState("grid"); // grid or list
	const searchParams = useSearchParams();
	const query = searchParams.get("query");
	const category = searchParams.get("category");
	const router = useRouter();

	const [pagination, setPagination] = useState({
		current_page: 1,
		page_size: 20,
		total: 0,
		page_range: [],
	});

	const [filterParams, setFilterParams] = useState({
		category: [],
		author: [],
		price: { min: 0, max: 0 },
	});

	const [sortBy, setSortBy] = useState("recent");

	/**
	 * Apply filters and search to fetch books
	 * @param {number} pageNumber - Page number to fetch
	 */
	const applyFilters = (pageNumber = 1) => {
		const params = {
			page: pageNumber,
			...filterParams,
			sort_by: sortBy,
		};

		// Add search query if it exists
		if (query && query.trim()) {
			params.search = query.trim();
		}

		// Add category if it exists
		if (category && category.trim()) {
			params.category = [category.trim()];
		}

		fetchBooks(
			{
				url_info: { url: API_ENDPOINTS?.BOOKS },
				params,
			},
			(res) => {
				setBooks(res.results);
				setPagination({
					current_page: res.current_page,
					page_size: 20,
					total: res.count,
					page_range: res.page_range,
				});
			},
			(error) => {
				console.error("Error fetching books:", error);
				setBooks([]);
				setPagination({
					current_page: 1,
					page_size: 20,
					total: 0,
					page_range: [],
				});
			},
		);
	};

	// Search query handling - trigger search when query changes
	useEffect(() => {
		// Reset to first page when search query changes
		applyFilters(1);
		if (category) {
			setFilterParams((prev) => ({
				...prev,
				category: [category],
			}));
		}
	}, [query, category]);

	// Auto-apply filters with debounce (excluding search query changes)
	useEffect(() => {
		applyFilters(1);
	}, [filterParams, sortBy]);

	// Initial data fetching
	useEffect(() => {
		fetchCategories(
			{ url_info: { url: API_ENDPOINTS.CATEGORIES } },
			(res) => setCategories(res),
		);

		fetchAuthors({ url_info: { url: API_ENDPOINTS.AUTHORS } }, (res) =>
			setAuthors(res),
		);

		// Only fetch books initially if there's no search query (search query effect will handle it)
		if (!query) {
			applyFilters();
		}
	}, []);

	// Filter handlers
	const handleCategoryChange = (categoryId, checked) => {
		// remove from params if has
		if (category) {
			router.push("/books");
		}
		setFilterParams((prev) => ({
			...prev,
			category: checked
				? [...prev.category, categoryId]
				: prev.category.filter((id) => id !== categoryId),
		}));
	};

	const handleAuthorChange = (authorId, checked) => {
		setFilterParams((prev) => ({
			...prev,
			author: checked
				? [...prev.author, authorId]
				: prev.author.filter((id) => id !== authorId),
		}));
	};

	const handlePriceChange = (type, value) => {
		setFilterParams((prev) => ({
			...prev,
			price: {
				...prev.price,
				[type]: value ? Number.parseInt(value) : 0,
			},
		}));
	};

	const handleClearFilters = () => {
		setFilterParams({
			category: [],
			author: [],
			price: { min: 0, max: 0 },
		});
	};

	const handlePageChange = (page) => {
		const pageNum = parseInt(page, 10);
		if (
			!isNaN(pageNum) &&
			pageNum !== pagination.current_page &&
			pageNum > 0 &&
			pageNum <= Math.ceil(pagination.total / pagination.page_size)
		) {
			applyFilters(pageNum);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	// Handle wishlist updates
	const handleWishlistUpdate = (updatedBook) => {
		setBooks((prevBooks) =>
			prevBooks.map((book) =>
				book.id === updatedBook.id ? updatedBook : book,
			),
		);
	};

	const getPageNumbers = () => {
		const totalPages = Math.ceil(pagination.total / pagination.page_size);
		const current = pagination.current_page;
		const delta = 2;
		const range = [];
		const rangeWithDots = [];
		let l;

		for (let i = 1; i <= totalPages; i++) {
			if (
				i === 1 ||
				i === totalPages ||
				(i >= current - delta && i <= current + delta)
			) {
				range.push(i);
			}
		}

		for (const i of range) {
			if (l) {
				if (i - l === 2) {
					rangeWithDots.push(l + 1);
				} else if (i - l !== 1) {
					rangeWithDots.push("...");
				}
			}
			rangeWithDots.push(i);
			l = i;
		}

		return rangeWithDots;
	};

	const activeFiltersCount =
		filterParams.category.length +
		filterParams.author.length +
		(filterParams.price.min > 0 || filterParams.price.max > 0 ? 1 : 0);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
			{/* Custom CSS for scrollbar */}
			<style jsx global>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 1px;
				}
			`}</style>

			<main className="container mx-auto px-4 py-6 lg:py-8">
				<div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
					{/* Enhanced Desktop Filters */}
					<aside className="hidden lg:block w-80 flex-shrink-0">
						<Card className="sticky top-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
							<CardContent className="p-6">
								<FilterSection
									categories={categories}
									authors={authors}
									filterParams={filterParams}
									onCategoryChange={handleCategoryChange}
									onAuthorChange={handleAuthorChange}
									onPriceChange={handlePriceChange}
									onClearFilters={handleClearFilters}
									isLoadingCategories={isLoadingCategories}
									isLoadingAuthors={isLoadingAuthors}
									locale={locale}
									t={t}
								/>
							</CardContent>
						</Card>
					</aside>

					{/* Main Content */}
					<div className="flex-1 min-w-0">
						{/* Enhanced Mobile/Tablet Controls */}
						<Card className="mb-6 border-0 shadow-md bg-white/80 backdrop-blur-sm">
							<CardContent className="p-3 sm:p-4">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
									{/* Mobile Filter Button */}
									<div className="flex items-center gap-2 sm:gap-3 lg:hidden">
										<Sheet>
											<SheetTrigger asChild>
												<Button
													variant="outline"
													size="sm"
													className="relative h-8 sm:h-9 text-xs sm:text-sm bg-white/90 hover:bg-white border-teal-200 hover:border-teal-300">
													<SlidersHorizontal className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
													{t("filter")}
													{activeFiltersCount > 0 && (
														<Badge className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 p-0 text-[10px] sm:text-xs bg-teal-600 animate-pulse flex items-center justify-center">
															{activeFiltersCount}
														</Badge>
													)}
												</Button>
											</SheetTrigger>
											<SheetContent
												side="left"
												className="w-[280px] sm:w-80 bg-white/95 backdrop-blur-sm">
												<SheetHeader>
													<SheetTitle className="text-teal-700">
														{t("filter")}
													</SheetTitle>
												</SheetHeader>
												<div className="mt-4 sm:mt-6">
													<FilterSection
														categories={categories}
														authors={authors}
														filterParams={
															filterParams
														}
														onCategoryChange={
															handleCategoryChange
														}
														onAuthorChange={
															handleAuthorChange
														}
														onPriceChange={
															handlePriceChange
														}
														onClearFilters={
															handleClearFilters
														}
														isLoadingCategories={
															isLoadingCategories
														}
														isLoadingAuthors={
															isLoadingAuthors
														}
														locale={locale}
														t={t}
													/>
													<div className="mt-4 sm:mt-6 flex justify-end">
														<SheetClose asChild>
															<Button
																size="sm"
																className="h-8 sm:h-9 text-xs sm:text-sm bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg">
																Apply Filters
															</Button>
														</SheetClose>
													</div>
												</div>
											</SheetContent>
										</Sheet>
									</div>

									{/* View Mode Toggle & Sort */}
									<div className="flex items-center gap-2 sm:gap-3">
										{/* View Mode Toggle */}
										<div className="hidden sm:flex items-center border rounded-lg p-1 bg-gray-50">
											<Button
												variant={
													viewMode === "grid"
														? "default"
														: "ghost"
												}
												size="sm"
												onClick={() =>
													setViewMode("grid")
												}
												className={`h-7 w-7 sm:h-8 sm:w-8 p-0 ${
													viewMode === "grid"
														? "bg-teal-600 text-white"
														: "text-gray-600"
												}`}>
												<Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
											</Button>
											<Button
												variant={
													viewMode === "list"
														? "default"
														: "ghost"
												}
												size="sm"
												onClick={() =>
													setViewMode("list")
												}
												className={`h-7 w-7 sm:h-8 sm:w-8 p-0 ${
													viewMode === "list"
														? "bg-teal-600 text-white"
														: "text-gray-600"
												}`}>
												<List className="h-3 w-3 sm:h-4 sm:w-4" />
											</Button>
										</div>

										{/* Sort Dropdown */}
										<Select
											value={sortBy}
											onValueChange={setSortBy}>
											<SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-48 bg-white/90 border-teal-200">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="recent">
													{t("recent")}
												</SelectItem>
												<SelectItem value="popular">
													{t("popular")}
												</SelectItem>
												<SelectItem value="price_low_to_high">
													{t("price_low_to_high")}
												</SelectItem>
												<SelectItem value="price_high_to_low">
													{t("price_high_to_low")}
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Enhanced Active Filters */}
						{activeFiltersCount > 0 && (
							<Card className="mb-6 border-l-4 border-l-teal-500 bg-gradient-to-r from-teal-50 to-emerald-50">
								<CardContent className="p-4">
									<div className="flex flex-wrap items-center gap-3">
										<div className="flex items-center gap-2">
											<Filter className="h-4 w-4 text-teal-600" />
											<span className="text-sm font-semibold text-teal-800">
												Active filters:
											</span>
										</div>
										{filterParams.category.map(
											(categoryId) => {
												const category =
													categories.find(
														(c) =>
															c.id.toString() ===
															categoryId,
													);
												return category ? (
													<Badge
														key={categoryId}
														variant="secondary"
														className="bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors">
														{locale === "bn"
															? category.name_bn
															: category.name}
														<X
															className="h-3 w-3 ml-1 cursor-pointer hover:text-teal-900"
															onClick={() =>
																handleCategoryChange(
																	categoryId,
																	false,
																)
															}
														/>
													</Badge>
												) : null;
											},
										)}
										{filterParams.author.map((authorId) => {
											const author = authors.find(
												(a) =>
													a.id.toString() ===
													authorId,
											);
											return author ? (
												<Badge
													key={authorId}
													variant="secondary"
													className="bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors">
													{locale === "bn"
														? author.name_bn
														: author.name}
													<X
														className="h-3 w-3 ml-1 cursor-pointer hover:text-teal-900"
														onClick={() =>
															handleAuthorChange(
																authorId,
																false,
															)
														}
													/>
												</Badge>
											) : null;
										})}
										{(filterParams.price.min > 0 ||
											filterParams.price.max > 0) && (
											<Badge
												variant="secondary"
												className="bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors">
												৳{filterParams.price.min || 0} -
												৳{filterParams.price.max || "∞"}
												<X
													className="h-3 w-3 ml-1 cursor-pointer hover:text-teal-900"
													onClick={() =>
														setFilterParams(
															(prev) => ({
																...prev,
																price: {
																	min: 0,
																	max: 0,
																},
															}),
														)
													}
												/>
											</Badge>
										)}
										<Button
											variant="ghost"
											size="sm"
											onClick={handleClearFilters}
											className="text-teal-700 hover:text-teal-800 hover:bg-teal-100 ml-2 transition-colors">
											Clear all
										</Button>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Enhanced Books Grid/List */}
						<div className="mb-8">
							{isLoadingBooks ? (
								<div
									className={
										viewMode === "list"
											? "space-y-4"
											: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6"
									}>
									{Array.from({ length: 12 }).map((_, i) => (
										<BookCardSkeleton
											key={i}
											viewMode={viewMode}
										/>
									))}
								</div>
							) : books.length === 0 ? (
								<Card className="text-center py-16 border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
									<CardContent>
										<div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center">
											<Filter className="h-12 w-12 text-teal-500" />
										</div>
										<h3 className="text-xl font-semibold text-gray-900 mb-3">
											No books found
										</h3>
										<p className="text-gray-600 mb-6 max-w-md mx-auto">
											We couldn't find any books matching
											your criteria. Try adjusting your
											filters or search terms.
										</p>
										<Button
											onClick={handleClearFilters}
											variant="outline"
											className="border-teal-200 text-teal-700 hover:bg-teal-50">
											<X className="h-4 w-4 mr-2" />
											Clear all filters
										</Button>
									</CardContent>
								</Card>
							) : (
								<div
									className={
										viewMode === "list"
											? "space-y-4"
											: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6"
									}>
									{books.map((book) => (
										<BookCard
											key={book.slug}
											book={book}
											setBooks={setBooks}
											locale={locale}
											viewMode={viewMode}
											onWishlistUpdate={
												handleWishlistUpdate
											}
										/>
									))}
								</div>
							)}
						</div>

						{/* Enhanced Pagination */}
						{pagination.total > pagination.page_size && (
							<div className="flex justify-center">
								<nav
									className="flex items-center space-x-1"
									aria-label="Pagination">
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											handlePageChange(
												(
													pagination.current_page - 1
												).toString(),
											)
										}
										disabled={pagination.current_page === 1}
										className="flex items-center gap-1">
										<ChevronLeft className="h-4 w-4" />
										<span className="hidden sm:inline">
											{pt("previous")}
										</span>
									</Button>

									<div className="flex items-center space-x-1">
										{getPageNumbers().map((page, idx) =>
											page === "..." ? (
												<span
													key={idx}
													className="px-2 py-1 text-gray-400">
													...
												</span>
											) : (
												<Button
													key={page}
													variant={
														page ===
														pagination.current_page
															? "default"
															: "outline"
													}
													size="sm"
													onClick={() =>
														handlePageChange(
															page.toString(),
														)
													}
													className="w-10 h-10 p-0"
													aria-current={
														page ===
														pagination.current_page
															? "page"
															: undefined
													}>
													{page}
												</Button>
											),
										)}
									</div>

									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											handlePageChange(
												(
													pagination.current_page + 1
												).toString(),
											)
										}
										disabled={
											pagination.current_page ===
											Math.ceil(
												pagination.total /
													pagination.page_size,
											)
										}
										className="flex items-center gap-1">
										<span className="hidden sm:inline">
											{pt("next")}
										</span>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</nav>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
