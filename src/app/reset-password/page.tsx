"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");

  useEffect(() => {
    // Get email and user type from localStorage
    const storedEmail = localStorage.getItem("resetEmail");
    const storedUserType = localStorage.getItem("resetUserType");
    
    if (!storedEmail || !storedUserType) {
      router.push("/forgot-password");
    } else {
      setEmail(storedEmail);
      setUserType(storedUserType);
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/users/reset-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          new_password: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Password reset successfully!");
        // Clear stored data
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetUserType");
        // Redirect to appropriate login page after 2 seconds
        setTimeout(() => {
          router.push(userType === "developer" ? "/developer/login" : "/login");
        }, 2000);
      } else {
        setErrorMessage(data.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="w-full md:w-1/2 py-6 md:min-h-full bg-customblue">
        <p className="text-lg md:text-xl font-bold mt-5 md:mt-10 px-4 md:ml-10 text-white text-center md:text-left">
          Reset Password
        </p>
        <img src="/logo.png" alt="Logo" className="w-full max-w-xs mx-auto mt-6 md:mt-10" />
      </div>

      <div className="w-full md:w-1/2 px-6 py-8 md:mt-2 md:py-10 md:px-20 bg-white shadow-md flex flex-col items-center">
        <div className="absolute top-2 md:top-5 right-2 md:right-5 flex items-center space-x-4 md:space-x-40">
          <div className="md:mr-80 flex items-center cursor-pointer" onClick={() => router.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-customblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-customblue ml-1 md:ml-2 text-sm md:text-base">Back</span>
          </div>
          <img src="/mint.png" alt="Logo" className="w-12 h-8 md:w-15 md:h-10" />
        </div>

        <form onSubmit={handleSubmit} className="w-full mt-10 md:mt-4">
          <div className="mb-4 md:mb-6">
            <label className="text-xl md:text-2xl font-bold text-customblue pb-6 md:pb-10 block">
              Set New Password
            </label>
            <span className="block text-xs md:text-sm text-[#989090] pt-2 md:pt-3">
              Please enter your new password below
            </span>
          </div>

          <div className="mb-6">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
              placeholder="Confirm new password"
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Reset Password
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
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 