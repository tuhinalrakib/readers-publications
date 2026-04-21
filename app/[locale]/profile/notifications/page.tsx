import { Switch } from '@/components/ui/switch'
import { BellIcon } from 'lucide-react'
import React from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

const Notifications = () => {
    const t = useTranslations("profile.notifications")
    return (
        <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-xl font-semibold">{t("title")}</h2>
            <p className="mb-4 text-gray-600">
                {t("subtitle")}
            </p>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span>{t("order_update")}</span>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                    <span>{t("promotional_email")}</span>
                    <Switch />
                </div>
                <div className="flex items-center justify-between">
                    <span>{t("new_book_notification")}</span>
                    <Switch defaultChecked />
                </div>
            </div>
            <div className="mt-8">
                <h3 className="mb-4 text-lg font-medium">{t("notification_list")}</h3>
                <ul className="divide-y divide-gray-100">
                    <li className="flex items-start gap-3 py-3">
                        <BellIcon className="h-5 w-5 text-brand-500 mt-1" />
                        <div>
                            <p className="text-sm text-gray-800">আপনার অর্ডার <span className="font-semibold">ORD-12345</span> সফলভাবে ডেলিভারি হয়েছে।</p>
                            <span className="text-xs text-gray-400">১ দিন আগে</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-3 py-3">
                        <BellIcon className="h-5 w-5 text-brand-500 mt-1" />
                        <div>
                            <p className="text-sm text-gray-800">নতুন বই <span className="font-semibold">"নীল জোসনা"</span> এখন উপলব্ধ।</p>
                            <span className="text-xs text-gray-400">২ দিন আগে</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-3 py-3">
                        <BellIcon className="h-5 w-5 text-brand-500 mt-1" />
                        <div>
                            <p className="text-sm text-gray-800">বিশেষ অফার: আজই অর্ডার করুন এবং ১০% ছাড় পান।</p>
                            <span className="text-xs text-gray-400">৩ দিন আগে</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="mt-6 flex justify-end">
                <Button className="bg-brand-600 hover:bg-brand-700">{t("update_notifications")}</Button>
            </div>
        </div>
    )
}

export default Notifications