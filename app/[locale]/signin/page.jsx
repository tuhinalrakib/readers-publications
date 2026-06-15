"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from 'next-intl';
import useHttp from "@/hooks/useHttp"
import { API_ENDPOINTS } from "@/constants/apiEnds"
import { useGoogleLogin } from "@react-oauth/google"
import { Alert } from "@/components/ui/alert"
import { setIsAuthenticated, setUserInfo } from "@/store/userSlice"
import { useDispatch } from "react-redux"
import { setCartItems } from "@/store/cart"

export default function SignInPage() {
  const t = useTranslations('signin');
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()
  const { sendRequests, isLoading } = useHttp()
  const { sendRequests: sendGoogleLoginRequest, isLoading: isGoogleLoginLoading, error: googleLoginError } = useHttp()
  const dispatch = useDispatch()
  const currentLocale = useLocale()

  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect_url")

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    if (!email) {
      newErrors.email = currentLocale === "bn" ? "ইমেইল আবশ্যক" : "Email is required"
      isValid = false
    }
    if (!password) {
      newErrors.password = currentLocale === "bn" ? "পাসওয়ার্ড আবশ্যক" : "Password is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {

      sendRequests({
        url_info: {
          url: API_ENDPOINTS.LOGIN,
          is_auth_required: false,
        },
        method: "POST",
        data: { email, password },
      }, (response) => {
        setSuccessMessage(t('success_message'))
        localStorage.setItem("access_token", response.access_token)
        localStorage.setItem("refresh_token", response.refresh_token)
        dispatch(setUserInfo(response.user_info))
        dispatch(setIsAuthenticated(true))
        dispatch(setCartItems(response.user_info.cart_items))
        
        console.log("called=====")

        setTimeout(() => {
          if(!["", null, undefined].includes(redirectUrl)) {
            router.push(redirectUrl)
          } else {
            router.push("/")
          }
        }, 1000)
      }, (err) => {
        setErrors(err)
      })
    }
  }

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      sendGoogleLoginRequest({
        url_info: {
          url: API_ENDPOINTS.GOOGLE_LOGIN,
          is_auth_required: false,
        },
        method: "POST",
        data: {
          access_token: tokenResponse.access_token,
        }
      }, (data) => {
        setSuccessMessage(t('success_message'))
        localStorage.setItem("access_token", data.access_token)
        localStorage.setItem("refresh_token", data.refresh_token)
        dispatch(setUserInfo(data.user_info))
        dispatch(setIsAuthenticated(true))
        dispatch(setCartItems(data.user_info.cart_items))  

        setTimeout(() => {
          if(!["", null, undefined].includes(redirectUrl)) {
            router.push(redirectUrl)
          } else {
            router.push("/")
          }
        }, 1000)
      })
    },
    onError: () => {
      console.error("Google Login Failed");
    },
  });


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-md">
          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="relative h-32 bg-gradient-to-r from-brand-600 to-brand-700">
                <div className="absolute left-8 top-8">
                  <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
                  <p className="mt-2 text-brand-100">{t('description')}</p>
                </div>
              </div>

            <div className="mt-8 px-8 pb-8">
              

              <form onSubmit={handleSubmit} className="space-y-6">
                {errors?.detail && <div className="md:col-span-2">
                    <Alert variant="destructive" className="w-full mb-4">{errors?.detail}</Alert>
                  </div>}

                {errors?.non_field_errors && <div className="md:col-span-2">
                  <Alert variant="destructive" className="w-full mb-4">{errors.non_field_errors}</Alert>
                </div>}
                {successMessage && <div className="md:col-span-2">
                  <Alert variant="success" className="w-full mb-4 text-center">{successMessage}</Alert>
                </div>}
                {googleLoginError?.non_field_errors && <div className="md:col-span-2">
                    <Alert variant="destructive" className="w-full mb-4">{googleLoginError?.non_field_errors}</Alert>
                  </div>}

                <div>
                  <Label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                    {t('email')}
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('email_placeholder')}
                      className={`pl-10 ${errors?.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-brand-500 focus:ring-brand-500"}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isGoogleLoginLoading || isLoading}
                    />
                  </div>
                  {errors?.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                      {t('password')}
                    </Label>
                    <Link href={`/${currentLocale}/forgot-password`} className="text-xs font-medium text-brand-600 hover:text-brand-500">
                      {t('forgot_password')}
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t('password_placeholder')}
                      className={`pl-10 pr-10 ${errors?.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-brand-500 focus:ring-brand-500"}`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isGoogleLoginLoading || isLoading}
                      />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                      onClick={togglePasswordVisibility}
                      disabled={isGoogleLoginLoading || isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors?.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>

                {/* <div className="flex items-center">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={isLoading}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    {t('remember_me')}
                  </label>
                </div> */}

                <Button
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-700 transition-colors"
                  disabled={isGoogleLoginLoading || isLoading}
                >
                  {isGoogleLoginLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 animate-spin text-white"
                        xmlns="https://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>{t('processing')}</span>
                    </div>
                  ) : (
                    t('sign_in')
                  )}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-gray-600">{t('dont_have_account')}</span>{" "}
                  <Link href={`/${currentLocale}/signup`} className="font-medium text-brand-600 hover:text-brand-500">
                    {t('sign_up')}
                  </Link>
                </div>
              </form>

              <div className="mt-6">
                <div className="fancy-divider">
                  <span>{t('or_via')}</span>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="btn-hover-effect flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    disabled={isGoogleLoginLoading || isLoading}
                    onClick={() => login()}
                  >
                    <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                    </svg>
                    {isGoogleLoginLoading ? <span>Processing...</span> : <span>{t('sign_in_with_google')}</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
