"use client";

import { Button, Divider, Form, Input } from "antd";
import { LiaPhoneVolumeSolid, LiaFaxSolid } from "react-icons/lia";
import { MdOutlineAttachEmail } from "react-icons/md";

export default function HelpPage() {
  return (
    <div>
      <div>
        <div className="utility-page-bg1 mb-[128px] text-white">
          <div className="m-auto h-[360px] max-w-contentwidth select-none text-left">
            <div className="w-1/2 pt-28">
              <h1 className="text-[40px] font-bold text-white">Contact us</h1>
              <p>
                Have a question or need assistance? Connect with us, and
                we&apos;ll ensure you get the support you&apos;re looking for.
              </p>
            </div>
          </div>
        </div>
        {/* Contact Section */}
        <div className="relative -top-52 m-auto max-w-contentwidth">
          <div className="h-[739px] w-[650px] space-y-4 rounded-xl bg-white p-16 shadow-sm">
            <h1 className="text-5xl font-bold">
              Get in <span className="text-esxmain">Touch</span>
            </h1>
            <p className="mt-4 text-base">
              Send us your message, and we’ll be in touch soon
            </p>

            <Form
              name="contact-form"
              layout="vertical"
              className="m-auto !mt-9 max-w-lg"
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
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
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
              Mik360, [1/1/2025 12:47 PM]
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
          <div className="mt-5 flex w-[650px] justify-evenly bg-transparent">
            <div className="flex items-center space-x-3 text-center">
              <LiaPhoneVolumeSolid className="m-auto mb-2 text-3xl" />
              <div className="text-left">
                <p className="font-base font-semibold">PHONE</p>
                <p className="text-esxmain">03 5432 1234</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-center">
              <LiaFaxSolid className="m-auto mb-2 text-3xl" />
              <div className="text-left">
                <p className="font-base font-semibold">FAX</p>
                <p className="text-esxmain">03 5432 1234</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-center">
              <MdOutlineAttachEmail className="m-auto mb-2 text-3xl" />
              <div className="text-left">
                <p className="font-base font-semibold">EMAIL</p>
                <p className="text-esxmain">info@marcc.com.au</p>
              </div>
            </div>
          </div>
        </div>
        {/* Map Section */}
        {/* <div className="relative -top-14 mb-28">
          <ContactMap />
        </div> */}
        <div className="bg-[#F8F8F8]">
          <div className="m-auto flex h-[490px] max-w-contentwidth justify-between pt-28">
            <div className="w-[43%] space-y-4">
              <h3 className="text-2xl">Contact Info</h3>
              <p className="text-3xl font-bold">
                We are always happy to assist you
              </p>
            </div>
            <div className="">
              <h3 className="text-xl font-medium">Email Address</h3>
              <Divider
                type="horizontal"
                className="custom-divider custom-divider-utility hidden sm:block"
                style={{
                  borderWidth: "2px",
                  borderColor: "#000",
                }}
              />
              <h4 className="text-lg font-medium">help@info.com</h4>
              <p className="mt-8">
                Assistance hours: <br /> Monday - Friday 6 am to 8 pm EST
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium">Number</h3>
              <Divider
                type="horizontal"
                className="custom-divider custom-divider-utility hidden sm:block"
                style={{
                  borderWidth: "2px",
                  borderColor: "#000",
                }}
              />
              <h4 className="text-lg font-medium">+25167685657</h4>
              <p className="mt-8">
                Assistance hours: <br /> Monday - Friday 6 am to 8 pm EST
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
