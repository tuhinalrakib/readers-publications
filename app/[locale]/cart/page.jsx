"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, Trash2, Plus, Minus, Package, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import useCart from "@/hooks/useCart"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const t = useTranslations("cart")
  const locale = useLocale()
  const generalData = useSelector((state) => state.generalData)
  const { cartItems, loading, updateQuantity, removeFromCart, fetchCartItems, updateSelectionStatusChange } = useCart()
  const allSelected = cartItems.every((item) => item.is_selected)
  const someSelected = cartItems.some((item) => item.is_selected)
  const router = useRouter()
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated) 

  const DELIVERY_CHARGE = generalData?.delivery_charge || 0

  const handleSelectAll = () => {
    const ids = cartItems.map((item) => item.uuid)
    updateSelectionStatusChange(ids, !allSelected)
  }

  const subtotal = cartItems.filter((item) => item.is_selected).reduce((sum, item) => sum + item.book_details.discounted_price * item.quantity, 0)

  const originalSubtotal = cartItems.filter((item) => item.is_selected).reduce((sum, item) => sum + item.book_details.price * item.quantity, 0)

  const totalSavings = originalSubtotal - subtotal
  const total = subtotal + DELIVERY_CHARGE

  useEffect(() => {
    fetchCartItems()
  }, [isAuthenticated])

  const handleCheckout = () => {
    if (isAuthenticated) {
      router.push(`/${locale}/checkout`)
    } else {
      router.push(`/${locale}/signin?redirect_url=/${locale}/cart`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        <div className="w-full">
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 py-20 flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-brand-600 mb-4" />
              <p className="text-gray-500 text-sm">Loading your cart...</p>
            </div>
          ) : cartItems.length > 0 ? (
            <>
              {/* Page Header - Responsive */}
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="bg-brand-50 p-2 sm:p-3 rounded-xl w-fit">
                    <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-brand-600" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Shopping Cart</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                      {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                  {/* Select All - Mobile Optimized */}
                  <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                    <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                        className="h-4 w-4 sm:h-5 sm:w-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500 focus:ring-offset-0"
                      />
                      <span className="text-sm sm:text-base font-semibold text-gray-900 flex-1">
                        Select All
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 bg-brand-50 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                        {cartItems.filter((item) => item.is_selected).length} / {cartItems.length}
                      </span>
                    </label>
                  </div>

                  {/* Cart Items - Fully Responsive */}
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className={`bg-white rounded-lg border-2 transition-all duration-200 ${
                        item.is_selected
                          ? "border-brand-200 bg-brand-50/30"
                          : "border-gray-200 hover:border-brand-200"
                      }`}
                    >
                      <div className="p-3 sm:p-4 lg:p-5">
                        <div className="flex gap-2 sm:gap-3 lg:gap-4">
                          {/* Checkbox and Image */}
                          <div className="flex items-start gap-2 sm:gap-3 flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={item.is_selected}
                              onChange={() => updateSelectionStatusChange([item.uuid], !item.is_selected)}
                              className="h-4 w-4 sm:h-5 sm:w-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500 focus:ring-offset-0 mt-1"
                            />
                            <div className="relative">
                              <Link href={`/${locale}/books/${item?.book_details?.slug}`}>
                                <Image
                                  width={200}
                                  height={200}
                                  src={item?.book_details?.cover_image || "/images/book-skeleton.jpg"}
                                  alt={item?.book_details?.title || "Book Image"}
                                  className="h-20 w-14 sm:h-24 sm:w-16 lg:h-28 lg:w-20 object-cover rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                  loading="lazy"
                                />
                              </Link>
                              {item?.book_details?.discounted_price < item?.book_details?.price && (
                                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold text-[10px]">
                                  {(() => {
                                    const originalPrice = Number(item?.book_details?.price) || 0
                                    const discountedPrice = Number(item?.book_details?.discounted_price) || 0
                                    if (originalPrice <= 0) return '0'
                                    const percentage = ((originalPrice - discountedPrice) / originalPrice) * 100
                                    return Math.round(Math.max(0, Math.min(100, percentage)))
                                  })()}
                                  % OFF
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Item Details - Mobile First */}
                          <div className="flex-1 min-w-0">
                            <div className="space-y-3 sm:space-y-4">
                              {/* Title and Author */}
                              <div>
                                <Link href={`/${locale}/books/${item?.book_details?.slug}`}>
                                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 hover:text-brand-600 transition-colors leading-tight">
                                    {locale === "en" ? item?.book_details?.title : item?.book_details?.title_bn}
                                  </h3>
                                </Link>
                                <Link href={`/${locale}/authors/${item?.author_details?.slug}`}>
                                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 hover:text-brand-600 transition-colors">
                                    by {locale === "en" ? item?.author_details?.name : item?.author_details?.name_bn}
                                  </p>
                                </Link>
                              </div>

                              {/* Pricing - Mobile Optimized */}
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <span className="text-lg sm:text-xl font-bold text-brand-600">
                                  ৳{(() => {
                                    const price = Number(item?.book_details?.discounted_price) || 0
                                    return price.toFixed(2)
                                  })()}
                                </span>
                                {item?.book_details?.price > item?.book_details?.discounted_price && (
                                  <>
                                    <span className="text-xs sm:text-sm text-gray-500 line-through">
                                      ৳{(() => {
                                        const price = Number(item?.book_details?.price) || 0
                                        return price.toFixed(2)
                                      })()}
                                    </span>
                                    <span className="text-xs bg-green-100 text-green-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-semibold">
                                      Save{" "}
                                      {(() => {
                                        const originalPrice = Number(item?.book_details?.price) || 0
                                        const discountedPrice = Number(item?.book_details?.discounted_price) || 0
                                        if (originalPrice <= 0) return '0'
                                        const percentage = ((originalPrice - discountedPrice) / originalPrice) * 100
                                        return Math.round(Math.max(0, Math.min(100, percentage)))
                                      })()}
                                      %
                                    </span>
                                  </>
                                )}
                              </div>

                              {/* Mobile Layout: Quantity and Actions */}
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div className="flex items-center bg-brand-50 rounded-lg border border-brand-100">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg hover:bg-brand-100 p-0 text-brand-600 touch-manipulation"
                                      onClick={() => updateQuantity(item.uuid, Math.max(1, (item.quantity || 1) - 1))}
                                      disabled={(item.quantity || 1) <= 1}
                                    >
                                      <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                    <span className="w-10 sm:w-12 text-center text-sm sm:text-base font-semibold text-gray-900 py-1">
                                      {item.quantity || 1}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg hover:bg-brand-100 p-0 text-brand-600 touch-manipulation"
                                      onClick={() => updateQuantity(item.uuid, (item.quantity || 1) + 1)}
                                    >
                                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Total and Remove - Mobile Optimized */}
                                <div className="flex items-center justify-between sm:justify-end gap-3">
                                  <div className="text-left sm:text-right">
                                    <div className="text-base sm:text-lg font-bold text-gray-900">
                                      ৳{(() => {
                                        const price = Number(item?.book_details?.discounted_price) || 0
                                        const quantity = Number(item?.quantity) || 1
                                        return (price * quantity).toFixed(2)
                                      })()}
                                    </div>
                                    {item?.book_details?.price > item?.book_details?.discounted_price && (
                                      <div className="text-xs sm:text-sm text-gray-500 line-through">
                                        ৳{(() => {
                                          const price = Number(item?.book_details?.price) || 0
                                          const quantity = Number(item?.quantity) || 1
                                          return (price * quantity).toFixed(2)
                                        })()}
                                      </div>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg flex-shrink-0 touch-manipulation min-h-[36px] sm:min-h-[40px]"
                                    onClick={() => removeFromCart(item.uuid)}
                                  >
                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    <span className="text-xs sm:text-sm">Remove</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary - Mobile First */}
                <div className="lg:col-span-1 order-first lg:order-last">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 lg:p-6 lg:sticky lg:top-4">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800">Order Summary</h2>

                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                      <div className="flex justify-between items-center text-sm sm:text-base text-gray-700">
                        <span>{t("subtotal") || "Subtotal"}</span>
                        <span className="font-semibold">৳{Number(subtotal || 0).toFixed(2)}</span>
                      </div>

                      {totalSavings > 0 && (
                        <div className="flex justify-between items-center text-sm sm:text-base text-green-600">
                          <span>{t("total_savings") || "Total Savings"}</span>
                          <span className="font-semibold">-৳{Number(totalSavings).toFixed(2)}</span>
                        </div>
                      )}

                      {originalSubtotal > subtotal && (
                        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
                          <span>{t("original_price") || "Original Price"}</span>
                          <span className="line-through text-red-500">৳{Number(originalSubtotal).toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-sm sm:text-base text-gray-700">
                        <span>{t("delivery_charge") || "Delivery Charge"}</span>
                        <span className="font-semibold">
                          ৳{Number(DELIVERY_CHARGE || 0).toFixed(2)}
                        </span>
                      </div>

                      <div className="border-t pt-3 sm:pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-base sm:text-lg font-bold text-gray-900">{t("total") || "Total"}</span>
                          <span className="text-xl sm:text-2xl font-bold text-brand-600">৳{Number(total || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full py-3 sm:py-4 text-sm sm:text-base font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-all duration-200 disabled:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-60 shadow-md touch-manipulation min-h-[44px] sm:min-h-[48px]"
                      disabled={!someSelected || cartItems.length === 0}
                      onClick={handleCheckout}
                    >
                      {someSelected ? (t("order_now") || "Proceed to Checkout") : "Select Items First"}
                    </Button>

                    {!someSelected && cartItems.length > 0 && (
                      <p className="text-xs sm:text-sm text-gray-500 text-center mt-2 sm:mt-3">
                        {t("please_select_items_to_proceed") || "Please select items to proceed"}
                      </p>
                    )}

                    {/* Selected Items Count */}
                    {someSelected && (
                      <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-brand-50 rounded-lg border border-brand-200">
                        <p className="text-xs sm:text-sm text-brand-700 text-center">
                          {cartItems.filter((item) => item.is_selected).length} item{cartItems.filter((item) => item.is_selected).length > 1 ? "s" : ""} selected for checkout
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Empty Cart State - Mobile Optimized */
            <div className="bg-white rounded-lg border border-gray-200 py-16 sm:py-20">
              <div className="text-center max-w-sm sm:max-w-md mx-auto px-4">
                <div className="bg-brand-100 rounded-full w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mx-auto mb-6 sm:mb-8">
                  <Package className="h-12 w-12 sm:h-14 sm:w-14 text-brand-600" />
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">{t("empty") || "Your cart is empty"}</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-8 sm:mb-10 leading-relaxed">
                  {t("empty_cart_description") || "Looks like you haven't added any books to your cart yet. Discover our amazing collection of books!"}
                </p>
                <Button
                  asChild
                  className="bg-brand-600 hover:bg-brand-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-200 shadow-md text-sm sm:text-base touch-manipulation min-h-[44px] sm:min-h-[48px]"
                >
                  <Link href={`/${locale}/books`}>{t("go_shopping") || "Start Shopping"}</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
