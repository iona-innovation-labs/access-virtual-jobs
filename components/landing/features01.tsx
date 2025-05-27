'use client'

import { useEffect } from 'react'
import Image from 'next/image'
// import Illustration from '@/public/images/landing/hero-blur.svg'
// import Carousel01 from '@/public/images/landing-feature/1.jpg'
// import Carousel02 from '@/public/images/landing-feature/2.jpg'
// import Carousel03 from '@/public/images/landing-feature/3.jpg'
// import Carousel04 from '@/public/images/landing-feature/4.jpg'
// import Carousel05 from '@/public/images/landing-feature/5.jpg'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// @ts-ignore
import Swiper, { Navigation } from 'swiper'
import 'swiper/swiper.min.css'
import { landingPage } from '@/config/landing-page.config'


export default function Features01() {
  Swiper.use([Navigation])
  useEffect(() => {
    new Swiper('.carousel', {
      slidesPerView: 'auto',
      grabCursor: true,
      loop: false,
      centeredSlides: false,
      initialSlide: 0,
      spaceBetween: 24,
      watchSlidesProgress: true,
      navigation: {
        nextEl: '.carousel-next',
        prevEl: '.carousel-prev',
      },
    })
  }, [])

  return (
    <section className="relative">
      <div className="absolute inset-0 bg-brand -z-10" aria-hidden="true" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none overflow-hidden -z-10 h-full w-full">
            <Image className="w-full h-full object-cover" src={landingPage.features.bgImage} alt="Illustration" />
        </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="max-w-3xl pb-12 md:pb-16" data-aos="fade-in">
            <h2 className="font-archivo text-2xl md:text-4xl font-bold text-white">
              {landingPage.features.title}
            </h2>
          </div>

          <div className="pb-12 md:pb-16" data-aos="fade-in">
            <div className="carousel swiper-container mx-auto max-w-sm sm:max-w-none">
              <div className="swiper-wrapper">
                {
                  landingPage.features.images.map((image, index) => (
                    <div key={index} className="swiper-slide max-w-[446px] h-auto">
                      <Image
                        className="aspect-4/3 h-full w-full object-cover"
                        src={image.src}
                        alt={`Carousel ${index + 1}`}
                      />
                    </div>
                  ))
                }
              </div>
            </div>

            <div className="mt-12 flex justify-end space-x-3">
              <button className="carousel-prev relative z-20 flex h-11 w-11 items-center justify-center rounded-full bg-gray-900">
                <span className="sr-only">Previous</span>
                <svg
                  className="fill-blue-500 transition duration-150 ease-in-out group-hover:fill-white"
                  width="13"
                  height="12"
                  viewBox="0 0 13 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m3.914 5 3.5-3.5L6 .086 1.086 5H1v.086L.086 6 1 6.914V7h.086L6 11.914 7.414 10.5 3.914 7H13V5z" />
                </svg>
              </button>
              <button className="carousel-next relative z-20 flex h-11 w-11 items-center justify-center rounded-full bg-gray-900">
                <span className="sr-only">Next</span>
                <svg
                  className="fill-blue-500 transition duration-150 ease-in-out group-hover:fill-white"
                  width="13"
                  height="12"
                  viewBox="0 0 13 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m9.086 5-3.5-3.5L7 .086 11.914 5H12v.086l.914.914-.914.914V7h-.086L7 11.914 5.586 10.5l3.5-3.5H0V5z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mx-auto grid max-w-sm items-start gap-6 sm:grid-cols-2 sm:max-w-3xl lg:grid-cols-4 lg:max-w-none" data-aos="fade-in">
            
            {landingPage.features.items.map((item, i)=> (
              <Card
                key={i}
                className="relative border-none bg-transparent h-full text-white p-5 hover:before:opacity-20 before:absolute before:inset-0 before:rounded-sm before:bg-gradient-to-tr before:from-white before:to-white/25 before:opacity-0 before:transition-all before:duration-150 before:ease-in-out"
              >
                <CardHeader className="p-0">{item.icon}</CardHeader>
                <CardTitle className="text-lg font-cabinet-grotesk font-bold">{item.title}</CardTitle>
                <CardContent className="text-white/80 p-0 pt-2 text-sm leading-relaxed">
                  {item.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
