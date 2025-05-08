"use client";

import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutUs() {
  const { t } = useLanguage();

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-12 md:py-20">
        <div className="container mx-auto text-center px-4 md:px-0">
          <h1 className="text-3xl md:text-4xl font-bold">{t('about_title')}</h1>
          <p className="mt-4 text-base md:text-lg">{t('about_subtitle')}</p>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto text-center px-4 md:px-6">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-black">{t('about_objectives')}</h2>
          <p className="text-gray-600 mb-6">{t('about_objectives_subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="bg-white p-4 md:p-6 shadow-md rounded">
              <h3 className="text-lg md:text-xl font-semibold text-black">{t('about_digital')}</h3>
              <p className="mt-2 text-sm md:text-base text-gray-600">{t('about_digital_desc')}</p>
            </div>
            <div className="bg-white p-4 md:p-6 shadow-md rounded">
              <h3 className="text-lg md:text-xl font-semibold text-black">{t('about_security')}</h3>
              <p className="mt-2 text-sm md:text-base text-gray-600">{t('about_security_desc')}</p>
            </div>
            <div className="bg-white p-4 md:p-6 shadow-md rounded">
              <h3 className="text-lg md:text-xl font-semibold text-black">{t('about_collaboration')}</h3>
              <p className="mt-2 text-sm md:text-base text-gray-600">{t('about_collaboration_desc')}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex justify-center md:justify-start">
            <Image
              src="/country.png"
              alt="Vision"
              width={500}
              height={300}
              className="rounded shadow-md max-w-full h-auto"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mt-4 md:mt-0">{t('about_services_title')}</h3>
            <p className="mt-2 text-sm md:text-base text-gray-600">
              {t('about_services_desc')}
            </p>
          </div>
        </div>
      </section>


      {/* Statistics Section */}
      <section className="bg-blue-700 text-white py-10 md:py-16">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-4 px-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">2+</h3>
            <p className="mt-2 text-sm md:text-base">{t('years')}</p>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">100+</h3>
            <p className="mt-2 text-sm md:text-base">{t('apps')}</p>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">40</h3>
            <p className="mt-2 text-sm md:text-base">{t('download_rate')}</p>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">20+</h3>
            <p className="mt-2 text-sm md:text-base">{t('industries_served')}</p>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-8 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold text-black">{t('about_mission_title')}</h3>
              <p className="mt-4 text-sm md:text-base text-gray-600">
                {t('about_mission_desc')}
              </p>
            </div>
            <div className="flex justify-center md:justify-start order-first md:order-none mt-4 md:mt-0">
              <Image
                src="/our_mission.png"
                alt="Mission"
                width={500}
                height={300}
                className="rounded shadow-md max-w-full h-auto"
              />
            </div>
            <div className="flex justify-center md:justify-start mt-4 md:mt-0">
              <Image
                src="/our_vission.png"
                alt="Vision"
                width={500}
                height={300}
                className="rounded shadow-md max-w-full h-auto"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-black">{t('about_vision_title')}</h3>
              <p className="mt-4 text-sm md:text-base text-gray-600">
                {t('about_vision_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-4 md:py-5 px-4 md:px-10">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4">
          {/* Logo Section */}
          <div className="flex flex-col items-start w-full md:w-auto">
            <p style={{ fontSize: "12px", color: "white"}}>
              {t('copyright').replace('{year}', new Date().getFullYear().toString())}
            </p>
            <div className="flex justify-start space-x-4 mt-2 text-white">
              <a
                href="#"
                className="hover:text-blue-300 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-blue-300 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-blue-300 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 text-sm text-white w-full md:w-auto mt-4 md:mt-0">
            {/* Column 1 */}
            <div>
              <h4 className="font-bold mb-2">{t('developers')}</h4>
              <ul>
                <li>
                  <a href="/login" className="hover:underline">
                    {t('developer_console')}
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:underline">
                    {t('submit_apk')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="md:ml-20">
              <h4 className="font-bold mb-2">{t('company')}</h4>
              <ul>
                <li>
                  <a
                    href="/landing_page_user/about_us"
                    className="hover:underline"
                  >
                    {t('about_us')}
                  </a>
                </li>
                <li>
                  <a
                    href="/landing_page_user/contact_us"
                    className="hover:underline"
                  >
                    {t('contact_us')}
                  </a>
                </li>
                <li>
                  <a
                    href="/landing_page_user/faq"
                    className="hover:underline"
                  >
                    {t('faq')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-4 text-white">
          <p style={{ fontSize: "12px" }}>
            {t('copyright').replace('{year}', new Date().getFullYear().toString())} | {t('privacy_policy')} | {t('copyright_policy')} | {t('terms')}
          </p>
        </div>
      </footer>
    </div>
  );
}
