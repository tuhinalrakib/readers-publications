"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, Star, BookOpen, Users, Clock } from "lucide-react"
import useHttp from "@/hooks/useHttp"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { API_ENDPOINTS } from "@/constants/apiEnds"
import { useLocale } from "next-intl"
import Link from "next/link"
import useCart from "@/hooks/useCart"

/**
 * Special Package Detail Component
 * Displays detailed information about a special book package including books, pricing, and purchase options
 */
export default function Component() {
  const { id } = useParams()
  const router = useRouter()
  const [packageInfo, setPackageInfo] = useState({})
  const { sendRequests, isLoading, error } = useHttp()
  const locale = useLocale()
  const { addToCart } = useCart()

  const handleOrderPackage = () => {
    if (packageInfo?.books?.length) {
      packageInfo.books.forEach((book) => {
        let cartBook = {
          quantity: 1,
          book_details: {
            id: book.id,
            slug: book.slug,
            title: book.title,
            title_bn: book.title_bn,
            cover_image: book.cover_image,
            price: book.price,
            discounted_price: book.discounted_price,
            is_available: book.is_available,
          },
          author_details: {
            id: book.author_id,
            slug: book.author_slug,
            name: book.author_full_name,
            name_bn: book.author_full_name_bn,
          }
        }
        addToCart(cartBook, 1)
      })
      router.push(`/${locale}/cart`)
    }
  }

  /**
   * Fetch package details from API on component mount
   */
  useEffect(() => {
    sendRequests({
      url_info: {
        url: API_ENDPOINTS.SPECIAL_PACKAGE_DETAIL(id),
      }
    }, (response) => {
      setPackageInfo(response)
    })
  }, [id])

  /**
   * Calculate savings amount
   */
  const calculateSavings = () => {
    return (packageInfo.total_price || 0) - (packageInfo.price || 0)
  }

  /**
   * Calculate discount percentage
   */
  const calculateDiscountPercentage = () => {
    if (!packageInfo.total_price || !packageInfo.price) return 0
    return Math.round(((packageInfo.total_price - packageInfo.price) / packageInfo.total_price) * 100)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Hero Section with Enhanced Banner */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl mb-6 sm:mb-8 bg-white">
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem]">
            <Image 
              src={packageInfo?.image || "/banner-ex2.avif"}
              alt={"Special Package"}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6 sm:space-y-8">
            {/* Books Grid */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="bg-green-100 rounded-lg p-2 mr-3">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">প্যাকেজে অন্তর্ভুক্ত বইসমূহ</h2>
              </div>
              
              <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                 <style jsx>{`
                   .scrollbar-hide {
                     -ms-overflow-style: none;
                     scrollbar-width: none;
                   }
                   .scrollbar-hide::-webkit-scrollbar {
                     display: none;
                   }
                 `}</style>
                {packageInfo?.books?.length > 0 ? packageInfo.books.map((book, index) => {
                  // Calculate discount percentage if applicable
                  const hasDiscount = book.discounted_price && parseFloat(book.discounted_price) < parseFloat(book.price);
                  const discountPercentage = hasDiscount
                    ? Math.round((1 - parseFloat(book.discounted_price) / parseFloat(book.price)) * 100)
                    : 0;

                  return (
                     <Card key={book.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-sm hover:shadow-teal-100/50 flex-shrink-0 w-40 sm:w-48">
                      <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100">
                        {discountPercentage > 0 && (
                          <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold shadow-lg">
                            {discountPercentage}% OFF
                          </Badge>
                        )}

                        <Link href={`/${locale}/books/${book.slug}`}>
                          <Image
                            src={book.cover_image || "/images/book-skeleton.jpg"}
                            alt={locale === "bn" ? book.title_bn : book.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                          />
                        </Link>

                        {/* Overlay on hover */}
                        <Link href={`/${locale}/books/${book.slug}`}>
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
                                  i < Math.floor(book.rating || 0)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                            <span className="ml-1 text-xs text-gray-500">
                              {book.rating || "0.0"}
                            </span>
                          </div>
                          <div className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-teal-600 transition-colors text-sm leading-tight">
                          <Link href={`/${locale}/books/${book.slug}`}>
                            {locale === "bn" ? book.title_bn : book.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-1">
                          <Link
                            href={`/${locale}/authors/${book.author_slug}`}
                            className="hover:text-teal-600 transition-colors">
                            {locale === "bn" ? book.author_full_name_bn : book.author_full_name}
                          </Link>
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {book.discounted_price && book.discounted_price < book.price ? (
                              <>
                                <span className="font-bold text-teal-600 text-sm">
                                  ৳{book.discounted_price}
                                </span>
                                <span className="text-xs text-gray-500 line-through">
                                  ৳{book.price}
                                </span>
                              </>
                            ) : (
                              <span className="font-bold text-teal-600 text-sm">
                                ৳{book.price}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }) : (
                   <div className="w-full text-center py-8 sm:py-12">
                    <div className="bg-gray-100 rounded-full p-4 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4">
                      <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto" />
                    </div>
                    <p className="text-gray-500 text-sm sm:text-base">No books available in this package</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Pricing Card */}
            <Card className="xl:sticky xl:top-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-xl">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="bg-green-600 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Package className="h-6 w-6 text-white mx-auto" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">প্যাকেজ মূল্য</h3>
                  <div className="space-y-1 sm:space-y-2">
                    {packageInfo.total_price && (
                      <p className="text-base sm:text-lg text-gray-500 line-through">
                        মোট মূল্য: ৳ {packageInfo.total_price}
                      </p>
                    )}
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">
                      ৳ {packageInfo.price || 0}
                    </p>
                    {calculateSavings() > 0 && (
                      <div className="bg-green-100 rounded-lg p-2 mt-2">
                        <p className="text-xs sm:text-sm text-green-700 font-medium">
                          🎉 আপনার সাশ্রয়: ৳ {calculateSavings()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 bg-white rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-green-600" />
                      মোট বই:
                    </span>
                    <span className="font-semibold text-gray-800">{packageInfo?.books?.length || 0}টি</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Package className="h-4 w-4 mr-2 text-green-600" />
                      ডেলিভারি:
                    </span>
                    <span className="font-semibold text-green-600">ফ্রি</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-green-600" />
                      গ্যারান্টি:
                    </span>
                    <span className="font-semibold text-gray-800">৭ দিন</span>
                  </div>
                </div>

                <Button onClick={handleOrderPackage} className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base">
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  প্যাকেজ অর্ডার করুন
                </Button>

                <div className="text-center mt-3 sm:mt-4 p-3 bg-white rounded-lg">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    ✓ নিরাপদ পেমেন্ট<br className="sm:hidden" />
                    <span className="hidden sm:inline"> • </span>✓ দ্রুত ডেলিভারি<br className="sm:hidden" />
                    <span className="hidden sm:inline"> • </span>✓ ১০০% অরিজিনাল
                  </p>
                </div>
              </CardContent>
            </Card>

            
          </div>
        </div>
      </div>
    </div>
  )
}
