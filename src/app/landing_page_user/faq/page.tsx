"use client";
import { SetStateAction, useState } from 'react';

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState('Platform');
  const [activeIndex, setActiveIndex] = useState(null);

  const tabs = ['Platform', 'Citizen', 'Developer'];
  const faqs = [
    {
      question: 'What is the Ethiopian Gov App Store?',
      answer: 'The Ethiopian Gov App Store is an official platform where you can find trusted government apps and services to simplify access to essential resources.',
    },
    {
      question: 'How do I download apps from the store?',
      answer: 'You can download apps by visiting the app page and clicking on the download button.',
    },
    {
      question: 'Are the apps on the store safe and verified?',
      answer: 'Yes, all apps go through a verification process to ensure safety and reliability.',
    },
    {
      question: 'Do I need to create an account to use the store?',
      answer: 'No, you can access most apps without an account. However, creating an account offers additional benefits.',
    },
    {
      question: 'Is the Ethiopian Gov App Store free to use?',
      answer: 'Yes, the platform is free to use for all citizens.',
    },
    {
      question: 'What devices are supported by the app store?',
      answer: 'The store supports Android and iOS devices.',
    },
  ];

  const toggleFAQ = (index:any) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      {/* <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-blue-800">Mobile Apps</h1>
          <nav className="flex space-x-4">
            <a href="#" className="text-blue-800 font-medium hover:underline">
              Web Portal
            </a>
          </nav>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="text-center bg-blue-50 py-12">
        <h2 className="text-xl text-blue-600 font-semibold">GOV APP STORE</h2>
        <h1 className="text-3xl font-bold text-gray-800 mt-2">
          Frequently Asked Questions
          <br />
          For Ethiopian Gov App Store
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mt-4">
          Access trusted government apps and services in one secure platform. Simplifying your
          connection to essential resources, anytime, anywhere. Empowering citizens with reliable
          digital solutions.
        </p>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center space-x-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-[40px] font-medium ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* FAQ Section */}
        <div className=" mx-20 bg-white rounded-md shadow-md p-6">

          {faqs.map((faq, index) => (
            <div key={index} className="border-b last:border-none">
              <button
                className="w-full flex justify-between items-center py-4 text-left text-gray-800 font-medium"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span>{activeIndex === index ? '-' : '+'}</span>
              </button>
              {activeIndex === index && <p className="text-gray-600 pb-4">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </section>
      <footer className="bg-gray-100 py-5 px-10 ">
        <div className="flex flex-wrap justify-between items-center mb-6">
          {/* Logo Section */}
          <div className="flex flex-col items-start">
            {/* <img
                src="/logo_efdri.png"
                width={30}
                height={40}
                alt="Logo"
                className="h-12 mb-2"
              /> */}

            <p style={{ fontSize: "12px", color: "black" }}>
              Copyright © {new Date().getFullYear()} App Store. All rights
              reserved.
            </p>
            <div className="flex justify-center space-x-4 mt-2 text-black">
              <a
                style={{ fontSize: "12px" }}
                href="#"
                className="hover:text-blue-600"
              >
                Facebook
              </a>
              <a
                style={{ fontSize: "12px" }}
                href="#"
                className="hover:text-blue-600"
              >
                Twitter
              </a>
              <a
                style={{ fontSize: "12px" }}
                href="#"
                className="hover:text-blue-600"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-3 gap-8 text-sm text-black">
            {/* Column 1 */}
            <div>
              <h4 className="font-bold mb-2">Developers</h4>
              <ul>
                <li>
                  <a href="/login" className="hover:underline">
                    Developer Console
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:underline">
                    Submit APK
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2 */}

            {/* Column 3 */}
            <div className="ml-20">
              <h4 className="font-bold mb-2 ">Company</h4>
              <ul>
                <li>
                  <a
                                      href="/landing_page_user/about_us"             

                    className="hover:underline"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/landing_page_user/contact_us"
                    className="hover:underline">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/landing_page_user/faq"             
                    className="hover:underline">
                        FAQ
                    </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-4  text-black">
          <p style={{ fontSize: "12px" }}>
            Copyright © {new Date().getFullYear()} Gov App Ethiopia All rights
            reserved. | Privacy Policy | Copyright Policy | Terms | 
          </p>
        </div>
      </footer>

     
    </div>
  );
}
