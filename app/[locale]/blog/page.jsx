"use client"

import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import useHttp from "@/hooks/useHttp"
import { API_ENDPOINTS } from "@/constants/apiEnds"
import { useState } from "react"
import { useEffect } from "react"
import Pagination from "@/components/pagination"

export default function BlogListPage() {
    const t = useTranslations("blog")
    const locale = useLocale()
    const {sendRequests, isLoading, error} = useHttp()
    const [blogPosts, setBlogPosts] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const getBlogPosts =  (params = {}) => {
      sendRequests({
        url_info: {
          url: API_ENDPOINTS.BLOG_LIST,
        },
        params: params
      }, (res) => {
        setBlogPosts(res.results)
        setTotalPages(res.total_pages)
        setCurrentPage(res.current_page)
      })
    }

    useEffect(() => {
        getBlogPosts({
            page: currentPage,
        })  
    }, [currentPage])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 mb-10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">{t("title")}</h1>
          <p className="text-gray-600">{(t("subtitle"))}</p>
        </div>

        {isLoading && <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>}

        {blogPosts?.length === 0 && (
          <div className="flex justify-center items-center h-screen">
            <p className="text-gray-600">No blog posts found</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts?.map((post) => (
            <div key={post.id} className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition duration-300">
              <Link href={`/blog/${post.slug}`}>
                <img src={post.cover_image} alt={post.title} className="w-full h-48 object-cover" />
              </Link>
              <div className="p-6">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-bold text-blue-700 hover:underline">{locale === "bn" ? post.title_bn : post.title}</h2>
                </Link>
                <p className="text-sm text-gray-500 mb-1">{locale === "bn" ? post.subtitle_bn : post.subtitle}</p>
                <p className="text-sm text-gray-600 mb-3">{locale === "bn" ? post.content_bn : post.content}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{post.published_date}</span>
                  <span>{post.read_time} min read</span>
                </div>
                <div className="mt-2 text-sm text-gray-700">By {locale === "bn" ? post.author_name_bn : post.author_name}</div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-block text-blue-600 hover:underline text-sm"
                >
                  Read more →
                </Link>
              </div>
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
