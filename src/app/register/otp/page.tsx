"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function EmailVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleVerifyOTP = async () => {
    if (email && otp) {
      setLoading(true);

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/users/verify-otp/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              otp,
            }),
          }
        );

        const data = await response.json();

        console.log(data);

        if (response.status == 200) {
          router.push("/register/document");
        } else {
          alert("Invalid OTP. Please try again.");
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        alert("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a valid OTP.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="w-full md:w-1/2 py-6 md:min-h-full bg-customblue">
        <p className="text-lg md:text-xl font-bold mt-5 md:mt-10 px-4 md:ml-10 text-white text-center md:text-left">
          Government App Store<br />Developer Account Registration
        </p>
        <img src="/logo.png" alt="Logo" className="w-full max-w-xs mx-auto mt-6 md:mt-10" />
      </div>
      <div className="w-full md:w-1/2 px-6 py-10 md:mt-2 md:py-20 md:px-20 bg-white shadow-md flex flex-col items-center">
        <div className="absolute top-2 md:top-5 right-2 md:right-5 flex items-center space-x-4 md:space-x-40">
          {/* Back button */}
          <div className="md:mr-80 flex items-center cursor-pointer" onClick={() => router.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-customblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-customblue ml-1 md:ml-2 text-sm md:text-base">Back</span>
          </div>
          <img src="/mint.png" alt="Logo" className="w-12 h-8 md:w-15 md:h-10" />
        </div>
        <div className="mb-4 md:mb-6 w-full text-center mt-10 md:mt-6">
          <p className="text-base md:text-lg text-customblue">
            Enter the OTP sent to {email}
          </p>
        </div>
        <div className="mb-4 md:mb-6 w-full px-4 md:px-0 flex justify-center">
          <input
            type="text"
            name="otp"
            value={otp}
            maxLength={6}
            onChange={handleChange}
            className="w-full md:w-2/3 px-4 md:px-6 py-3 md:py-4 text-base md:text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center tracking-widest text-black"
            placeholder="123456"
          />
        </div>

        {loading ? (
          <div className="flex justify-center mb-4">
            <div
              className="spinner-border animate-spin inline-block w-6 h-6 md:w-8 md:h-8 border-4 border-solid rounded-full border-customblue border-t-transparent"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleVerifyOTP}
            className="bg-customblue text-white py-2 md:py-3 px-8 md:px-16 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-customblue text-sm md:text-base flex items-center justify-center"
          >
            Verify OTP
          </button>
        )}
      </div>
    </div>
  );
}

export default function EmailVerificationWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerification />
    </Suspense>
  );
}
