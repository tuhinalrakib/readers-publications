"use client"

import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import useHttp from "@/hooks/useHttp"
import { API_ENDPOINTS } from "@/constants/apiEnds"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

export default function BlogDetailPage() {
    const t = useTranslations("blog")
    const locale = useLocale()
    const { sendRequests, isLoading, error } = useHttp()
    const [post, setPost] = useState(null)
    const router = useRouter()
    const { id } = useParams()

    const getBlogPost = () => {
        sendRequests({
            url_info: {
                url: API_ENDPOINTS.BLOG_DETAIL(id),
            },
        }, (res) => {
            setPost(res)
        })
    }

    useEffect(() => {
        if (id) {
            getBlogPost()
        }
    }, [id])

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-8 w-8 bg-blue-600 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}

                {!isLoading && error && (
                    <div className="text-center py-12 bg-red-50 rounded-2xl shadow-lg">
                        <Link
                            href="/blog"
                            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                        >
                            Back to Blog List
                        </Link>
                    </div>
                )}

                {!isLoading && !error && post && (
                    <div className="max-w-5xl mx-auto">
                        <article className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                            <div className="relative w-full h-60 sm:h-72 md:h-96 lg:h-[28rem]">
                                <img
                                    src={post?.cover_image}
                                    alt={locale === "bn" ? post.title_bn : post.title}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80"></div>
                            </div>

                            <div className="p-6 sm:p-8 md:p-10">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                                    {locale === "bn" ? post.title_bn : post.title}
                                </h1>
                                <p className="text-base sm:text-lg text-gray-600 mb-6 font-light leading-relaxed">
                                    {locale === "bn" ? post.subtitle_bn : post.subtitle}
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm md:text-base text-gray-600 mb-8">
                                    <div className="flex items-center space-x-4">
                                        <span className="font-semibold">{post.published_date}</span>
                                        <span className="hidden sm:block">•</span>
                                        <span>{post.read_time} min read</span>
                                    </div>
                                    <div className="mt-3 sm:mt-0 flex items-center space-x-3">
                                        <img
                                            src={post?.author_image || "https://via.placeholder.com/40"}
                                            alt={locale === "bn" ? post.author_name_bn : post.author_name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                                        />
                                        <span className="font-semibold text-gray-700">
                                            By {locale === "bn" ? post.author_name_bn : post.author_name}
                                        </span>
                                    </div>
                                </div>

                                <div className="prose prose-lg max-w-none text-gray-800 leading-8">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: locale === "bn" ? post.content_bn : post.content,
                                        }}
                                    />
                                </div>

                                <div className="mt-10 flex justify-between items-center">
                                    <Link
                                        href="/blog"
                                        className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold text-sm sm:text-base shadow-md hover:shadow-lg"
                                    >
                                        <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Back to Blog List
                                    </Link>
                                    {/* <div className="flex space-x-4">
                                        <button
                                            className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                                            title="Share on Twitter"
                                        >
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                                            </svg>
                                        </button>
                                        <button
                                            className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                                            title="Share on Facebook"
                                        >
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" />
                                            </svg>
                                        </button>
                                    </div> */}
                                </div>
                            </div>
                        </article>
                    </div>
                )}
            </div>
        </div>
    )
}