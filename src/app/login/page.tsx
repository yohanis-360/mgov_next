"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { preventBackNavigation } from "@/utils/auth";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Login() {
  const { t } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [selection, setSelection] = useState('developer');

  // Add this to prevent back navigation to authenticated pages
  useEffect(() => {
    preventBackNavigation();
  }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible); // Toggle visibility state
  };
  const handleSelectionChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    setSelection(value);

    // Navigate only when 'user' is selected
    if (value === 'user') {
      router.push('/user/login');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setUsernameError("");
    setPasswordError("");
    setErrorMessage("");

    if (!username) {
      setUsernameError("Username is required.");
    }
    if (!password) {
      setPasswordError("Password is required.");
    }

    if (!username || !password) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData?.detail || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      // Save tokens and user details to local storage
      if (data.user && data.access_token && data.refresh_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("data", JSON.stringify(data));

        // Redirect to the App Submission Overview page
        router.push("/developer_portal");
      } else {
        setIsLoading(false);
        setErrorMessage("Invalid user data.");
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("An error occurred during login. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="w-full md:w-1/2 md:min-h-full bg-customblue py-6 px-4 md:py-0 md:px-0">
        <div className="mt-8 md:mt-12 text-center text-white">
          <h2 className="text-xl md:text-2xl font-bold">
            {t('welcome_message')}
          </h2>
          <p className="mt-2 md:mt-4 mb-6 md:mb-10 text-base md:text-lg">
            {t('gateway_message')}
          </p>
        </div>
        
        <img src="/logo.png" alt="Logo" className="w-full max-w-xs mx-auto md:mx-10" />
        
        {/* Navigation row with logo and back button */}
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
      </div>
      <div className="w-full md:w-1/2 px-6 py-10 md:py-20 md:px-20 bg-white shadow-md flex flex-col items-center">
        <div className="mb-4 md:mb-6 w-full">
          <label className="text-xl md:text-2xl font-bold text-black pb-2 md:pb-4">
            {t('developer_login')}
          </label>
          <span className="block text-xs md:text-sm text-[#989090] pt-1 md:pt-2">
            {t('please_login')}
          </span>
        </div>

        <form onSubmit={handleLogin} className="w-full">
          {/* Username */}
          <div className="mb-3 md:mb-4 w-full">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              {t('username')}
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
              placeholder={t('enter_username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && (
              <p className="text-red-500 text-xs mt-1">{usernameError}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-3 md:mb-4 w-full">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t('password')}
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                className="mt-1 block w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {isPasswordVisible ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                {t('remember_me')}
              </label>
            </div>

            <div className="text-sm">
              <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot Password
              </a>
            </div>
          </div>

          {/* Sign In Button */}
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
              t('sign_in')
            )}
          </button>
        </form>

        <div className="my-3 md:my-4 text-center text-gray-500 text-xs md:text-sm">{t('or')}</div>

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
          {t('sign_in_with_google')}
        </button>

        <p className="mt-3 md:mt-4 text-center text-xs md:text-sm text-gray-600">
          {t('need_account')}{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            {t('create_one')}
          </a>
        </p>
      </div>
    </div>
  );
}
