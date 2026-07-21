"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart, Trash2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale, useTranslations } from 'next-intl'
import useHttp from "@/hooks/useHttp"
import { API_ENDPOINTS } from "@/constants/apiEnds"
import Pagination from "@/components/pagination"
import useCart from "@/hooks/useCart"

export default function WishlistPage() {
  const t = useTranslations('wishlist')
  const currentLocale = useLocale()
  const [wishlist, setWishlist] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const {sendRequests, isLoading} = useHttp() 
  const {addToCart} = useCart()
  const {sendRequests: deleteWishlist, isLoading: isDeleting} = useHttp()

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
      setWishlist(wishlist.filter(book => book.id !== id))
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <Heart className="mx-auto h-8 w-8 text-brand-600 mb-2" />
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <p className="text-gray-600 text-sm">{t('description')}</p>
          </div>

          {wishlist.length > 0 ? (
            <div className="space-y-6">
              {wishlist.map(book => (
                <div
                  key={book.book_id}
                  className="flex items-center gap-4 bg-white rounded-lg shadow-sm p-4"
                >
                  <Link href={`/${currentLocale}/books/${book.slug}`}>
                  <img
                    src={book.cover_image || "/images/book-skeleton.jpg"}
                    alt={book.title}
                    className="h-24 w-16 object-cover rounded-md"
                  />
                  </Link>
                  <div className="flex-1">
                    <Link href={`/${currentLocale}/books/${book.slug}`}> <h2 className="text-lg font-semibold">{currentLocale === "bn" ? book.title_bn : book.title}</h2></Link>
                    <Link href={`/${currentLocale}/authors/${book.author_slug}`}> <p className="text-sm text-gray-500">{currentLocale === "bn" ? book.author_name_bn : book.author_name}</p></Link>
                    <p className="text-sm font-medium mt-1">{book.price}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="default" size="sm" className="flex gap-2" onClick={() => handleAddToCart(book)}>
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteWishlist(book.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-10">
              <p>{t('empty')}</p>
              <Link
                href={`/${currentLocale}/books`}
                className="inline-block mt-4 text-brand-600 hover:underline"
              >
                Browse Books
              </Link>
            </div>
          )}
        </div>
      </div>

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
