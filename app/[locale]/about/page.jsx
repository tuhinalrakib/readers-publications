"use client"

import { useTranslations } from "next-intl"

export default function AboutUsPage() {
  const t = useTranslations("about_us")

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-base text-gray-600">{t("subtitle")}</p>
        </div>

        <div className="space-y-10 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
            <p>
              At Rising Publications, we envision a world where every voice is heard and every story finds its audience. 
              We believe in the transformative power of words to educate, inspire, and connect. Our goal is to be the bridge between talented writers and curious readers around the globe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Who We Are</h2>
            <p>
              Established by a group of passionate writers, editors, and creatives, Rising Publications is an independent publishing company 
              dedicated to discovering unique voices and producing high-quality literary works. From fiction and poetry to educational materials 
              and research journals, we handle every project with care, creativity, and purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">What We Do</h2>
            <p>
              We publish books, magazines, journals, and digital content across a wide range of genres and topics. Our services include:
              manuscript editing, cover design, distribution, and marketing. Whether you're an aspiring author or a seasoned researcher, 
              we provide the platform and support you need to get your work into the world.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Why Choose Us</h2>
            <p>
              We’re not just a publisher — we’re your creative partner. We focus on building relationships, not just products. 
              With a commitment to excellence, transparency, and collaboration, we help authors grow and succeed in today’s competitive literary landscape.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Join Our Journey</h2>
            <p>
              Whether you’re a writer with a story to tell, a reader searching for new ideas, or a collaborator looking to make a difference — 
              Rising Publications welcomes you. Together, let's shape the future of publishing with innovation, integrity, and inspiration.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
