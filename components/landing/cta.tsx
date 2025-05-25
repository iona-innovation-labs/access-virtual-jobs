import Image from 'next/image'
import Link from 'next/link'
import Illustration from '@/public/images/landing/hero-blur.svg'
import CtaButton from './cta-button'

export default function Cta() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600 -z-10" aria-hidden="true" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none overflow-hidden -z-10 h-full w-full">
            <Image className="w-full h-full object-cover opacity-50" src={Illustration} alt="Illustration" />
        </div>


      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-archivo text-xl md:text-3xl font-bold text-white mb-8" data-aos="fade-up">
              Start hiring reliable and trustworthy talents today.
            </h2>
            <div data-aos="fade-up" data-aos-delay="100">
              <CtaButton/>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}