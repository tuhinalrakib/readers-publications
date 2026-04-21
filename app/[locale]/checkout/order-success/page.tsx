"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Package, Bell, Clock, Truck, MessageSquare, Home, ShoppingBag, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useLocale } from "next-intl"

export default function OrderSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const locale = useLocale()

  const handleContinueShopping = () => {
    router.push("/")
  }

  const handleViewOrders = () => {
    router.push(`/${locale}/profile/orders`)
  }

  return (
    <>
      <main className="container mx-auto px-2 sm:px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main Success Card */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <CardContent className="p-0">
               {/* Big Success Message */}
               <div className="text-center mb-8 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl border border-green-200">
                  <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">🎊</div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Congratulations!</h2>
                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
                    Your order has been successfully placed and is now in our system.
                    <br className="hidden sm:block" />
                    Get ready to receive your amazing books very soon!
                  </p>
                </div>

              {/* Order Details Section */}
              <div className="p-6 sm:p-8">
                {/* Order ID Display */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full mb-4">
                    <Package className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600 font-medium">Order ID</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-800 font-mono bg-gray-50 py-3 px-6 rounded-lg border-2 border-dashed border-gray-300">
                    {orderId || "ORD-2024-001234"}
                  </div>
                </div>

                {/* Status Messages */}
                <div className="grid gap-4 sm:gap-6 mb-8">
                  {/* Processing Message */}
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-800 mb-1">Your Order is Being Processed</h3>
                      <p className="text-blue-700 text-sm">
                        We're preparing your order and it will be ready for shipment soon.
                      </p>
                    </div>
                  </div>

                  {/* Notification Message */}
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-purple-800 mb-1">You'll Be Notified</h3>
                      <p className="text-purple-700 text-sm">
                        We'll send you updates via SMS and email about your order status and delivery.
                      </p>
                    </div>
                  </div>

                  {/* Delivery Message */}
                  <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-orange-800 mb-1">Fast Delivery</h3>
                      <p className="text-orange-700 text-sm">
                        Your order will be delivered within 3-5 business days to your selected address.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={handleViewOrders}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    View My Orders
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <Button
                    onClick={handleContinueShopping}
                    variant="outline"
                    className="w-full py-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-2 bg-transparent"
                  >
                    <Home className="w-5 h-5" />
                    Continue Shopping
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                    <MessageSquare className="w-4 h-4" />
                    <span>Need help? Contact our support team</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          
        </div>
      </main>
    </>
  )
}
