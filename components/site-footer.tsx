"use client"

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon, YoutubeIcon } from 'lucide-react';

export function SiteFooter() {
  const t = useTranslations('footer');
  const locale = useLocale()
  const generalData = useSelector((state: any) => state.generalData)

  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="mb-4 text-lg font-semibold">
              {t('about')}
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>{t('address')}: {locale === "bn" && generalData?.address_bn ? generalData?.address_bn : generalData?.address}</p>
              <p>{t('phone')}: {generalData?.contact_phone}</p>
              <p>{t('email')}: {generalData?.contact_email}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                  {t('privacy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('social')}</h3>
            <p className="mb-4 text-sm text-gray-600">{t('followUs')}</p>
            <div className="flex space-x-4">
              <a href={generalData?.social_links?.facebook} className="text-gray-600 hover:text-gray-900">
                <FacebookIcon size={24} />
              </a>
              <a href={generalData?.social_links?.twitter} className="text-gray-600 hover:text-gray-900">
                <TwitterIcon size={24} />
              </a>
              <a href={generalData?.social_links?.instagram} className="text-gray-600 hover:text-gray-900">
                <InstagramIcon size={24} />
              </a>
              <a href={generalData?.social_links?.linkedin} className="text-gray-600 hover:text-gray-900">
                <LinkedinIcon size={24} />
              </a>
              <a href={generalData?.social_links?.youtube} className="text-gray-600 hover:text-gray-900">
                <YoutubeIcon size={24} />
              </a>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('paymentMethods')}</h3>
            <div className="flex flex-wrap gap-2">
              <Image src="/payment/visa.png" alt="Visa" width={48} height={32} />
              <Image src="/payment/master-card.webp" alt="Mastercard" width={48} height={32} />
              <Image src="/payment/bkash.svg" alt="bKash" width={48} height={32} />
              <Image src="/payment/nagad.svg" alt="Nagad" width={48} height={32} />
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Readers Publications. {t('copyright')}</p>
          <p>Developed by <a href="https://www.gigafide.com" target="_blank" className="text-gray-600 hover:text-gray-900">GigaFide</a></p>
        </div>
      </div>
    </footer>
  );
}
