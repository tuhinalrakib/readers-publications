'use client'

import { Clock, HeartIcon, Loader2, ShoppingCartIcon, TrashIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import useHttp from '@/hooks/useHttp'
import { API_ENDPOINTS } from '@/constants/apiEnds'
import Pagination from '@/components/pagination'
import useCart from '@/hooks/useCart'

const Wishlist = () => {
    const {addToCart} = useCart()
    const {sendRequests, isLoading} = useHttp()
    const {sendRequests: deleteWishlist, isLoading: isDeleting} = useHttp()
    const [wishlist, setWishlist] = useState([])
    const locale = useLocale()
    const t = useTranslations("profile.wishlist")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchWishlist = (params) => {
        sendRequests({
            url_info: {
                url: API_ENDPOINTS.WISHLIST,
                is_auth_required: true,
            },
            params: params,
        }, (data) => {
            setWishlist(data.results)
            setTotalPages(data.total_pages)
        })
    }

    useEffect(() => {
        fetchWishlist({
           page: currentPage
        })
    }, [currentPage])

    const handleDeleteWishlist = (id) => {
        deleteWishlist({
            url_info: {
                url: API_ENDPOINTS.WISHLIST_DELETE(id),
                is_auth_required: true,
            },
            method: "DELETE",
        }, (data) => {
            setWishlist(prev => prev.filter(item => item.id !== id))
        })
    }

    const handleAddToCart = (book) => {
        let bookData = {
          quantity: 1,
          book_details: {
            id: book.book_id,
            slug: book.slug,
            title: book.title,
            title_bn: book.title_bn,
            cover_image: book.cover_image,
            price: book.price,
            discounted_price: book.discounted_price,
            is_available: book.is_available,
          },
          author_details: {
            id: book.author_id,
            slug: book.author_slug,
            name: book.author_name,
            name_bn: book.author_name_bn,
          }
        }
        addToCart(bookData, 1)
      }

    return (
        <div className="rounded-xl bg-white p-6 shadow-lg">

            {wishlist.length > 0 && !isLoading ? (
                <div className="space-y-4">
                    {wishlist.map((item, index) => (
                        <div
                            key={`${item.book_id}-${index}`}
                            className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-md"
                        >
                            <div className="flex items-center">
                                <div className="relative mr-4 h-20 w-14 overflow-hidden rounded-md border border-gray-200">
                                    <Link href={`/${locale}/books/${item.slug}`}>
                                        <Image
                                            src={item.cover_image || "/images/book-skeleton.jpg"}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </Link>
                                </div>
                                <div>
                                    <Link href={`/${locale}/books/${item.slug}`}>
                                        <h3 className="font-medium text-gray-900 group-hover:text-brand-600">{locale === "bn" ? item.title_bn : item.title}</h3>
                                    </Link>
                                    <Link href={`/${locale}/authors/${item.author_slug}`}><p className="text-sm text-gray-500">{locale === "bn" ? item.author_name_bn : item.author_name}</p></Link>
                                    <p className="mt-1 font-medium text-brand-600">{item.price} tk</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Button size="sm" className="bg-brand-600 hover:bg-brand-700" onClick={() => handleAddToCart(item)}>
                                    <ShoppingCartIcon className="h-4 w-4" />
                                    <span>Add to Cart</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => handleDeleteWishlist(item.id)}
                                    disabled={isDeleting}
                                >
                                    <TrashIcon className="h-4 w-4" />
                                    <span>Remove</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 rounded-full bg-gray-100 p-6">
                        <HeartIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium">No wishlist</h3>
                    <p className="mb-6 max-w-md text-gray-500">
                        Oh no! Your wishlist is empty.
                    </p>
                    <Button className="bg-brand-600 hover:bg-brand-700" asChild>
                        <Link href={`/${locale}/books`}>Browse Books</Link>
                    </Button>
                </div>
            )}

            {totalPages > 1 && !isLoading && (
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            )}
        </div>
    )
}

export default Wishlist