"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AppSubmissionOverview() {
  const [status, setStatus] = useState("");
  const router = useRouter();
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Retrieve user data from localStorage (check for null first)
    const userData = localStorage.getItem("user");

    if (userData) {
      const user = JSON.parse(userData);
      setMessage(getStatusMessage(user.status));
      setStatus(user.status);

      // Redirect to another page if status is "approved"
      if (user.status === "approved") {
        router.push("/developer_portal/appstore");
      }
    } else {
      // If no user data exists, redirect to login
      router.push("/login");
    }
  }, [router]);
  const getStatusMessage = (status: string) => {
    switch (status) {
      case "pending":
        return "Your registration request for the app store is currently under review. We’ll notify you once the review process is complete. Thank you for your patience!";
      case "rejected":
        return "Your registration request has been rejected. Please correct your information and try again.";
      case "approved":
        return "You are approved and ready to submit your app!";
      default:
        return "Please log in to view your app submission status.";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {status !== "approved" && (
        <div className="w-full sm:w-1/2 p-6 bg-white shadow-md flex flex-col items-center">
          <h1 className="text-3xl font-bold text-customblue mb-4">
            {status === "pending"
              ? "Registration Under Review"
              : "Registration Rejection"}
          </h1>
          <p className="text-lg text-gray-700 mb-4">{message}</p>
        </div>
      )}
    </div>
  );
}
