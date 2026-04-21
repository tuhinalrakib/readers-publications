"use client"

import { ArrowLeft, CreditCard, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { API_ENDPOINTS } from "@/constants/apiEnds"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import useHttp from "@/hooks/useHttp"
import { useLocale } from "next-intl"

export default function Component() {
  const { order_id } = useParams()
  const [order, setOrder] = useState(null)
  const { sendRequests: fetchOrderDetails, isLoading: isFetchingOrderDetails } = useHttp()
  const locale = useLocale()
  const router = useRouter()

  useEffect(() => {
    fetchOrderDetails(
      {
        url_info: {
          url: API_ENDPOINTS.ORDER_DETAIL(order_id),
          isAuthRequired: true,
        },
      },
      (res) => {
        setOrder(res)
      },
    )
  }, [order_id])

  const handleReviewClick = (bookId) => {
    router.push(`/${locale}/books/${bookId}/review`)
  }

  const trackingSteps = [
    {
      status: "Placed",
      fullStatus: "Order Placed", 
      key: "pending",
      completed: ["pending", "processing", "ready_to_ship", "shipped", "delivered", "completed"].includes(
        order?.status,
      ),
      is_active: false,
    },
    {
      status: "Processing",
      fullStatus: "Processing",
      key: "processing", 
      completed: ["ready_to_ship", "shipped", "delivered", "completed"].includes(order?.status),
      is_active: order?.status === "processing",
    },
    {
      status: "Ready",
      fullStatus: "Ready to Ship",
      key: "ready_to_ship",
      completed: ["shipped", "delivered", "completed"].includes(order?.status),
      is_active: order?.status === "ready_to_ship",
    },
    {
      status: "Shipped", 
      fullStatus: "Shipped",
      key: "shipped",
      completed: ["delivered", "completed"].includes(order?.status),
      is_active: order?.status === "shipped",
    },
    {
      status: "Delivered",
      fullStatus: "Delivered",
      key: "delivered",
      completed: ["delivered", "completed"].includes(order?.status),
      is_active: order?.status === "delivered",
    },
  ]

  if (isFetchingOrderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Fully Responsive */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" asChild className="hover:bg-gray-100 flex-shrink-0 p-2 sm:px-3">
              <Link href="/profile/orders">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Back</span>
              </Link>
            </Button>

            <div className="text-center flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                Order #{order?.order_id}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                {new Date(order?.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="w-8 sm:w-12 flex-shrink-0" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Order Status - Mobile Optimized Horizontal */}

          {order?.status !== "cancelled" &&<Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 py-3 sm:py-4 px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
                <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="relative">
                {/* Steps - Responsive */}
                <div className="relative flex justify-between items-center">
                  {trackingSteps.map((step, index) => {
                    const isActive = step.is_active
                    const isCompleted = step.completed

                    return (
                      <div key={index} className="flex flex-col items-center flex-1 max-w-none relative">
                        {/* Connecting Line to Next Step */}
                        {index < trackingSteps.length - 1 && (
                          <div className="absolute top-3 sm:top-4 left-1/2 w-full h-0.5 z-0">
                            <div
                              className={`h-full transition-all duration-500 ${
                                isCompleted ? "bg-teal-500" : "bg-gray-200"
                              }`}
                            />
                          </div>
                        )}

                        {/* Step Circle */}
                        <div
                          className={`
                          w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 border-2 relative
                          ${
                            isActive
                              ? "border-orange-500 bg-orange-500"
                              : isCompleted
                                ? "border-teal-500 bg-teal-500"
                                : "border-gray-300 bg-white"
                          }
                        `}
                        >
                          {isActive ? (
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          ) : isCompleted ? (
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          ) : (
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300" />
                          )}
                        </div>

                        {/* Step Label */}
                        <div className="mt-2 sm:mt-3 text-center px-1">
                          <p
                            className={`text-xs sm:text-sm font-medium leading-tight ${
                              isActive ? "text-orange-600" : isCompleted ? "text-teal-600" : "text-gray-400"
                            }`}
                          >
                            <span className="sm:hidden">{step.status}</span>
                            <span className="hidden sm:inline">{step.fullStatus}</span>
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>}

          {/* Main Content Grid - Responsive */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              {/* Order Items - Mobile Optimized */}
              <Card>
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                  <CardTitle className="text-base sm:text-lg">Items ({order?.order_items?.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
                  {order?.order_items?.map((item) => (
                    <div key={item.id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="relative w-12 h-16 sm:w-16 sm:h-20 flex-shrink-0 overflow-hidden rounded-md">
                        <Link href={`/${locale}/books/${item.book.slug}`}>
                          <Image
                            src={item.book.cover_image || "/images/book-skeleton.jpg"}
                            alt={item.book.title}
                            fill
                            className="object-cover"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2 leading-tight">
                          <Link href={`/${locale}/books/${item.book.slug}`}>{item.book.title}</Link>
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                        <div className="flex justify-between items-center mt-2 gap-2">
                          <span className="text-xs sm:text-sm text-gray-500 truncate">৳{item.book.price} each</span>
                          <span className="font-semibold text-teal-600 text-sm sm:text-base flex-shrink-0">
                            ৳{item.price}
                          </span>
                        </div>
                        {order?.status === "delivered" && !item.book.has_review && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full sm:w-auto"
                            onClick={() => handleReviewClick(item.book.slug)}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Write a Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Shipping & Contact Info - Responsive Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{order?.shipping_address?.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                        {locale === "bn"
                          ? `${order?.shipping_address?.thana_name_bn}, ${order?.shipping_address?.city_name_bn}`
                          : `${order?.shipping_address?.thana_name}, ${order?.shipping_address?.city_name}`}
                      </p>
                      {order?.shipping_address?.detail_address && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                          {order?.shipping_address?.detail_address}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="break-all">{order?.shipping_address?.phone}</span>
                      </div>
                      {order?.shipping_address?.email && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="break-all">{order?.shipping_address?.email}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                      Payment Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Payment Method</p>
                      <Badge
                        variant={order?.payment_details?.payment_method === "cod" ? "secondary" : "default"}
                        className="text-xs"
                      >
                        {order?.payment_details?.payment_method === "cod"
                          ? "Cash on Delivery"
                          : order?.payment_details?.payment_method?.toUpperCase()}
                      </Badge>
                    </div>
                    {order?.payment_details?.payment_status && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Status</p>
                        <Badge
                          variant={order?.payment_details?.payment_status === "paid" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {order?.payment_details?.payment_status?.toUpperCase()}
                        </Badge>
                      </div>
                    )}
                    {order?.payment_details?.mobile_number && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Account</p>
                        <p className="text-xs sm:text-sm font-medium break-all">
                          {order?.payment_details?.mobile_number}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Order Summary - Mobile Optimized */}
            <div className="space-y-4 sm:space-y-6">
              <Card className="xl:sticky xl:top-24">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                  <CardTitle className="text-base sm:text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">৳{order?.sub_total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">৳{order?.shipping_cost}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base sm:text-lg">
                      <span>Total</span>
                      <span className="text-teal-600 ml-4">
                        ৳{((Number.parseFloat(order?.sub_total || 0) + Number.parseFloat(order?.shipping_cost || 0)).toFixed(2)).replace(/\.?0+$/, '')}
                      </span>
                    </div>
                  </div>

                  {order?.shipping_address?.courier_service_name && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm font-medium">Courier Service</span>
                      </div>
                      <p className="text-sm text-gray-600 break-words">
                        {order?.shipping_address?.courier_service_name}
                      </p>
                      {order?.shipping_address?.courier_service_tracking_id && (
                        <p className="text-xs text-gray-500 mt-1 break-all">
                          Tracking: {order?.shipping_address?.courier_service_tracking_id}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
