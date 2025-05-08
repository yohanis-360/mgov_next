"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from '@/contexts/LanguageContext';

export default function VerifyResetOTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedEmail) {
      router.push("/forgot-password");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/users/verify-reset-otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(t('otp_verified_successfully'));
        // Redirect to reset password page after 2 seconds
        setTimeout(() => {
          router.push("/reset-password");
        }, 2000);
      } else {
        setErrorMessage(data.message || t('invalid_otp'));
      }
    } catch (error) {
      setErrorMessage(t('error_occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
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
        setSuccessMessage(t('new_otp_sent'));
      } else {
        setErrorMessage(data.message || t('failed_to_resend_otp'));
      }
    } catch (error) {
      setErrorMessage(t('error_occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="w-full md:w-1/2 py-6 md:min-h-full bg-customblue">
        <p className="text-lg md:text-xl font-bold mt-5 md:mt-10 px-4 md:ml-10 text-white text-center md:text-left">
          {t('verify_otp')}
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
              {t('enter_verification_code')}
            </label>
            <span className="block text-xs md:text-sm text-[#989090] pt-2 md:pt-3">
              {t('enter_verification_code')}
            </span>
          </div>

          <div className="mb-6">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              {t('verification_code')}
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 block w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
              placeholder={t('enter_verification_code')}
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
              className="w-full bg-customblue text-white py-2 md:py-3 px-4 md:px-10 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-customblue text-sm md:text-base"
              style={{ borderRadius: "20px", marginTop: "10px" }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="spinner-border animate-spin w-4 h-4 md:w-6 md:h-6 border-4 border-t-transparent border-blue-500 rounded-full"></div>
                </div>
              ) : (
                t('verify_otp')
              )}
            </button>
            <button
              type="button"
              onClick={handleResendOTP}
              className="bg-gray-300 text-gray-700 py-2 md:py-3 px-6 md:px-10 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 w-full md:w-auto text-sm md:text-base flex items-center justify-center"
              disabled={isLoading}
            >
              {t('resend_otp')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 