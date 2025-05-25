'use client'

import { useEffect } from 'react'
// @ts-ignore
import Swiper, { Autoplay } from 'swiper'
import 'swiper/swiper.min.css'
Swiper.use([Autoplay])

import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { useRouter } from 'next/navigation'

export interface IJobListing {
  id: string
  url: string
  title: string
  pay?: string
  description?: string
  createdAt: string
  postedBy: string
}

const jobListings: IJobListing[] = [...Array(6)].map((_, i) => ({
  id: `${i}`,
  url: `/job/${i}`,
  title: `Job ${i + 1}`,
  pay: `$${25 + i}/hr`,
  description: `Description for job temp temp temp temp right left${i + 1}`,
  createdAt: "2025-05-25",
  postedBy: `Company ${i + 1}`,
}))

export default function Clients() {
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => {
      new Swiper('.clients-carousel', {
        slidesPerView: 'auto',
        spaceBetween: 16,
        centeredSlides: true,
        loop: true,
        speed: 5000,
        noSwiping: true,
        noSwipingClass: 'swiper-slide',
        autoplay: {
          delay: 0,
          disableOnInteraction: true,
        },
      });
    }, 100); // delay for hydration completion

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="bg-gray-900" data-aos="fade-in">
      <div className="py-12 md:py-20">
        <div className="clients-carousel swiper-container relative before:absolute before:inset-0 before:w-32 before:z-10 before:bg-gradient-to-r before:from-gray-900 after:absolute after:inset-0 after:left-auto after:w-32 after:z-10 after:bg-gradient-to-l after:from-gray-900">
          <div className="swiper-wrapper ease-linear! select-none">
            {jobListings.map((job) => (
              <div
                key={job.id}
                onClick={() => router.push(`/job/${job.id}`)}
                className="swiper-slide w-80! h-auto bg-gray-800 rounded-2xl p-4 text-white hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <Card className="cursor-pointer bg-gradient-to-br h-full from-gray-800 to-gray-900 text-white border-none shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <h3 className="text-xl font-semibold tracking-tight">{job.title}</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {job.description?.slice(0, 30)}...
                    </p>
                    <div className="flex flex-col gap-1 text-sm text-gray-400">
                      <p>
                        <span className="font-medium text-gray-200">Posted by:</span> {job.postedBy}
                      </p>
                      <p>
                        <span className="font-medium text-gray-200">Pay:</span> {job.pay || "Not specified"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
