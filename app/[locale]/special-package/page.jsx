"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import useHttp from "@/hooks/useHttp"
import { API_ENDPOINTS } from "@/constants/apiEnds"
import { useEffect, useState } from "react"
import Pagination from "@/components/pagination"
import Link from "next/link"

export default function SpecialPackagesPage() {
  const t = useTranslations("special_package")
  const { sendRequests, isLoading, error } = useHttp()
  const [specialPackages, setSpecialPackages] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const getSpecialPackages = (params = {}) => {
    sendRequests({
      url_info: {
        url: API_ENDPOINTS.SPECIAL_PACKAGES,
      },
      params: params,
    }, (res) => {
      setSpecialPackages(res.results)
      setTotalPages(res.total_pages)
      setCurrentPage(res.current_page)
    })
  }

  useEffect(() => {
    getSpecialPackages({
      page: currentPage,
    })
  }, [currentPage])

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
          <p className="mt-2 text-sm text-gray-600">{t("description")}</p>
        </div>

        {isLoading && <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>}

        {error && <div className="flex justify-center items-center h-screen">
          <p className="text-red-500">{error?.message}</p>
        </div>}

        {specialPackages.length === 0 && <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500">No special packages found</p>
        </div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {specialPackages.map((pkg) => (
            <div key={pkg.uuid} className="rounded-lg overflow-hidden shadow-md bg-white">
              <Link href={`/special-package/${pkg.uuid}`}>  
                  <Image
                    src={pkg.image || "banner-ex2.avif"}
                    alt={`Package ${pkg.uuid}`}
                    width={600}
                    height={400}
                    className="w-full h-80 object-cover"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />}
      
    </div>
  )
}
