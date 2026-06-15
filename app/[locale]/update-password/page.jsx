"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from 'next-intl';
import useHttp from "@/hooks/useHttp"
import { API_ENDPOINTS } from "@/constants/apiEnds"
import { Alert } from "@/components/ui/alert"

export default function SignInPage() {
  const t = useTranslations('update_password');
  const [showPassword, setShowPassword] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState({})
  const router = useRouter()
  const {sendRequests: sendUpdatePasswordRequest, isLoading} = useHttp()
  const [successMessage, setSuccessMessage] = useState("")
  const currentLocale = useLocale()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    if (!verificationCode) {
      newErrors.code = t('verification_code_required')
      isValid = false
    } else if (!/^\d{6}$/.test(verificationCode)) {
      newErrors.code = t('verification_code_invalid')
      isValid = false
    }

    if (!password) {
      newErrors.password = t('password_required')
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = t('password_min_length')
      isValid = false
    }

    if (!confirmPassword) {
      newErrors.confirm_password = t('confirm_password_required')
      isValid = false
    } else if (confirmPassword !== password) {
      newErrors.confirm_password = t('password_not_match')
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      sendUpdatePasswordRequest({
        url_info: {
          url: API_ENDPOINTS.UPDATE_PASSWORD,
          is_auth_required: false,
        },
        method: "POST",
        data: {
          code: verificationCode,
          password: password,
          confirm_password: confirmPassword,
          email_or_phone: sessionStorage.getItem('forget_password_email_or_phone')
        },
      }, (response) => {
        setSuccessMessage(t('success_message'))
        sessionStorage.removeItem('forget_password_email_or_phone')
        setTimeout(() => {
          router.push(`/${currentLocale}/signin`)
        }, 1000)
      }, (err) => {
        setErrors(err)
      })    
     
    }
  }

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

                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                {errors.non_field_errors && <Alert variant="destructive">{errors.non_field_errors}</Alert>}

                {/* Verification Code */}
                <div>
                  <Label htmlFor="verificationCode" className="mb-1 block text-sm font-medium text-gray-700">
                    {t('verification_code')}
                  </Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    maxLength={6}
                    placeholder={t('verification_code_placeholder')}
                    className={`pl-3 ${errors.code ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-brand-500 focus:ring-brand-500"}`}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code}</p>}
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                    {t('password')}
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t('password_placeholder')}
                      className={`pl-10 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-brand-500 focus:ring-brand-500"}`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
                    {t('confirm_password')}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder={t('confirm_password_placeholder')}
                    className={`pl-3 ${errors.confirm_password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-brand-500 focus:ring-brand-500"}`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.confirm_password && <p className="mt-1 text-xs text-red-500">{errors.confirm_password}</p>}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
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
                    t('submit')
                  )}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-gray-600">{t('want_to_sign_in')}</span>{" "}
                  <Link href={`/${currentLocale}/signin`} className="font-medium text-brand-600 hover:text-brand-500">
                    {t('sign_in')}
                  </Link>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
