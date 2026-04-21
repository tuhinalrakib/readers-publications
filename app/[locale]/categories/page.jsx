"use client"

import Link from "next/link"
import { BookOpen, PenLine, Lightbulb, Rocket, Users } from "lucide-react"

export default function CategoryListPage() {
  const categories = [
    {
      title: "Fiction",
      description: "Immerse yourself in creative storytelling, novels, and short stories.",
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      slug: "fiction"
    },
    {
      title: "Non-Fiction",
      description: "Explore real-world insights, biographies, and documentary writing.",
      icon: <PenLine className="h-6 w-6 text-green-600" />,
      slug: "non-fiction"
    },
    {
      title: "Publishing Tips",
      description: "Guides, advice, and industry knowledge for aspiring writers and publishers.",
      icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
      slug: "publishing-tips"
    },
    {
      title: "Technology & Trends",
      description: "Insights on AI, digital tools, and how tech is shaping publishing.",
      icon: <Rocket className="h-6 w-6 text-purple-600" />,
      slug: "tech-trends"
    },
    {
      title: "Author Spotlights",
      description: "Meet our featured writers and learn from their creative journeys.",
      icon: <Users className="h-6 w-6 text-pink-500" />,
      slug: "author-spotlights"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Explore Categories</h1>
          <p className="text-gray-600">Browse our content by topic to dive deeper into your interests.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link key={index} href={`/category/${category.slug}`} className="block">
              <div className="bg-white rounded-lg shadow hover:shadow-md transition p-6 h-full">
                <div className="flex items-center mb-3">
                  {category.icon}
                  <h2 className="ml-3 text-xl font-semibold text-blue-700">{category.title}</h2>
                </div>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
