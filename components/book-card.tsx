import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface Book {
  id: number
  title: string
  author: string
  coverImage: string
  price: string
  category: string
  rating: number
}

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <Image
            src={book.coverImage || "/placeholder.svg"}
            alt={book.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          <Badge className="absolute right-2 top-2 bg-red-600 hover:bg-red-700">{book.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < Math.floor(book.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">{book.rating}</span>
        </div>
        <Link href={`/books/${book.id}`}>
          <h3 className="line-clamp-2 text-lg font-semibold hover:text-red-600">{book.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">by {book.author}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <span className="font-semibold">{book.price}</span>
        <Button size="sm" variant="outline">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
