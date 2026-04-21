"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, ChevronUp, ChevronDown, ZoomIn, ZoomOut, BookOpen, Maximize2 } from "lucide-react"
import useHttp from "@/hooks/useHttp"
import { API_ENDPOINTS } from "@/constants/apiEnds"
import { useLocale, useTranslations } from "next-intl"

const BookPreviewModal = ({
  open,
  onOpenChange,
  bookId,
  bookTitle,
  hasPreviewImages,
}) => {
  const containerRef = useRef(null)
  const [imageLoadingStates, setImageLoadingStates] = useState({})
  const [bookPreviewImages, setBookPreviewImages] = useState([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const pageRefs = useRef([])
  const t = useTranslations("book_details.preview")
  const [currentPage, setCurrentPage] = useState(1) // pagination current page
  const [totalPage, setTotalPage] = useState(0) // Pagination pages
  const [totalBookPages, setTotalBookPages] = useState(0)

  // Pagination state
  const [currentApiPage, setCurrentApiPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const { isLoading: isLoadingBookPreviewImages, sendRequests: sendRequestsBookPreviewImages } = useHttp()

  // Fetch book preview images with pagination
  const fetchBookPreviewImages = (page = 1, isLoadMore = false) => {
    if (isLoadMore) setIsLoadingMore(true)
    sendRequestsBookPreviewImages(
      {
        url_info: {
          url: API_ENDPOINTS.BOOK_PREVIEW_IMAGES(bookId) + `?page=${page}`,
        },
      },
      (data) => {
        if (isLoadMore) {
          setBookPreviewImages(prev => [...prev, ...(data?.results || [])])
        } else {
          setBookPreviewImages(data?.results || [])
        }
        // If results is empty or less than page size, no more pages
        if (data?.current_page < data?.total_pages) {
          setHasMore(true)
        } else {
          setHasMore(false)
        }
        setTotalPage(data?.total_pages || 0)
        setTotalBookPages(data?.count || 0)
        setIsLoadingMore(false)
        setCurrentApiPage(data?.current_page)
      }, (error) => {
        setIsLoadingMore(false)
      }
    )
  }

  // Reset on open/bookId change
  useEffect(() => {
    if (open) {
      setImageLoadingStates({})
      pageRefs.current = []
      setBookPreviewImages([])
      setCurrentApiPage(1)
      setHasMore(true)
      setIsLoadingMore(false)
      fetchBookPreviewImages(1, false)
    }
  }, [open, bookId])

  // Track current page based on scroll position
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !pageRefs.current.length) return

    const container = containerRef.current
    const containerTop = container.scrollTop
    const containerHeight = container.clientHeight
    const containerCenter = containerTop + containerHeight / 2

    let closestPage = 1
    let closestDistance = Number.POSITIVE_INFINITY

    pageRefs.current.forEach((pageRef, index) => {
      if (pageRef) {
        const pageTop = pageRef.offsetTop
        const pageHeight = pageRef.offsetHeight
        const pageCenter = pageTop + pageHeight / 2
        const distance = Math.abs(pageCenter - containerCenter)

        if (distance < closestDistance) {
          closestDistance = distance
          closestPage = index + 1
        }
      }
    })

    setCurrentPage(closestPage)

    // Handle load more when scrolled to bottom
    if (
      hasMore &&
      !isLoadingMore &&
      container.scrollHeight - container.scrollTop - container.clientHeight < 100 // 100px threshold
    ) {
      // Load next page
      fetchBookPreviewImages(currentApiPage + 1, true)
    }
  }, [hasMore, isLoadingMore, currentApiPage])

  // Smooth scroll to specific page
  const scrollToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPage && pageRefs.current[pageNum - 1]) {
      pageRefs.current[pageNum - 1]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }

  const scrollToNextPage = () => {
    if (currentPage < totalPage) {
      scrollToPage(currentPage + 1)
    }
  }

  const scrollToPrevPage = () => {
    if (currentPage > 1) {
      scrollToPage(currentPage - 1)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!open) return

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          scrollToPrevPage()
          break
        case "ArrowDown":
          e.preventDefault()
          scrollToNextPage()
          break
        case "PageUp":
          e.preventDefault()
          scrollToPrevPage()
          break
        case "PageDown":
          e.preventDefault()
          scrollToNextPage()
          break
        case "Home":
          e.preventDefault()
          scrollToPage(1)
          break
        case "End":
          e.preventDefault()
          scrollToPage(totalPage)
          break
        case "Escape":
          onOpenChange(false)
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [open, currentPage, totalPage])


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`flex flex-col p-0 bg-gray-50 border-gray-200 ${
          isFullscreen ? "h-screen max-h-screen w-screen max-w-none" : "h-[90vh] max-h-[90vh] w-[95vw] max-w-7xl"
        }`}
      >
        {/* Header */}
        <DialogHeader className="p-0 flex-shrink-0">
          <div className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-gray-200 shadow-sm mb-[-18px]">
            <DialogTitle className="text-lg font-semibold text-gray-900 truncate flex-1">{bookTitle}</DialogTitle>
              <Button variant="outline" size="sm" onClick={() => scrollToPage(1)} className="text-xs">
                {t("first")}
              </Button>
              <Button variant="outline" size="sm" onClick={() => scrollToPage(totalPage)} className="text-xs">
                {t("last")}
              </Button>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {t("page")} {currentPage} / {totalBookPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
          </div>
        </DialogHeader>

        {/* Main Content */}
        <div className="flex-1 min-h-0 flex bg-gray-50">
          {hasPreviewImages ? (
            <>

              {/* PDF Content Area */}
              <div className="flex-1 flex flex-col">
                {isLoadingBookPreviewImages && bookPreviewImages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <p className="text-gray-700 text-lg">{t("loading")}</p>
                    </div>
                  </div>
                ) : !totalPage ? (
                  <div className="flex-1 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-700 text-lg">{t("no_preview_images")}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* PDF Viewer - Scrollable Pages */}
                    <div
                      ref={containerRef}
                      className="flex-1 overflow-y-auto bg-gray-200 px-4 py-6"
                      onScroll={handleScroll}
                      style={{
                        scrollBehavior: "smooth",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#cbd5e1 #f1f5f9",
                      }}
                    >
                      <div className="max-w-4xl mx-auto space-y-6">
                        {bookPreviewImages.map((img, idx) => (
                          <div
                            key={idx}
                            ref={(el) => {
                              if (el) {
                                pageRefs.current[idx] = el
                              }
                            }}
                            className="relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300"
                            style={{
                              transformOrigin: "center top",
                            }}
                          >
                            {console.log(img)}
                            {/* Page Loading Overlay */}
                            {imageLoadingStates[idx + 1] && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                                <div className="text-center">
                                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                                  <p className="text-sm text-gray-600">{t("loading")}</p>
                                </div>
                              </div>
                            )}

                            {/* Page Image */}
                            <Image
                              src={typeof img === "string" ? img : `http://${img?.image}` || "/placeholder.svg"}
                              alt={`${t("page")} ${idx + 1}`}
                              width={800}
                              height={1200}
                              className="w-full h-auto block"
                              style={{
                                maxWidth: "100%",
                                height: "auto",
                              }}
                            />

                            {/* Page Number Badge */}
                            <div className="absolute top-4 right-4 text-black text-sm px-3 py-1">
                              {idx + 1}
                            </div>

                            {/* Current Page Indicator */}
                            {currentPage === idx + 1 && (
                              <div className="absolute inset-0 ring-4 ring-blue-500 ring-opacity-50 pointer-events-none rounded-lg" />
                            )}
                          </div>
                        ))}
                        {/* Load More Loader */}
                        {isLoadingMore && (
                          <div className="flex justify-center py-6">
                            <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                          </div>
                        )}
                        {/* No more pages indicator */}
                        {!hasMore && totalPage > 0 && (
                          <div className="flex justify-center py-4 text-gray-400 text-sm">
                            {t("no_more_pages") || "No more pages"}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-100">
              <div className="text-center p-10 bg-white rounded-xl shadow-lg border border-gray-200">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 mb-4 text-lg font-medium">{t("no_preview_images")}</p>
                <Button
                  onClick={() => onOpenChange(false)}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {t("close")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BookPreviewModal
