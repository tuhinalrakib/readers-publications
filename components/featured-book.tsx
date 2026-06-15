import Image from "next/image"
import { CalendarDays, Star, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Book {
  title: string
  author: string
  coverImage: string
  description: string
  price: string
  rating: number
  releaseDate: string
  pages: number
  isbn: string
}

interface FeaturedBookProps {
  book: Book
}

export function FeaturedBook({ book }: FeaturedBookProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2">
          <div className="relative flex h-[400px] items-center justify-center bg-slate-100 p-8 md:h-auto">
            <div className="relative h-full max-h-[400px] w-[250px] drop-shadow-xl">
              <Image src={book.coverImage || "/placeholder.svg"} alt={book.title} fill className="object-contain" />
            </div>
          </div>
          <div className="flex flex-col justify-center p-6 md:p-8">
            <div className="mb-2 flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(book.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">{book.rating} out of 5</span>
            </div>
            <h3 className="mb-2 text-2xl font-bold md:text-3xl">{book.title}</h3>
            <p className="mb-4 text-lg text-muted-foreground">by {book.author}</p>
            <p className="mb-6 text-muted-foreground">{book.description}</p>
            <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-slate-500" />
                <span>Released: {book.releaseDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-slate-500" />
                <span>{book.pages} pages</span>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <span className="text-slate-500">ISBN:</span>
                <span>{book.isbn}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-2xl font-bold">{book.price}</span>
              <Button className="bg-red-600 hover:bg-red-700">Add to Cart</Button>
              <Button variant="outline">View Details</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
