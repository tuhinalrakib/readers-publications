"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Star, Quote, MessageCircle } from "lucide-react"
import { API_ENDPOINTS } from "@/constants/apiEnds"
import { useEffect, useState } from "react"
import useHttp from "@/hooks/useHttp"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { useLocale, useTranslations } from "next-intl"
import Autoplay from "embla-carousel-autoplay"

export function TestimonialsSlider() {
  const {sendRequests: fetchTestimonials, isLoading} = useHttp()
  const [testimonials, setTestimonials] = useState<any[]>([])
  const locale = useLocale()
  const t = useTranslations("home")

  useEffect(() => {
    fetchTestimonials({
      url_info: {
        url: API_ENDPOINTS.TESTIMONIALS,
      }
    }, (res: any) => {
      setTestimonials(res)
    })
  }, [])

  if (isLoading) return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  )

  if (testimonials.length === 0) return null

  return (
    <div className="py-8 bg-gradient-to-r from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {t("testimonials_section_title")}
            </h2>
          </div>
          <p className="text-gray-600 max-w-4xl mx-auto text-sm">
            {t("testimonials_section_subtitle")}
          </p>
        </div>

        <Carousel 
          className="w-full mx-auto"
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
                <Card className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                        <AvatarImage src={testimonial.image_url} />
                        <AvatarFallback className="bg-blue-50 text-blue-700 text-sm">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">
                          {locale === "bn" && testimonial.name_bn ? testimonial.name_bn : testimonial.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {locale === "bn" && testimonial.city_bn ? testimonial.city_bn : testimonial.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-200 fill-gray-200"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="relative">
                      <Quote className="absolute -top-1 -left-1 w-4 h-4 text-blue-200" />
                      <p className="text-gray-700 text-sm leading-relaxed pl-4 italic line-clamp-3">
                        "{locale === "bn" && testimonial.comment_bn ? testimonial.comment_bn : testimonial.comment}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 bg-white shadow-md border-0 hover:bg-blue-50 h-8 w-8" />
          <CarouselNext className="-right-4 bg-white shadow-md border-0 hover:bg-blue-50 h-8 w-8" />
        </Carousel>

        {/* <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">আপনিও আমাদের সাথে আপনার অভিজ্ঞতা শেয়ার করুন</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            রিভিউ লিখুন
          </button>
        </div> */}
      </div>
    </div>
  )
}
