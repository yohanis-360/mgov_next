"use client"; // Make sure this is here

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmailConfirmation() {
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation of the verification code
    if (verificationCode.length < 6) {
      alert("Please enter a valid verification code.");
      return;
    }

    // Navigate to the Reset Password page
    router.push("/forgot_password/reset_password");
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="sm:w-1/2 mt-20 pb-20 pl-20 pr-20 pt-10 bg-white shadow-md flex flex-col items-center">
        <div className="mb-6 w-full">
          <label className="text-2xl font-bold text-customblue pb-10">
            Check your Email
          </label>
          <span className="block text-sm text-[#989090] pt-3">
            We have sent an email with password reset instructions to your email
            address.
          </span>
        </div>

        {/* Verification Code */}
        <div className="mb-4 w-full">
          <label
            htmlFor="verification-code"
            className="block text-sm font-medium text-gray-700"
          >
            Verification Code
          </label>
          <input
            type="text"
            id="verification-code"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </div>

        {/* Resend Button */}
        <div className="my-2 w-full text-right">
          <span className="text-gray-500">Didn’t receive the email? </span>
          <button type="button" className="text-blue-500 hover:underline">
            Resend
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          className="mt-4 w-full bg-customblue text-white py-3 px-10 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-customblue"
        >
          Send
        </button>

        <div className="my-4 text-center text-gray-500">or</div>

        {/* Back to Login Button */}
        <button
          type="button"
          // onClick={() => router.push("/login")}
          className="w-full py-3 px-10 border border-[#025D7E] rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#025D7E]"
        >
          <span className="text-sm text-[#025D7E] hover:underline">
            Back to Login
          </span>
        </button>
      </div>

      {/* Image Section: 50% width */}
      <div
        className="flex-1 min-h-full"
        style={{ backgroundColor: "#086976" }}
      ></div>
    </div>
  );
}
