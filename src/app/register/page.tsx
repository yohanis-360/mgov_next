"use client";

import PhoneInput from "react-phone-input-2";
import React, { useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { FadeLoader } from "react-spinners";
import Link from "next/link";
import TermsAndConditions from "../components/TermsAndConditions";
import ReCaptchaComponent from "../components/ReCaptcha";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Register() {
  const router = useRouter();
  const { t } = useLanguage();
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    maxSize: 10 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
    },
  });
  type Errors = {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    mobile_number?: string;
    phone?: string;
    gender?: string;
    termsAccepted?: string;
    recaptcha?: string;
  };

  // Function to validate Ethiopian phone number
  const validatePhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return false;
    
    // Clean the phone number - remove spaces, dashes, etc.
    const cleanedPhone = phoneNumber.replace(/\s+|-/g, '');
    
    // Check if the phone starts with the Ethiopian code +251 followed by 9 digits
    const validInternationalFormat = /^\+251\d{9}$/.test(cleanedPhone);
    
    // Check if the phone starts with 0 followed by 9 digits (local format)
    const validLocalFormat = /^0\d{9}$/.test(cleanedPhone);
    
    return validInternationalFormat || validLocalFormat;
  };

  // Handle phone number change
  const handlePhoneChange = (value: string) => {
    setPhone(value);
    
    // Clear previous phone error
    if (errors.phone) {
      setErrors(prev => ({...prev, phone: undefined}));
    }
    
    // If the number is not empty but invalid, show error
    if (value && !validatePhoneNumber(value)) {
      setErrors(prev => ({
        ...prev, 
        phone: "Please enter a valid Ethiopian phone number (+251XXXXXXXXX or 09XXXXXXXX)"
      }));
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
    if (token) {
      // Clear recaptcha error if it exists
      setErrors(prev => ({...prev, recaptcha: undefined}));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Errors = {};

    const formData = {
      fullName: (document.getElementById("fullName") as HTMLInputElement).value,
      email: (document.getElementById("email") as HTMLInputElement).value,
      password: (document.getElementById("password") as HTMLInputElement).value,
      confirmPassword: (
        document.getElementById("confirmPassword") as HTMLInputElement
      ).value,
      phone,
      gender: (
        document.querySelector(
          'input[name="gender"]:checked'
        ) as HTMLInputElement
      )?.value,
      termsAccepted,
      recaptchaToken,
    };
    if (!formData.fullName) newErrors.fullName = "Full name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.phone) newErrors.phone = "Phone number is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!termsAccepted) newErrors.termsAccepted = "You must accept the Terms and Conditions";
    if (!recaptchaToken) newErrors.recaptcha = "Please complete the CAPTCHA verification";

    // Validate Ethiopian phone number
    if (formData.phone && !validatePhoneNumber(formData.phone)) {
      newErrors.phone = "Please enter a valid Ethiopian phone number (+251XXXXXXXXX or 09XXXXXXXX)";
    }
    
    // Check password match
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setLoading(true);
      // Validate required fields

      try {
        console.log(formData.email);
        // Send OTP request
        const response = await fetch("http://127.0.0.1:8000/users/send-otp/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            email: formData.email,
            recaptchaToken: formData.recaptchaToken
          }),
        });

        if (response.ok) {
          // Save registration data in local storage
          localStorage.setItem("registrationData", JSON.stringify(formData));
          const url = new URL("/register/otp", window.location.origin);
          url.searchParams.append("email", formData.email);
          // Navigate to the OTP page
          router.push(url.toString());
        } else {
          setLoading(false);
          const errorData = await response.json();
          setErrorMessage(errorData.message);
          alert(errorData.message || "Failed to send OTP. Please try again.");
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage("Error sending OTP");
        console.error("Error sending OTP:", error);
        alert("An error occurred while sending the OTP. Please try again.");
      }
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div
        className="w-full md:w-1/2 py-6 md:min-h-full bg-customblue"
      >
         <div className="mt-8 md:mt-10 text-center text-white">
          <h2 className="text-lg md:text-xl font-bold mb-6 md:mb-10">
            {t('welcome_message')}
          </h2>
          <p className="mt-2 md:mt-4 mb-6 md:mb-10 text-base md:text-lg">
            {t('gateway_message')}
          </p>
        </div>
        <img src="/logo.png" alt="Logo" className="w-full max-w-xs mx-auto" />
      </div>
      <div className="w-full md:w-1/2 px-6 py-8 md:mt-2 md:py-10 md:px-20 md:rounded-tr-[40px] md:rounded-br-[40px] bg-white shadow-md flex flex-col items-center">
        <div className="mb-4 md:mb-6 w-full">
        <div className="absolute top-2 md:top-5 right-2 md:right-5 flex items-center space-x-4 md:space-x-40">
            {/* Back button */}
            <div className="md:mr-80 flex items-center cursor-pointer" onClick={() => router.back()}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-customblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-customblue ml-1 md:ml-2 text-sm md:text-base">{t('back')}</span>
            </div>
            <img src="/mint.png" alt="Logo" className="w-12 h-8 md:w-15 md:h-10" />
          </div>
          <label className="text-xl md:text-2xl font-bold text-customblue pb-6 md:pb-10 block">
            {t('developer_registration')}
          </label>
          <span className="block text-xs md:text-sm text-[#989090] pt-2 md:pt-3">
            {t('create_account_message')}
          </span>
        </div>

        {/* Full Name */}
        <div className="mb-3 md:mb-4 w-full">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            {t('organization_name')}
          </label>
          <input
            type="text"
            id="fullName"
            className="mt-1 block w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
            required
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs md:text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-3 md:mb-4 w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            {t('email')}
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs md:text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-3 md:mb-4 w-full">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            {t('password')}
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-xs md:text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-3 md:mb-4 w-full">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            {t('confirm_password')}
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="mt-1 block w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs md:text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="mb-3 md:mb-4 w-full">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            {t('phone_number')}
          </label>
          <PhoneInput
            country={"et"} // Default country
            value={phone} // Controlled value
            onChange={handlePhoneChange} // Use our new validation handler
            inputProps={{
              name: "phone",
              required: true,
              autoFocus: false,
              className:
                "pl-10 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base",
            }}
            containerClass="w-full"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs md:text-sm mt-1">{errors.phone}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">{t('enter_phone_number')}</p>
        </div>

        {/* Gender */}
        <div className="mb-3 md:mb-4 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
            {t('gender')}
          </label>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                className="w-3 h-3 md:w-4 md:h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="male" className="ml-2 text-xs md:text-sm text-gray-700">
                {t('male')}
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                className="w-3 h-3 md:w-4 md:h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="female" className="ml-2 text-xs md:text-sm text-gray-700">
                {t('female')}
              </label>
            </div>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-xs md:text-sm mt-1">{errors.gender}</p>
          )}
        </div>

        <TermsAndConditions 
          checked={termsAccepted}
          onChange={handleCheckboxChange}
          error={errors.termsAccepted}
          userType="developer"
          className="mt-4"
        />

        {/* Add ReCaptcha component */}
        <ReCaptchaComponent 
          onChange={handleRecaptchaChange}
          error={errors.recaptcha}
          className="mt-4 mb-2"
        />

        {errorMessage && (
          <p className="text-red-500 text-xs md:text-sm mb-2">{errorMessage}</p>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full mt-4 md:mt-6 bg-customblue text-white py-2 md:py-3 px-4 md:px-8 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm md:text-base"
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="spinner-border animate-spin w-4 h-4 md:w-6 md:h-6 border-4 border-t-transparent border-blue-500 rounded-full"></div>
              </div>
            ) : (
              t('sign_up')
            )}
          </button>
        </div>

        <div className="my-3 md:my-4 text-center text-gray-500 text-xs md:text-sm">or</div>

        {/* Sign in with Google */}
        <button
          type="button"
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm"
        >
          <img
            src="/google-icon.svg"
            alt="Google Icon"
            className="w-4 h-4 md:w-5 md:h-5 mr-2"
          />
          {t('sign_up_with_google')}
        </button>

        <p className="mt-3 md:mt-4 text-center text-xs md:text-sm text-gray-600">
          {t('already_have_account')}{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            {t('sign_in')}
          </a>
        </p>
      </div>
    </div>
  );
}
