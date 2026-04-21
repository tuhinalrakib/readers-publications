import { Button } from '@/components/ui/button'
import React from 'react'
import { useTranslations } from 'next-intl'

const PaymentMethod = () => {
    const t = useTranslations("profile.payment_methods")
    return (
        <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-xl font-semibold">{t("title")}</h2>
            <p className="mb-4 text-gray-600">
                {t("subtitle")}
            </p>
            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">কার্ড নম্বর</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:ring-brand-500"
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">কার্ডের নাম</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:ring-brand-500"
                        placeholder="আব্দুল করিম"
                    />
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <Button className="bg-brand-600 hover:bg-brand-700">পেমেন্ট মেথড আপডেট করুন</Button>
            </div>
        </div>
    )
}

export default PaymentMethod