"use client";

import PhoneInput from "react-phone-input-2";
import React, { useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { DatePicker, ConfigProvider } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";
import locale from "antd/locale/en_US";
import "antd/dist/reset.css";
import Link from "next/link";
import Image from "next/image";
import TermsAndConditions from "../../components/TermsAndConditions";
import ReCaptchaComponent from "../../components/ReCaptcha";
import RegistrationSuccess from "../../components/RegistrationSuccess";
import { useLanguage } from "@/contexts/LanguageContext";

type Errors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  mobile_number?: string;
  date_of_birth?: string;
  termsAccepted?: string;
  recaptcha?: string;
};

export default function Register() {
  const router = useRouter();
  const { t } = useLanguage();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile_number, setMobile_number] = useState("");
  const [gender, setGender] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const { getRootProps, getInputProps } = useDropzone({
    maxSize: 10 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
    },
  });
  const [date_of_birth, setDate_of_birth] = useState<string | null>(null);

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

  // Handle phone number change with validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMobile_number(value);
    
    // Clear previous phone error
    if (errors.mobile_number) {
      setErrors(prev => ({...prev, mobile_number: undefined}));
    }
    
    // If the number is not empty but invalid, show error
    if (value && !validatePhoneNumber(value)) {
      setErrors(prev => ({
        ...prev, 
        mobile_number: "Please enter a valid Ethiopian phone number (+251XXXXXXXXX or 09XXXXXXXX)"
      }));
    }
  };

  const handleChange = (date: Dayjs | null, dateString: string | string[]) => {
    if (typeof dateString === "string") {
      console.log("Selected Date:", dateString);
      setDate_of_birth(dateString);
    }
  };
  
  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
    if (token) {
      // Clear recaptcha error if it exists
      setErrors(prev => ({...prev, recaptcha: undefined}));
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    // Check for empty fields
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!username.trim()) newErrors.username = "Username is required";
    if (!mobile_number.trim())
      newErrors.mobile_number = "Phone number is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    
    // Validate terms and conditions acceptance
    if (!termsAccepted) {
      newErrors.termsAccepted = "You must accept the Terms and Conditions";
    }

    // Validate reCAPTCHA
    if (!recaptchaToken) {
      newErrors.recaptcha = "Please complete the CAPTCHA verification";
    }

    // Validate Ethiopian phone number
    if (mobile_number && !validatePhoneNumber(mobile_number)) {
      newErrors.mobile_number = "Please enter a valid Ethiopian phone number (+251XXXXXXXXX or 09XXXXXXXX)";
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (password && !passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters long and include letters and numbers";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Date of Birth
    if (!date_of_birth) newErrors.date_of_birth = "Date of birth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  const handleSubmit = async (e: React.FormEvent) => {
    if (validateForm()) {
      console.log("true");
      e.preventDefault();
      setIsLoading(true);

      // Collect form data
      const userData = {
        firstName,
        lastName,
        email,
        username,
        password,
        mobile_number,
        gender: (
          document.querySelector(
            'input[name="gender"]:checked'
          ) as HTMLInputElement
        )?.value,
        date_of_birth,
        termsAccepted,
        recaptchaToken
      };
      try {
        console.log(userData);
        // Send data to backend (adjust API endpoint as needed)
        const response = await fetch("http://127.0.0.1:8000/users/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (response.status == 201) {
          // Show success modal instead of immediately redirecting
          setIsSuccessModalVisible(true);
        } else {
          setErrorMessage(
            data.detail || data.message || "Sign up failed! Please try again."
          );
          setIsModalVisible(true); // Show modal with error message
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleOk = () => {
    setIsModalVisible(false); // Close the modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalVisible(false);
    router.push("/user/login");
  };

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row bg-white">
        <div
          className="w-full md:w-1/2 py-6 md:min-h-full bg-customblue"
        >
            <p className="text-lg md:text-xl font-bold px-4 mt-6 md:mt-20 md:ml-20 md:mb-20 text-center md:text-left text-white">{t('welcome_message')}
            <br />{t('citizen_registration')}</p> 
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
              {t('citizen_registration')}
            </label>
            <span className="block text-xs md:text-sm text-[#989090] pt-2 md:pt-3">
              {t('create_account_message')}
            </span>
          </div>
          {/* Full Name */}
          <div className="mb-3 md:mb-4 w-full">
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-gray-700"
            >
              {t('full_name')}
            </label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              id="firstname"
              className="mt-1 block w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
              required
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs md:text-sm">{errors.firstName}</p>
            )}
          </div>
          <div className="mb-3 md:mb-4 w-full">
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-700"
            >
              {t('last_name')}
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              id="lasttname"
              className="mt-1 block w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
              required
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs md:text-sm">{errors.lastName}</p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="mt-1 block w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs md:text-sm">{errors.email}</p>
            )}
          </div>
          <div className="mb-3 md:mb-4 w-full">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              {t('username')}
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              id="username"
              className="mt-1 block w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
              required
            />
            {errors.username && (
              <p className="text-red-500 text-xs md:text-sm">{errors.username}</p>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className="mt-1 block w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs md:text-sm">{errors.password}</p>
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              id="confirmPassword"
              className="mt-1 block w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs md:text-sm">{errors.confirmPassword}</p>
            )}
          </div>
          {/* Phone Number */}
          <div className="mb-3 md:mb-4 w-full">
            <label
              htmlFor="mobile_number"
              className="block text-sm font-medium text-gray-700"
            >
              {t('mobile_number')}
            </label>
            <input
              value={mobile_number}
              onChange={handlePhoneChange}
              type="text"
              id="mobile_number"
              placeholder="+251941234567 or 0941234567"
              className="mt-1 block w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
              required
            />
            {errors.mobile_number && (
              <p className="text-red-500 text-xs md:text-sm">{errors.mobile_number}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Enter a valid Ethiopian phone number (e.g., +251941234567 or 0941234567)</p>
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
                  onChange={(e) => setGender(e.target.value)}
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
                  onChange={(e) => setGender(e.target.value)}
                />
                <label htmlFor="female" className="ml-2 text-xs md:text-sm text-gray-700">
                  {t('female')}
                </label>
              </div>
            </div>
          </div>
          <div className="mb-3 md:mb-4 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
              {t('date_of_birth')}
            </label>
            <ConfigProvider locale={locale}>
              <DatePicker 
                onChange={handleChange} 
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
              />
            </ConfigProvider>
            {errors.date_of_birth && (
              <p className="text-red-500 text-xs md:text-sm">{errors.date_of_birth}</p>
            )}
          </div>
          <TermsAndConditions 
            checked={termsAccepted}
            onChange={handleCheckboxChange}
            error={errors.termsAccepted}
            userType="user"
            className="mt-4"
          />
          {/* Add ReCaptcha component */}
          <ReCaptchaComponent 
            onChange={handleRecaptchaChange}
            error={errors.recaptcha}
            className="mt-4 mb-2"
          />
          <p className="text-red-500 text-sm">{errorMessage}</p>
          <div className="relative">
            <button
              type="submit"
              className="w-full bg-customblue text-white py-2 md:py-3 px-4 md:px-10 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-customblue text-sm md:text-base"
              style={{ borderRadius: "20px", marginTop: "10px" }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="spinner-border animate-spin w-4 h-4 md:w-6 md:h-6 border-4 border-t-transparent border-blue-500 rounded-full"></div>
                </div>
              ) : (
                t('sign_up')
              )}
            </button>
          </div>
          <div className="my-4 text-center text-gray-500">or</div>
          <button
            type="button"
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <img
              src="/google-icon.svg"
              alt="Google Icon"
              className="w-5 h-5 mr-2"
            />
            {t('sign_up_with_google')}
          </button>
          <p className="mt-3 md:mt-6 text-center text-xs md:text-sm text-gray-600">
            {t('already_have_account')}{" "}
            <a href="/user/login" className="text-indigo-600 hover:underline">
              {t('sign_in')}
            </a>
          </p>
        </div>
      </div>
      
      {/* Success modal */}
      <RegistrationSuccess 
        isOpen={isSuccessModalVisible}
        userType="user"
        onClose={handleSuccessModalClose}
      />
    </>
  );
}
