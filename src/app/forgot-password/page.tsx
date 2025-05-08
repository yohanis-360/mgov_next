"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from '@/contexts/LanguageContext';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userType, setUserType] = useState("user");

  useEffect(() => {
    // Get user type from URL
    const type = searchParams.get("type");
    if (type === "developer" || type === "user") {
      setUserType(type);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/users/forgot-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(t('reset_email_sent'));
        // Store both email and user type in localStorage
        localStorage.setItem("resetEmail", email);
        localStorage.setItem("resetUserType", userType);
        // Redirect to verify OTP page after 3 seconds
        setTimeout(() => {
          router.push("/verify-reset-otp");
        }, 3000);
      } else {
        setErrorMessage(data.message || t('reset_error'));
      }
    } catch (error) {
      setErrorMessage(t('reset_error_occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="w-full md:w-1/2 py-6 md:min-h-full bg-customblue">
        <p className="text-lg md:text-xl font-bold mt-5 md:mt-10 px-4 md:ml-10 text-white text-center md:text-left">
          {t('forgot_password_title')}
        </p>
        <img src="/logo.png" alt="Logo" className="w-full max-w-xs mx-auto mt-6 md:mt-10" />
      </div>

      <div className="w-full md:w-1/2 px-6 py-8 md:mt-2 md:py-10 md:px-20 bg-white shadow-md flex flex-col items-center">
        <div className="absolute top-2 md:top-5 right-2 md:right-5 flex items-center space-x-4 md:space-x-40">
          <div className="md:mr-80 flex items-center cursor-pointer" onClick={() => router.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-customblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-customblue ml-1 md:ml-2 text-sm md:text-base">{t('back')}</span>
          </div>
          <img src="/mint.png" alt="Logo" className="w-12 h-8 md:w-15 md:h-10" />
        </div>

        <form onSubmit={handleSubmit} className="w-full mt-10 md:mt-4">
          <div className="mb-4 md:mb-6">
            <label className="text-xl md:text-2xl font-bold text-customblue pb-6 md:pb-10 block">
              {t('reset_password')}
            </label>
            <span className="block text-xs md:text-sm text-[#989090] pt-2 md:pt-3">
              {t('reset_instructions')}
            </span>
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('email_address')}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
              placeholder={t('enter_email')}
              required
            />
          </div>

          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col md:flex-row mt-4 md:mt-6 justify-between w-full space-y-3 md:space-y-0 md:space-x-4">
            <button
              type="submit"
              className="w-full bg-customblue text-white py-3 px-6 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-customblue text-sm md:text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="spinner-border animate-spin w-5 h-5 border-4 border-t-transparent border-white rounded-full"></div>
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t('send_reset_instructions')}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push(userType === "developer" ? "/developer/login" : "/login")}
              className="bg-white text-customblue py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center border-2 border-customblue hover:bg-customblue hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              {t('back_to_login')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 