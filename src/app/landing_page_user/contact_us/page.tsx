"use client";

import { Button, Divider, Form, Input } from "antd";
import { LiaPhoneVolumeSolid, LiaFaxSolid } from "react-icons/lia";
import { MdOutlineAttachEmail } from "react-icons/md";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from '@/components/LanguageSelector';
import Footer from '@/components/Footer';

export default function HelpPage() {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="bg-blue-700 text-white pt-16 md:pt-40 pb-12 md:pb-20">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold">{t('contact_us')}</h1>
          <p className="mt-4 text-base md:text-lg">
            {t('contact_subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <div className="relative md:-top-52 mx-4 md:mx-20 mt-8 md:mt-40 max-w-contentwidth">
        <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-0">
          {/* Form */}
          <div className="w-full md:w-[48%] space-y-4 bg-white p-6 md:p-12 shadow-xl rounded-lg md:rounded-none">
            <h1 className="text-2xl md:text-4xl font-bold text-black">
              {t('get_in_touch')}
            </h1>
            <p className="mt-4 text-sm md:text-base text-gray-500">
              {t('send_message')}
            </p>

            <Form
              name="contact-form"
              layout="vertical"
              className="m-auto mt-6 md:mt-9"
              onFinish={(values) => console.log("Form Submitted", values)}
            >
              <Form.Item
                name="fullName"
                label={t('full_name')}
                rules={[
                  { required: true, message: "Please enter your full name" },
                ]}
              >
                <Input placeholder={t('full_name')} className="!rounded-md" />
              </Form.Item>
              <Form.Item
                name="email"
                label={t('email')}
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email address" },
                ]}
              >
                <Input placeholder={t('email')} className="!rounded-md" />
              </Form.Item>
              <Form.Item
                name="phoneNo"
                label={t('phone_no')}
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input placeholder={t('phone_no')} className="!rounded-md" />
              </Form.Item>
              <Form.Item
                name="message"
                label={t('your_message')}
                rules={[
                  { required: true, message: "Please enter your message" },
                ]}
              >
                <Input.TextArea
                  placeholder={t('your_message')}
                  rows={4}
                  className="!rounded-md"
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="!h-10 md:!h-12 w-full !rounded-md !bg-esxmain !text-sm md:!text-base font-bold"
              >
                {t('send')}
              </Button>
            </Form>
          </div>

          {/* Contact Details */}
          <div className="w-full md:w-[48%] rounded-xl bg-esxlight p-6 md:p-12 my-4 md:my-20">
            <h2 className="text-2xl md:text-4xl font-bold text-black">
              <span className="text-esxmain">{t('contact_details')}</span>
            </h2>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-700">
              {t('contact_help')}
            </p>
            <div className="mt-6 md:mt-8 space-y-6 md:space-y-8">
              <div className="flex items-center">
                <LiaPhoneVolumeSolid className="text-2xl md:text-3xl text-esxmain mr-3 md:mr-4 text-black" />
                <div>
                  <p className="font-semibold text-black">{t('phone')}</p>
                  <p className="text-gray-600">03 5432 1234</p>
                </div>
              </div>
              <div className="flex items-center">
                <LiaFaxSolid className="text-2xl md:text-3xl text-esxmain mr-3 md:mr-4 text-black" />
                <div>
                  <p className="font-semibold text-black">{t('fax')}</p>
                  <p className="text-gray-600">03 5432 1234</p>
                </div>
              </div>
              <div className="flex items-center">
                <MdOutlineAttachEmail className="text-2xl md:text-3xl text-esxmain mr-3 md:mr-4 text-black" />
                <div>
                  <p className="font-semibold text-black">{t('email')}</p>
                  <p className="text-gray-600">info@marcc.com.au</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
