"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useTranslations, useLocale } from "next-intl"
import { Banknote, RotateCcw, Edit, Trash2, Plus } from "lucide-react"
import Image from "next/image"
import AddressModal from "./components/AddressModal"
import useHttp from "@/hooks/useHttp"
import { API_ENDPOINTS } from "@/constants/apiEnds"
import useCart from "@/hooks/useCart"
import { useSelector, useDispatch } from "react-redux"
import { removeCartItem } from "@/store/cart"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const t = useTranslations("checkout")
  const locale = useLocale()
  const generalData = useSelector((state: any) => state.generalData)
  const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated)
  const { cartItems, fetchCartItems } = useCart()
  const [selectedPayment, setSelectedPayment] = useState<string>("")
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null)
  // Modal state
  const [showAddressModal, setShowAddressModal] = useState(false)
  const {sendRequests: fetchShippingAddress} = useHttp()
  const {sendRequests: deleteShippingAddress} = useHttp()
  const {sendRequests: createOrder} = useHttp()
  // Address form state
  const [isEditAddress, setIsEditAddress] = useState<boolean>(false)
  const [editAddress, setEditAddress] = useState<any>({})
  // Addresses state (make it mutable)
  const [addresses, setAddresses] = useState<any>([])
  // Mobile payment state
  const [mobileNumber, setMobileNumber] = useState<string>("")
  const [referenceNumber, setReferenceNumber] = useState<string>("")
  const [commonError, setCommonError] = useState<string>("")
  const dispatch = useDispatch()
  const router = useRouter()
  
  useEffect(() => {
    fetchShippingAddress({
      url_info: {
        url: API_ENDPOINTS.SHIPPING_ADDRESS,
        isAuthRequired: true
      }
    }, (res: any) => {
      setAddresses(res)
      setSelectedAddress(res.find((address: any) => address.is_default)?.id || null)
    })
  }, [])
  
  useEffect(() => {
    fetchCartItems({
      is_selected: true
    })
  }, [isAuthenticated])

  const DELIVERY_CHARGE = generalData?.delivery_charge || 0

  const subtotal = cartItems.reduce((sum, item) => sum + item.book_details.discounted_price * item.quantity, 0)
  const originalSubtotal = cartItems.reduce((sum, item) => sum + item.book_details.price * item.quantity, 0)
  const total = subtotal + DELIVERY_CHARGE

  const handlePaymentSelection = (method: string) => {
    setSelectedPayment(method)
    // Reset mobile payment fields when changing payment method
    setMobileNumber("")
    setReferenceNumber("")
  }

  // Modal handlers
  const openAddressAddModal = () => {
    setShowAddressModal(true)
    setIsEditAddress(false)
    setEditAddress({})
  }

  const closeAddressModal = () => {
    setShowAddressModal(false)
  }

  const openAddressEditModal = (address: any) => {
    setShowAddressModal(true)
    setIsEditAddress(true)
    setEditAddress(address)
  }

  const handleSelectAddressDefaultAddress = (addressId: number) => {
    setAddresses((prev: any[]) => prev.map((add: any) => add.id === addressId ? {...add, is_default: true} : {...add, is_default: false}))
    setSelectedAddress(addressId)
  }

  const handleDeleteAddress = (addressId: number) => {
    deleteShippingAddress({
      url_info: {
        url: API_ENDPOINTS.SHIPPING_ADDRESS + addressId + "/",
        isAuthRequired: true
      },
      method: "DELETE"
    }, (res: any) => {
      setAddresses((prev: any[]) => prev.filter((add: any) => add.id !== addressId))
    })
  }

  // Payment instructions for each mobile payment method
  const paymentInstructions = {
    bkash: {
      title: t("bkash_payment"),
      instructions: [
        t("bkash_instruction"),
      ],
      merchantNumber: "01XXXXXXXXX"
    },
    nagad: {
      title: t("nagad_payment"),
      instructions: [
        t("nagad_instruction")
      ],
      merchantNumber: "01XXXXXXXXX"
    },
    rocket: {
      title: t("rocket_payment"),
      instructions: [
        t("rocket_instruction")
      ],
      merchantNumber: "01XXXXXXXXX"
    }
  }

  const handleSubmitOrder = () => {
    // Clear error
    setCommonError("")

    if(!selectedAddress) {
      setCommonError("Please select or add a shipping address.")
      return
    }
    if (!selectedPayment) {
      setCommonError("Please select a payment method.")
      return
    }
    if (!termsAccepted) {
      setCommonError("Please accept the terms and conditions.")
      return
    }
    if (["bkash", "nagad", "rocket"].includes(selectedPayment) && (!mobileNumber || !referenceNumber)) {
      setCommonError("Please provide mobile number and reference number for mobile payment.")
      return
    }

    createOrder({
      url_info: {
        url: API_ENDPOINTS.ORDER_CREATE,
        isAuthRequired: true
      },
      method: "POST",
      data: {
        shipping_address_id: selectedAddress,
        payment_method: selectedPayment,
        mobile_number: mobileNumber,
        reference_number: referenceNumber
      }
    }, (res: any) => {
      console.log(res)
      let cartItemsArray = cartItems.map((item: any) => item.uuid)
      dispatch(removeCartItem(cartItemsArray))

      setTimeout(() => {
        router.push(`/checkout/order-success?order_id=${res.order_id}`)
      }, 1000)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-6">
            {/* Left: Payment Methods */}
            <div className="lg:col-span-2 flex flex-col">
              {/* Shipping Address Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-1 text-gray-800">{t("shipping_address")}</h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">({t("please_select_shipping_address")})</p>

                <div className="space-y-3 sm:space-y-4">
                  {addresses.map((address: any) => (
                    <div
                      key={address.id}
                      className={`border rounded-lg p-3 sm:p-4 transition-colors ${
                        address?.is_default ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex items-start gap-2 sm:gap-3 cursor-pointer" onClick={() => handleSelectAddressDefaultAddress(address.id)}>
                          <div
                            className={`w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 ${
                              address?.is_default ? "border-blue-500 bg-blue-500" : "border-gray-300"
                            }`}
                          >
                            {address?.is_default && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{address?.address_type?.toUpperCase()}</span>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-700 space-y-0.5 sm:space-y-1">
                              <p>
                                <strong>Name:</strong> {address?.name}
                              </p>
                              <p>
                                <strong>Phone:</strong> {address?.phone}
                              </p>
                              <p>{locale === "bn" ? address.thana?.name_bn : address.thana?.name}, {locale === "bn" ? address.city?.name_bn : address.city?.name}, {locale === "bn" ? address.state?.name_bn : address.state?.name}</p>
                              <p>{address.detail_address}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 ml-0 sm:ml-4 mt-2 sm:mt-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
                            onClick={() => openAddressEditModal(address)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            <span className="hidden xs:inline">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="hidden xs:inline">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    className="w-full py-2 sm:py-3 text-blue-600 border-blue-200 hover:bg-blue-50 flex items-center justify-center gap-2 bg-transparent text-sm sm:text-base"
                    onClick={openAddressAddModal}
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t("add_new_address")}</span>
                  </Button>
                </div>
              </div>

              {/* Top Promotional Banners */}
              <div className="grid grid-cols-1 mb-4 sm:mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                  <div className="bg-orange-100 p-1.5 sm:p-2 rounded-lg">
                    <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                  <span className="font-medium text-gray-800 text-sm sm:text-base">7 Days Happy Return</span>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-1 text-gray-800">{t("payment_method")}</h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">({t("please_select_payment_method")})</p>

                <div className="space-y-4 sm:space-y-6">
                  {/* Cash on Delivery */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">{t("cash_on_delivery")}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">{t("pay_after_receive_product")}</p>

                    <div
                      className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                        selectedPayment === "cod" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                      onClick={() => handlePaymentSelection("cod")}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            selectedPayment === "cod" ? "border-blue-500 bg-blue-500" : "border-gray-300"
                          }`}
                        >
                          {selectedPayment === "cod" && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded flex items-center justify-center">
                            <Banknote className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-medium text-sm sm:text-base">{t("cash_on_delivery")}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Banking */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">{t("mobile_wallet")}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">{t("pay_with_mobile_wallet")}</p>

                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                      {[
                        { id: "bkash", name: "bKash", color: "bg-pink-500", image: "/payment/bkash.webp" },
                        { id: "nagad", name: "Nagad", color: "bg-orange-500", image: "/payment/nagad.webp" },
                        { id: "rocket", name: "Rocket", color: "bg-purple-500", image: "/payment/rocket.webp" },
                      ].map((wallet) => (
                        <div
                          key={wallet.id}
                          className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                            selectedPayment === wallet.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                          }`}
                          onClick={() => handlePaymentSelection(wallet.id)}
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                selectedPayment === wallet.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
                              }`}
                            >
                              {selectedPayment === wallet.id && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                            <Image src={wallet.image} alt={wallet.name} width={100} height={10}/>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Credit/Debit Cards */}
                  {/* <div>
                    <h3 className="font-medium text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">{t("card")}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">{t("pay_with_card")}</p>

                    <div
                      className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                        selectedPayment === "card" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                      onClick={() => handlePaymentSelection("card")}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${selectedPayment === "card" ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}
                        >
                          {selectedPayment === "card" && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">  
                          <Image src="/payment/rok-ssl-card-icon-sslNew.webp" alt="VISA" width={220} height={10}/>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* Mobile Payment Details */}
                  {["bkash", "nagad", "rocket"].includes(selectedPayment) && (
                    <div className="border rounded-lg p-4 sm:p-6 bg-gray-50">
                      <h3 className="font-medium text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">
                        {paymentInstructions[selectedPayment as keyof typeof paymentInstructions].title}
                      </h3>
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">{t("merchant_number")}: <strong>{paymentInstructions[selectedPayment as keyof typeof paymentInstructions].merchantNumber}</strong></p>
                          <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-sm text-gray-600 space-y-1">
                            {paymentInstructions[selectedPayment as keyof typeof paymentInstructions].instructions.map((instruction, index) => (
                              <li key={index}>{instruction}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm text-gray-600 block mb-1">{t("mobile_number")}</label>
                          <Input
                            placeholder={t("enter_mobile_number")}
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            className="text-sm"
                          />
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">({t("mobile_help_text")})</p>
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm text-gray-600 block mb-1">{t("reference_number")}</label>
                          <Input
                            placeholder={t("enter_reference_number")}
                            value={referenceNumber}
                            onChange={(e) => setReferenceNumber(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Terms and Conditions */}
                  <div className="flex items-start gap-1 sm:gap-2 pt-3 sm:pt-4">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    />
                    <label htmlFor="terms" className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {t("policy_agree")}
                      <a href="#" className="text-blue-600 hover:underline">
                        {" "} {t("terms_and_conditions")}
                      </a>
                    </label>
                  </div>

                  {/* Order Button */}
                  <Button
                    className="w-full py-3 sm:py-4 text-base sm:text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                    onClick={handleSubmitOrder}
                    disabled={!selectedPayment || !termsAccepted}
                  >
                    {t("confirm_order")} ৳{total.toLocaleString()}
                  </Button>
                  {commonError && (
                    <p className="text-red-500 text-sm sm:text-base text-center">{commonError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Checkout Summary */}
            <div className="lg:col-span-1 mb-6 lg:mb-0">
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 sticky top-4 z-10 lg:static">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800">{t("checkout_summary")}</h2>

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm sm:text-base">{t("subtotal")}</span>
                    <span className="font-medium text-sm sm:text-base">৳{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600 text-sm sm:text-base">{t("delivery_charge")}</span>
                    </div>
                    <span className="font-medium text-sm sm:text-base">৳{DELIVERY_CHARGE.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between border-t pt-3 sm:pt-4">
                    <span className="text-gray-600 text-sm sm:text-base">{t("total")}</span>
                    <span className="font-medium text-sm sm:text-base">৳{total.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between font-semibold text-base sm:text-lg">
                    <span>{t("payable_total")}</span>
                    <span>৳{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Address Add Modal */}
      {showAddressModal && (
        <AddressModal 
          closeAddressModal={closeAddressModal} 
          isEditAddress={isEditAddress} 
          setIsEditAddress={setIsEditAddress} 
          editAddress={editAddress} 
          setEditAddress={setEditAddress} 
          setAddresses={setAddresses}
        />
      )}
    </div>
  )
}