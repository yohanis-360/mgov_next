"use client";

import { Button, Divider, Form, Input } from "antd";
import { LiaPhoneVolumeSolid, LiaFaxSolid } from "react-icons/lia";
import { MdOutlineAttachEmail } from "react-icons/md";

export default function HelpPage() {
  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="bg-blue-700 text-white pt-40 pb-20">
  <div className="container mx-auto text-center">
    <h1 className="text-4xl font-bold">Contact Us</h1>
    <p className="mt-4 text-lg">
      Have a question or need assistance? Connect with us, and we&apos;ll ensure you get the support you&apos;re looking for.
    </p>
  </div>
</section>

      {/* Contact Form Section */}
      <div className="relative -top-52 mx-20 mt-40 max-w-contentwidth">
        <div className="flex justify-between">
          {/* Form */}
          <div className="h-[739px] w-[48%] space-y-4  bg-white p-12 shadow-xl">
            <h1 className="text-4xl font-bold text-black">
              Get in <span className="text-esxmain">Touch</span>
            </h1>
            <p className="mt-4 text-base text-gray-500">
              Send us your message, and we’ll be in touch soon.
            </p>

            <Form
              name="contact-form"
              layout="vertical"
              className="m-auto mt-9"
              onFinish={(values) => console.log("Form Submitted", values)}
            >
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter your full name" },
                ]}
              >
                <Input placeholder="Full Name" className="!rounded-md" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email address" },
                ]}
              >
                <Input placeholder="Email" className="!rounded-md" />
              </Form.Item>
              <Form.Item
                name="phoneNo"
                label="Phone No"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input placeholder="Phone No" className="!rounded-md" />
              </Form.Item>
              <Form.Item
                name="message"
                label="Your Message"
                rules={[
                  { required: true, message: "Please enter your message" },
                ]}
              >
                <Input.TextArea
                  placeholder="Your Message"
                  rows={4}
                  className="!rounded-md"
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="!h-12 w-full !rounded-md !bg-esxmain !text-base font-bold"
              >
                SEND
              </Button>
            </Form>
          </div>

          {/* Contact Details */}
          <div className="w-[48%] rounded-xl bg-esxlight p-12 my-20">
            <h2 className="text-4xl font-bold text-black">
              <span className="text-esxmain ">Contact</span> Details
            </h2>
            <p className="mt-6 text-lg text-gray-700">
              We’re here to help. Feel free to reach out to us via phone, fax, or email.
            </p>
            <div className="mt-8 space-y-8">
              <div className="flex items-center">
                <LiaPhoneVolumeSolid className="text-3xl text-esxmain mr-4 text-black" />
                <div>
                  <p className="font-semibold text-black">Phone</p>
                  <p className="text-gray-600">03 5432 1234</p>
                </div>
              </div>
              <div className="flex items-center">
                <LiaFaxSolid className="text-3xl text-esxmain mr-4 text-black" />
                <div>
                  <p className="font-semibold text-black">Fax</p>
                  <p className="text-gray-600">03 5432 1234</p>
                </div>
              </div>
              <div className="flex items-center">
                <MdOutlineAttachEmail className="text-3xl text-esxmain mr-4 text-black" />
                <div>
                  <p className="font-semibold text-black">Email</p>
                  <p className="text-gray-600">info@marcc.com.au</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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


      {/* Footer Section */}
      
     
     
      </div>
  );
}
