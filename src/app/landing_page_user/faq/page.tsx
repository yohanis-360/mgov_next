"use client";
import { SetStateAction, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import Footer from '@/components/Footer';

export default function FAQPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(t('platform'));
  const [activeIndex, setActiveIndex] = useState(null);

  const tabs = [t('platform'), t('citizen'), t('developer')];
  const faqs = [
    {
      question: t('faq_question1'),
      answer: t('faq_answer1'),
    },
    {
      question: t('faq_question2'),
      answer: t('faq_answer2'),
    },
    {
      question: t('faq_question3'),
      answer: t('faq_answer3'),
    },
    {
      question: t('faq_question4'),
      answer: t('faq_answer4'),
    },
    {
      question: t('faq_question5'),
      answer: t('faq_answer5'),
    },
    {
      question: t('faq_question6'),
      answer: t('faq_answer6'),
    },
  ];

  const toggleFAQ = (index:any) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="text-center bg-blue-50 py-8 md:py-12 px-4">
        <h2 className="text-lg md:text-xl text-blue-600 font-semibold">{t('government_appstore')}</h2>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
          {t('faq_title')}
          <br />
          {t('faq_subtitle')}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-sm md:text-base">
          {t('faq_description')}
        </p>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center flex-wrap gap-2 mb-6 md:mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-[40px] text-sm md:text-base font-medium ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mx-4 md:mx-20 bg-white rounded-md shadow-md p-4 md:p-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b last:border-none">
              <button
                className="w-full flex justify-between items-center py-3 md:py-4 text-left text-gray-800 text-sm md:text-base font-medium"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span>{activeIndex === index ? '-' : '+'}</span>
              </button>
              {activeIndex === index && <p className="text-gray-600 text-sm md:text-base pb-3 md:pb-4">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
