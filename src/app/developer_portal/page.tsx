"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/auth";

export default function AppSubmissionOverview() {
  const [status, setStatus] = useState("");
  const router = useRouter();
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check if user is authenticated first
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      router.replace("/login");
      return;
    }

    // If authenticated, retrieve user data from localStorage
    const userData = localStorage.getItem("user");
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setMessage(getStatusMessage(user.status));
        setStatus(user.status);

        // Redirect to another page if status is "approved"
        if (user.status === "approved") {
          router.push("/developer_portal/appstore");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Clear invalid data and redirect to login
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("data");
        router.replace("/login");
      }
    } else {
      // If no user data exists but we're authenticated, something's wrong
      // Clear tokens and redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("data");
      router.replace("/login");
    }
  }, [router]);

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "pending":
        return "Your registration request for the app store is currently under review. We'll notify you once the review process is complete. Thank you for your patience!";
      case "rejected":
        return "Your registration request has been rejected. Please correct your information and try again.";
      case "approved":
        return "You are approved and ready to submit your app!";
      default:
        return "Please log in to view your app submission status.";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 md:p-6">
      {status !== "approved" && (
        <div className="w-full max-w-lg md:w-1/2 p-4 md:p-6 bg-white shadow-md flex flex-col items-center rounded-lg">
          <h1 className="text-xl md:text-3xl font-bold text-customblue mb-3 md:mb-4 text-center">
            {status === "pending"
              ? "Registration Under Review"
              : "Registration Rejection"}
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-4 text-center">{message}</p>
        </div>
      )}
    </div>
  );
}
