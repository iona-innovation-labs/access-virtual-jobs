'use client'

import ModalVideo from '@/components/landing/modal-video'
import VideoThumb from '@/public/images/landing/hero-blur.svg'
import { landingPage } from '@/config/landing-page.config'
import CtaButton from './cta-button'

export default function Explainer() {

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h2 className="font-archivo text-2xl md:text-4xl font-bold">{landingPage.explainer.title}</h2>
          </div>
          <div className="flex justify-center pb-12 md:pb-16" data-aos="fade-up">

            <ModalVideo
              thumb={VideoThumb}
              thumbWidth={768}
              thumbHeight={432}
              thumbAlt="Modal video thumbnail"
              video={landingPage.explainer.video.src}
              videoWidth={1920}
              videoHeight={1080} />   

          </div>
          <div className="relative pb-12" data-aos="fade-in">
            <div className="hidden lg:block absolute top-4 left-32 right-32 mt-px h-0.5 bg-gray-200 -z-10" aria-hidden="true" />
            <div className="max-w-sm mx-auto grid gap-12 sm:grid-cols-2 sm:max-w-3xl lg:grid-cols-4 lg:max-w-none items-start">
              {
                landingPage.explainer.explainers.map((explainer, index) => (
                  <div className="text-center" key={index}>
                    <div className="w-9 h-9 bg-gray-900 border-2 border-white text-white text-[15px] font-bold rounded-full inline-flex items-center justify-center mb-3">
                      {index + 1}
                    </div>
                    <h3 className="font-cabinet-grotesk font-bold text-lg">{explainer.title}</h3>
                    <div className="text-gray-500">{explainer.description}</div>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="text-center" data-aos="fade-in">
            <CtaButton
              link='/register'
              label='Create your account'
              className='bg-brand'
            />
          </div>
        </div>
      </div>
    </section>
  )
}