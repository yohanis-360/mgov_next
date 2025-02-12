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
    <div className="min-h-screen flex bg-white">
      <div className="flex-1 min-h-full bg-customblue pt-20">
      <p className="text-lg mr-40 mt-5 ml-10">Government App Store
      Developer Account Registration</p> 
        <img src="/logo.png" alt="Logo" />
      </div>
      <div className="sm:w-1/2 mt-2 pb-20 pl-20 pr-20 pt-40 rounded-tr-[40px] rounded-br-[40px] bg-white shadow-md flex flex-col items-center">
        <div className="absolute top-5 right-5 flex items-center space-x-2">
          <img src="/mint.png" alt="Logo" className="w-15 h-10" />
          <span className="text-sm font-medium text-customblue">
            Government App Store
          </span>
        </div>
        <div className="mb-6 w-full text-center">
          <p className="text-lg text-customblue">
            Enter the OTP sent to {email}
          </p>
        </div>
        <div className="mb-6 w-full flex justify-center">
          <input
            type="text"
            name="otp"
            value={otp}
            maxLength={6}
            onChange={handleChange}
            className="w-2/3 px-6 py-4 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center tracking-widest text-black"
            placeholder="123456"
          />
        </div>

        {loading ? (
          <div className="flex justify-center mb-4">
            <div
              className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-solid rounded-full border-customblue border-t-transparent"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleVerifyOTP}
            className="bg-customblue text-white py-3 px-16 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-customblue"
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
