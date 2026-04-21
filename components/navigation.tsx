"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useLocale, useTranslations } from "next-intl"
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { FaShoppingCart } from "react-icons/fa"
import { useSelector } from "react-redux"

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  
  const locale = useLocale()
  const t = useTranslations("header")
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const restOfPath = pathname.split('/').slice(2).join('/');
  
  // Redux selectors for user and cart data
  const { isAuthenticated } = useSelector((state: any) => state.user);
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const cartItems = useSelector((state: any) => state.cart.cart_items);
  
  const query = searchParams.get("query");

  const mainLinks = [
    { href: '', label: 'home' },
    { href: 'books', label: 'all_books' },
    { href: 'special-package', label: 'special_package' },
    { href: 'authors', label: 'writers' },
    { href: 'blog', label: 'blog' },
    { href: 'about', label: 'about_us' }
  ]

  /**
   * Change language and navigate to new locale
   * @param {string} lang - Target language code
   */
  const changeLanguage = (lang: string) => {
    const newPath = `/${lang}/${restOfPath}`;
    router.push(newPath);
  };

  /**
   * Handle search form submission
   * @param {Event} e - Form submission event
   */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchPath = `/${locale}/books?query=${encodeURIComponent(
        searchQuery.trim(),
      )}`;
      router.push(searchPath);
      setSearchQuery(""); // Clear the search input after submission
      setIsMobileSearchOpen(false); // Close mobile search after submission
    } else {
      router.push(`/${locale}/books`);
      setIsMobileSearchOpen(false); // Close mobile search
    }
  };

  /**
   * Handle Enter key press in search input
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
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
    if (query?.length && query.length > 0) {
      setSearchQuery(query)
    }
  }, [query])

  return (
    <nav className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        {/* Mobile Menu */}
        <div className="flex items-center justify-between py-4 lg:hidden">
          {/* Mobile Logo */}
          <Link
            href={`/${locale}`}
            className="transition-transform hover:scale-105"
          >
            <div className="relative h-10 w-24">
              <Image
                src="/readers-icon.png"
                alt="Readers Publications Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Mobile Navigation Icons */}
          <div className="flex items-center gap-3">
            {/* Mobile Search Icon */}
            <button
              onClick={toggleMobileSearch}
              className="group flex flex-col items-center transition-transform hover:scale-105"
              aria-label={t("search")}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 p-1.5 text-white transition-colors group-hover:bg-white/30">
                <Search className="h-4 w-4" />
              </div>
              <span className="mt-1 text-xs font-medium">
                {t("search")}
              </span>
            </button>
            
            <Link
              href={`/${locale}/cart`}
              className="group flex flex-col items-center transition-transform hover:scale-105"
              aria-label={t("cart")}
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 p-1.5 text-white transition-colors group-hover:bg-white/30">
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

            {/* Mobile Auth */}
            {isAuthenticated ? (
              <Link
                href={`/${locale}/profile`}
                className="flex flex-col items-center text-sm font-medium text-white hover:text-brand-100"
              >
                <div className="h-8 w-8 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
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
                <span className="mt-1 text-xs font-medium">{t("profile")}</span>
              </Link>
            ) : (
              <Link href={`/${locale}/signin`}>
                <Button size="sm" variant="secondary">{t("signIn")}</Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-brand-500/20 focus-visible:ring-2 focus-visible:ring-brand-200"
                  aria-label={t("toggle_menu")}
                >
                  <Menu className="h-7 w-7" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[85%] max-w-xs border-r-0 bg-white p-0 shadow-lg"
              >
                {/* Sheet Header */}
                <div className="flex h-16 items-center gap-2 border-b bg-brand-50 px-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="hover:bg-brand-100"
                    aria-label={t("close_menu")}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <span className="text-lg font-bold text-brand-700">{t("menu")}</span>
                </div>
                {/* Sheet Body */}
                <div className="py-4">
                  <nav className="space-y-1 px-6">
                    {mainLinks.map(link => (
                      <Link
                        key={link.href}
                        href={`/${locale}/${link.href}`}
                        className="block rounded-lg px-4 py-3 text-base font-medium text-gray-900 transition-all hover:bg-brand-50 hover:text-brand-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t(link.label)}
                      </Link>
                    ))}
                  </nav>

                  {/* Language Switcher */}
                  <div className="mt-8 flex items-center justify-center gap-3">
                    <span className={`text-sm font-medium ${locale === "en" ? "text-brand-700" : "text-gray-400"}`}>En</span>
                    <button
                      type="button"
                      aria-label="Switch language"
                      className={`relative h-6 w-12 rounded-full transition-colors duration-200 ${locale === "en" ? "bg-brand-600" : "bg-brand-400"}`}
                      onClick={() => changeLanguage(locale === "en" ? "bn" : "en")}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${
                          locale === "en" ? "left-1" : "left-6"
                        }`}
                      />
                    </button>
                    <span className={`text-sm font-medium ${locale === "bn" ? "text-brand-700" : "text-gray-400"}`}>বাংলা</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar - Toggleable */}
        {isMobileSearchOpen && (
          <div className="lg:hidden w-full pb-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Input
                type="search"
                placeholder={t("search")}
                className="w-full rounded-full border-gray-200 bg-white text-gray-900 pl-4 pr-12 focus:border-brand-500 focus:ring-brand-500 placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                autoFocus
              />
              <Button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-brand-600 p-2 text-white hover:bg-brand-700"
                size="icon"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">{t("search")}</span>
              </Button>
            </form>
          </div>
        )}
        

        {/* Desktop Menu */}
        <ul className="hidden flex-wrap items-center justify-between lg:flex">
           <li className="py-4">
              <Link 
                href={`/${locale}`} 
                className="text-base font-medium transition-colors hover:text-brand-100"
              >
                {t("home")}
              </Link>
            </li>

            <li className="py-4">
              <Link 
                href={`/${locale}/books`} 
                className="text-base font-medium transition-colors hover:text-brand-100"
              >
                {t("all_books")}
              </Link>
            </li>

          {/* Categories Dropdown */}
          {/* <li className="group relative py-4">
            <button
              className="flex items-center text-base font-medium transition-colors hover:text-brand-100"
            >
              <span>{t("categories")}</span>
              <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-0 top-full z-10 grid-cols-1 gap-2 rounded-lg bg-white p-4 shadow-xl opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-1 sm:grid sm:min-w-[400px] md:grid-cols-2">
              {categories.map(category => (
                <Link
                  key={category.id}
                  href={`/${locale}/categories/${category.id}`}
                  className="block px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand-600 whitespace-nowrap"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </li> */}
          
          <li className="group relative py-4">
            <Link
              href={`/${locale}/special-package`}
              className="flex items-center text-base font-medium transition-colors hover:text-brand-100"
            >
              <span>{t("special_package")}</span>
            </Link>
            
          </li>
            <li className="py-4">
              <Link 
                href={`/${locale}/authors`} 
                className="text-base font-medium transition-colors hover:text-brand-100"
              >
                {t("writers")}
              </Link>
            </li>

            <li className="py-4">
              <Link 
                href={`/${locale}/blog`} 
                className="text-base font-medium transition-colors hover:text-brand-100"
              >
                {t("blog")}
              </Link>
            </li>

             <li className="py-4">
              <Link 
                href={`/${locale}/about`} 
                className="text-base font-medium transition-colors hover:text-brand-100"
              >
                {t("about_us")}
              </Link>
            </li>

          
        </ul>
      </div>
    </nav>
  )
}
