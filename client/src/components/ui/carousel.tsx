"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const CarouselContext = React.createContext<{
  currentSlide: number
  totalSlides: number
  setCurrentSlide: (slide: number) => void
}>({
  currentSlide: 0,
  totalSlides: 0,
  setCurrentSlide: () => {},
})

export function Carousel({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [totalSlides, setTotalSlides] = React.useState(0)

  return (
    <CarouselContext.Provider
      value={{
        currentSlide,
        totalSlides,
        setCurrentSlide,
      }}
    >
      <div
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

export function CarouselContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { setTotalSlides } = React.useContext(CarouselContext)
  const slides = React.Children.toArray(children)

  React.useEffect(() => {
    setTotalSlides(slides.length)
  }, [slides.length, setTotalSlides])

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CarouselItem({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CarouselPrevious({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { currentSlide, setCurrentSlide, totalSlides } = React.useContext(CarouselContext)

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "absolute left-2 top-1/2 -translate-y-1/2",
        className
      )}
      onClick={() => setCurrentSlide((currentSlide - 1 + totalSlides) % totalSlides)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

export function CarouselNext({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { currentSlide, setCurrentSlide, totalSlides } = React.useContext(CarouselContext)

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2",
        className
      )}
      onClick={() => setCurrentSlide((currentSlide + 1) % totalSlides)}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
} 