"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { RoomImage } from "@/lib/types"

interface RoomImageCarouselProps {
  images: RoomImage[]
  fallbackImage: string
}

export function RoomImageCarousel({ images, fallbackImage }: RoomImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const displayImages = images.length > 0 ? images.map((img) => img.image_url) : [fallbackImage]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative">
      <div className="relative h-96 md:h-[500px] bg-zinc-800 rounded-lg overflow-hidden">
        <Image
          src={displayImages[currentIndex] || "/placeholder.svg"}
          alt={`Room image ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority
        />

        {displayImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {displayImages.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {displayImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? "w-8 bg-orange-500" : "w-2 bg-zinc-700 hover:bg-zinc-600"
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
