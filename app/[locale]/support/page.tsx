"use client"

import Link from "next/link"
import { HelpCircle, Mail } from "lucide-react"
import { useLocale, useTranslations } from 'next-intl'

export default function SupportPage() {
  const t = useTranslations('support')
  const currentLocale = useLocale()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="px-8 py-10">
              <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-gray-900 flex justify-center items-center gap-2">
                  <HelpCircle className="w-7 h-7 text-brand-600" />
                  {t('title')}
                </h1>
                
              </div>

              <div className="text-gray-800 space-y-5 text-[15px] leading-relaxed">
                <p>
                  {t('description')}
                </p>

                <p>
                  {t('description_2')}
                </p>

                <ul className="list-disc list-inside pl-2 text-gray-700">
                  <li>{t('description_3')}</li>
                  <li>{t('description_4')}</li>
                  <li>{t('description_5')}</li>
                  <li>{t('description_6')}</li>
                </ul>

                <div className="bg-gray-100 p-4 rounded-md mt-6">
                  <p className="text-base font-semibold mb-2 text-gray-800 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-brand-600" />
                    {t('email')}
                  </p>
                  <a
                    href="mailto:support@example.com"
                    className="text-brand-600 hover:underline text-sm"
                  >
                    support@example.com
                  </a>
                </div>

                <p className="pt-4 text-sm text-gray-600">
                  {t('description_7')}
                </p>
              </div>

              <div className="text-center mt-8">
                <Link href={`/${currentLocale}/`} className="inline-block text-brand-600 hover:underline font-medium">
                  {t('back_to_home')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
