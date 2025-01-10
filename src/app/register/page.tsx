"use client";

import PhoneInput from "react-phone-input-2";
import React, { useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    };
    if (!formData.fullName) newErrors.fullName = "Full name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.phone) newErrors.phone = "Phone number is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";

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
          body: JSON.stringify({ email: formData.email }),
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

  return (
    <div className="min-h-screen flex bg-white">
      <div
        className="flex-1 min-h-full bg-customblue pt-40"
        // style={{ backgroundColor: "customblue" }}
      >
        <img src="/logo.png" alt="Logo" />
      </div>
      <div className="sm:w-1/2 mt-2 pb-20 pl-20 pr-20 pt-20 rounded-tr-[40px] rounded-br-[40px] bg-white shadow-md flex flex-col items-center">
        <div className="mb-6 w-full">
          <div className="absolute top-5 right-5 flex items-center space-x-2">
            <img src="/mint.png" alt="Logo" className="w-15 h-10" />
            <span className="text-sm font-medium text-customblue">
              Government App Store
            </span>
          </div>
          <label className="text-2xl font-bold text-customblue pb-10">
            Sign up
          </label>
          <span className="block text-sm text-[#989090] pt-3">
            Sign up to enjoy the feature of gov app
          </span>
        </div>

        {/* Full Name */}
        <div className="mb-4 w-full">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            required
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4 w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4 w-full">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-4 w-full">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="mb-4 w-full">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <PhoneInput
            country={"et"} // Default country
            value={phone} // Controlled value
            onChange={(value) => setPhone(value)} // Update state
            inputProps={{
              name: "phone",
              required: true,
              autoFocus: true,
              className:
                " pl-10 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black",
            }}
            containerClass="w-full mb-4"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Gender */}
        <div className="mb-4 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <div className="flex items-center pl-7 pt-2 pb-3">
            <div className="flex items-center mr-4">
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="male" className="ml-2 text-sm text-gray-700">
                Male
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="female" className="ml-2 text-sm text-gray-700">
                Female
              </label>
            </div>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
        </div>

        {/* ID Document */}
        <div className="mb-4 w-full pb-5">
          <label
            htmlFor="fileUpload"
            className="block text-sm font-medium text-gray-700 pb-3"
          >
            Id Document
          </label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer hover:bg-gray-100"
          >
            <input {...getInputProps()} />
            <div className="flex items-center justify-center mb-2 space-x-2">
              <img
                src="/upload_icon.svg"
                alt="Upload Icon"
                className="w-5 h-5 mr-2 text-center"
              />
            </div>
            <span className="text-sm font-bold text-gray-700">
              Choose a file or drag and drop it here
            </span>
            <p className="text-xs text-[#989090]">
              Supports PDF and DOC file formats, with a maximum file size of
              10MB
            </p>
          </div>
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}

        <button
          onClick={handleSubmit}
          type="submit"
          disabled={loading}
          className="w-full bg-customblue text-white py-3 px-10 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-customblue"
          style={{ borderRadius: "20px", marginTop: "10px" }}
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="spinner-border animate-spin w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full"></div>
            </div>
          ) : (
            "Sign Up"
          )}
        </button>

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
          Sign in with Google
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>

      {/* Image Section: 50% width */}
      {/* <div className="flex justify-center items-center w-[604.28px] h-[456px] p-4 bg-#086976">
        <img
          src="/phone_image.png"
          alt="GOV App Ethiopia"
          className="w-full h-full object-cover"
        />
      </div> */}
    </div>
  );
}
