import { Button } from '@/components/ui/button'
import React from 'react'
import { useTranslations } from 'next-intl'

const Address = () => {
    const t = useTranslations("profile.address")
    return (
        <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-xl font-semibold">{t("title")}</h2>
            <p className="mb-4 text-gray-600">
                {t("subtitle")}
            </p>
            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">নতুন ঠিকানা</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:ring-brand-500"
                        placeholder="১২৩/এ, গ্রীন রোড, ঢাকা-১২১৫"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">পোস্টাল কোড</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:ring-brand-500"
                        placeholder="১২১৫"
                    />
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <Button className="bg-brand-600 hover:bg-brand-700">ঠিকানা আপডেট করুন</Button>
            </div>
        </div>
    )
}

export default Address