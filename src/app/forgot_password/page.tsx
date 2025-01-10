"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    // After form submission, route to the email confirmation page
    router.push("/forgot_password/email");
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="sm:w-1/2 mt-20 pb-20 pl-20 pr-20 pt-10 bg-white shadow-md flex flex-col items-center">
        <div className="mb-6 w-full">
          <label className="text-2xl font-bold text-customblue pb-10">
            Forgot Password
          </label>
          <span className="block text-sm text-[#989090] pt-3">
            Enter the email you used to create your account so we can send you
            instructions on how to reset your password.
          </span>
        </div>

        {/* Email */}
        <form onSubmit={handleSubmit} className="w-full">
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
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            className="mt-4 w-full bg-customblue text-white py-3 px-10 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-customblue"
          >
            Send
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">or</div>

        {/* Back to Login */}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full py-3 px-10 border border-[#025D7E] rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#025D7E]"
        >
          <span className="text-sm text-[#025D7E] hover:underline">
            Back to Login
          </span>
        </button>
      </div>

      {/* Image Section: 50% width */}
      <div
        className="flex-1 min-h-full bg-customblue"
        // style={{ backgroundColor: "#086976" }}
      ></div>
    </div>
  );
}
