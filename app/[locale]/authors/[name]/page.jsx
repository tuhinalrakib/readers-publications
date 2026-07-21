"use client"

import { useTranslations, useLocale } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, Users, Award, Star, PenLine, Calendar, Globe, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useHttp from "@/hooks/useHttp"
import { API_ENDPOINTS } from "@/constants/apiEnds"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"


export default function AuthorPage() {
  const t = useTranslations()
  const locale = useLocale()
  const {sendRequests, isLoading} = useHttp()
  const [author, setAuthor] = useState({})
  const {name} = useParams()
  
  useEffect(() => {
    sendRequests({
      url_info: {
        url: API_ENDPOINTS.AUTHOR_DETAIL(name),
      }
    }, (res) => {
      setAuthor(res)
    })
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-brand-600 mb-4" />
        <p className="text-slate-500 text-sm">Loading author profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">

      {/* Author Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto py-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={author.profile_picture} alt={author.name} />
                <AvatarFallback className="bg-brand-50 text-4xl text-brand-600">
                  {author.name?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h1 className="mb-2 text-3xl font-bold text-slate-900">{locale === "bn" ? author.name_bn : author.name}</h1>
              <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{author.rating} ({author.rating_count})</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{author.book_list?.length} Books</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Author Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>About the Author</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-slate-600">{locale === "bn" ? author.description_bn : author.description}</p>
                
                {author.country && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Nationality</p>
                      <p className="text-sm text-slate-500">{author.country}</p>
                    </div>
                  </div>
                </div>
                )}

                <div>
                  <div className="flex flex-wrap gap-2">
                    {author?.tags?.length > 0 && author.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
                      >
                        {locale === "bn" ? tag.name_bn : tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Author Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Author Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total Books</span>
                  <span className="font-medium text-slate-900">{author.book_list?.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Average Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-slate-900">{author.rating} ({author.rating_count})</span>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>


      </div>
    </div>
  )
}
