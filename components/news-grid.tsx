"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Clock, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLocale } from "next-intl"
import useCart from "@/hooks/useCart"

export function NewsGrid({ book_type, books }: { book_type: string, books: any[] }) {
  const locale = useLocale()
  const { addToCart } = useCart()

  const handleAddToCart = (book: any) => {
    let bookData = {
      quantity: 1,
      book_details: {
        id: book.id,
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
        name: book.author_full_name,
        name_bn: book.author_full_name_bn,
      }
    }
    addToCart(bookData, 1)
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4">
      {/* Grid Container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 md:gap-5 lg:gap-6 py-4 sm:py-6">
        {books.length === 0 && (
          <div className="col-span-full flex items-center justify-center min-h-[60vh]">
            <p className="text-gray-500 text-sm sm:text-base font-medium">No books found</p>
          </div>
        )}
        
        {books.map((book) => (
          <div key={book.id} className="group">
            <div className="relative w-full min-h-[340px] sm:min-h-[400px] flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-gray-200 hover:shadow-md hover:-translate-y-1">
              <div className="relative w-full aspect-[3/4] bg-gray-50 flex-shrink-0">
                <Image
                  src={book.cover_image || "/images/book-skeleton.jpg"}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33.33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16.67vw"
                  priority
                />
                {book.isNew && (
                  <Badge className="absolute left-2 top-2 bg-red-500/90 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 shadow-sm backdrop-blur-sm font-medium">New</Badge>
                )}
                {book.discounted_price < book.price && (
                  <Badge className="absolute right-2 top-2 bg-red-500/90 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 shadow-sm backdrop-blur-sm font-medium">
                    {Math.round(((book.price - book.discounted_price) / book.price) * 100)}% OFF
                  </Badge>
                )}
                <Link href={`/${locale}/books/${book.slug}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              </div>

              <div className="p-2 sm:p-3 flex flex-col flex-1 min-h-0 space-y-1">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${i < Math.floor(book.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                      />
                    ))}
                    <span className="ml-1 text-[10px] sm:text-xs text-gray-500 font-medium">{book.rating}</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between min-h-0">
                  <div className="space-y-0.5 sm:space-y-2">
                    <Link href={`/${locale}/books/${book.slug}`}>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight transition-colors group-hover:text-blue-600 line-clamp-2">
                        {locale === "bn" ? book.title_bn : book.title}
                      </h3>
                    </Link>

                    <Link href={`/${locale}/authors/${book.author_slug}`}>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-600 line-clamp-1 hover:text-gray-800 transition-colors">
                        {locale === "bn" ? book.author_full_name_bn : book.author_full_name}
                      </p>
                    </Link>
                  </div>

                  <div className="mt-1 sm:mt-3 space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        {book.discounted_price < book.price ? (
                          <span className="text-xs sm:text-sm font-bold text-blue-600">৳{book.discounted_price}</span>
                        ) : (
                          <span className="text-xs sm:text-sm font-bold text-blue-600">৳{book.price}</span>
                        )}
                        {book.discounted_price < book.price && (
                          <span className="text-[10px] sm:text-xs font-medium text-gray-400 line-through">
                            ৳{book.price}
                          </span>
                        )}
                      </div>
                      {book.stock_status && (
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium">
                          <Clock className="h-3 w-3 text-green-500" />
                          <span className="text-green-600 hidden sm:inline">{book.stock_status}</span>
                        </div>
                      )}
                    </div>

                    {/* Cart Buttons */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hidden sm:flex w-full py-1.5 sm:py-2 bg-white hover:bg-brand-50 border-brand-200 text-brand-600 hover:text-brand-700 transition-colors text-xs sm:text-sm font-medium h-8 sm:h-9"
                        aria-label="Add to cart"
                        type="button"
                        onClick={() => {
                          handleAddToCart(book);
                        }}
                      >
                        <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Add to Cart
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="sm:hidden w-7 h-7 sm:w-8 sm:h-8 p-0 bg-white hover:bg-brand-50 border-brand-200 text-brand-600 hover:text-brand-700 transition-colors ml-auto"
                        aria-label="Add to cart"
                        type="button"
                        onClick={() => {
                          handleAddToCart(book);
                        }}
                      >
                        <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewsGrid
