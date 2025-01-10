"use client"; // Make sure this is here

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Your password must be at least 8 characters long");
      return;
    }

    // You can call the password reset API here

    // Resetting the form and error message
    setError(null);
    setNewPassword("");
    setConfirmPassword("");

    // Redirecting to the login page after successful reset
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="sm:w-1/2 mt-20 pb-20 pl-20 pr-20 pt-10 bg-white shadow-md flex flex-col items-center">
        <div className="mb-6 w-full">
          <label className="text-2xl font-bold text-customblue pb-10">
            Reset Password
          </label>
          <span className="block text-sm text-[#989090] pt-3">
            Choose a new password for your account
          </span>
        </div>

        {/* New Password */}
        <div className="mb-4 w-full">
          <label
            htmlFor="new-password"
            className="block text-sm font-medium text-gray-700"
          >
            Your New Password
          </label>
          <input
            type="password"
            id="new-password"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-4 w-full">
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Your New Password
          </label>
          <input
            type="password"
            id="confirm-password"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Error Message */}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          className="mt-4 w-full bg-customblue text-white py-3 px-10 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-customblue"
        >
          Password Reset
        </button>

        <div className="my-4 text-center text-gray-500">or</div>

        {/* Back to Login Button */}
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
        className="flex-1 min-h-full"
        style={{ backgroundColor: "#086976" }}
      ></div>
    </div>
  );
}
