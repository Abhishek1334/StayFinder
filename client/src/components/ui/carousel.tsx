"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CarouselContextType {
  currentSlide: number;
  totalSlides: number;
  setCurrentSlide: (slide: number | ((prev: number) => number)) => void;
  setTotalSlides: (total: number) => void;
}

const CarouselContext = React.createContext<CarouselContextType>({
  currentSlide: 0,
  totalSlides: 0,
  setCurrentSlide: () => {},
  setTotalSlides: () => {},
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
        setTotalSlides,
      }}
    >
      <div className={cn("relative", className)} {...props}>
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
  const { currentSlide, setTotalSlides } = React.useContext(CarouselContext)
  const slides = React.Children.toArray(children)

  React.useEffect(() => {
    setTotalSlides(slides.length)
  }, [slides.length, setTotalSlides])

  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {children}
      </div>
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
      className={cn("w-full flex-shrink-0", className)}
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
  const { setCurrentSlide, totalSlides } = React.useContext(CarouselContext)

  const handlePrevious = () => {
    setCurrentSlide((prev: number) => (prev - 1 + totalSlides) % totalSlides)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "absolute left-2 top-1/2 -translate-y-1/2 z-10",
        className
      )}
      onClick={handlePrevious}
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
  const { setCurrentSlide, totalSlides } = React.useContext(CarouselContext)

  const handleNext = () => {
    setCurrentSlide((prev: number) => (prev + 1) % totalSlides)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2 z-10",
        className
      )}
      onClick={handleNext}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
} 