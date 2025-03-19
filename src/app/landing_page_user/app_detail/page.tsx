"use client";

import Image from "next/image";
import Link from "next/link";
import { Key, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";

export default function AppDetails() {
  const [activeTab, setActiveTab] = useState("Mobile Apps");
  const [appDetails, setAppDetails] = useState<any>(null); // State to store app details
  const [id, setId] = useState<string | null>(null);
  const router = useRouter();
  const user =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const [username, setUsername] = useState<string | null>("");
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  const [showModal, setShowModal] = React.useState(false);
  const [newReview, setNewReview] = React.useState({ content: "" });

  useEffect(() => {
    console.log(user);
    if (user) {
      const parsedUser = JSON.parse(user);
      setUsername(parsedUser.username);
    }
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setId(urlParams.get("id"));
    }
  }, []); // Run once after the component mounts on the client side

  useEffect(() => {
    console.log(id);
    if (id) {
      // Fetch app details based on the id from the backend
      const fetchAppDetails = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/apps/listing/${id}`
          );
          const data = await response.json();
          setAppDetails(data); // Set fetched data to state
        } catch (error) {
          console.error("Error fetching app details:", error);
        }
      };

      fetchAppDetails();
    }
  }, [id]); // Run when the id changes

  if (!appDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
      </div>
    );
  }

  
  const logoutclick = () => {
    router.push("/user/login");
  };
  const submitReview = async () => {
    if (newReview.content.trim()) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/apps/reviews/${appDetails.id}/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`, // Replace with your actual token
            },
            body: JSON.stringify({ comment: newReview.content }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to submit review:", errorData);
          alert("Failed to submit review. Please try again.");
          return;
        }

        // Reset input and close modal after successful submission
        setNewReview({ content: "" });
        setShowModal(false);
        
        // Fetch updated reviews instead of refreshing the whole page
        fetchUpdatedReviews();

        console.log("Review submitted successfully.");
      } catch (error) {
        console.error("Error submitting review:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  // Function to fetch only the updated reviews
  const fetchUpdatedReviews = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/apps/listing/${id}`
      );
      const data = await response.json();
      // Update only the reviews part of appDetails
      setAppDetails((prevDetails: any) => ({
        ...prevDetails,
        reviews: data.reviews
      }));
    } catch (error) {
      console.error("Error fetching updated reviews:", error);
    }
  };

  // Handle review button click
  const handleReviewButtonClick = () => {
    if (!user) {
      setLoginPromptOpen(true);
    } else {
      setShowModal(true);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <header className="flex justify-between items-center px-6 py-4 bg-gray-100">
        <div className="flex items-center space-x-4">
        <Link href="/landing_page_user">
      <Image src="/logo_efdri.png" alt="Logo" width={40} height={40} />
    </Link>
          {/* <div className="flex justify-center ">
            <button
              className={`px-6 py-3 text-sm font-semibold ${
                activeTab === "Mobile Apps"
                  ? "text-customblue border-b-2 border-customblue font-bold"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("Mobile Apps")}
            >
              Mobile Apps
            </button>
            <button
              className={`px-6 py-3 text-sm font-semibold ${
                activeTab === "Web Portal"
                  ? "text-customblue border-b-2 border-customblue font-bold"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("Web Portal")}
            >
              Web Portal
            </button>
          </div> */}
        </div>

        <div className="flex items-center space-x-4">
        <button
            onClick={username ? logoutclick : () => router.push("/user/login")}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-[50px]"
          >
            {username || "Login"}
          </button>
        </div>
      </header>
      <div className="flex items-center space-x-6  mx-20 my-10">
        <img
          src={appDetails.app_icon || "/eodb.jpg"} // Display fetched app icon
          alt="App Icon"
          className="w-60 rounded-lg shadow-md"
        />
        <div>
          <h1
            className="text-4xl font-bold"
            style={{ color: "#2A0606", marginBottom: "5px" }}
          >
            {appDetails.app_name}
          </h1>
          <h2 className="text-lg text-gray-600">{appDetails.app_name}</h2>
          <div className="flex space-x-6 mt-4">
            {/* <div>
              <p className="text-xl text-black font-semibold">
                {appDetails.name}
              </p>
              <p className="text-sm text-gray-500">{appDetails.name} reviews</p>
            </div> */}
            <div>
              <p className="text-xl font-semibold text-black">
                {appDetails.view_count}
              </p>
              <p className="text-sm text-gray-500">Downloads</p>
            </div>
            <div>
              <p className="text-xl text-black font-semibold">
                {appDetails.category}
              </p>
              <p className="text-sm text-gray-500">Category</p>
            </div>
          </div>
          <div className="ml-auto mt-6">
            {appDetails.supported_platforms.includes("Android") && (
              <button
                className="bg-customblue text-white px-6 py-2 rounded-md mr-4"
                style={{ width: "200px" }}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = appDetails.apk_file;
                  link.download = "";
                  link.click();
                }}
              >
                Download APK
              </button>
            )}
            {appDetails.supported_platforms.includes("IOS") && (
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-md"
                style={{ width: "200px" }}
                onClick={() => {
                  window.open(appDetails.ios_url, "_blank"); // Open the iOS app link in a new tab
                }}
              >
                Install iOS
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Screenshots */}
      <section className="mt-20 mx-20">
        <h2
          className="text-gray-800 font-bold mb-5"
          style={{ fontSize: "20px" }}
        >
          Screen Shots
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {appDetails.screenshots?.map(
            (screenshot: {
              id: Key | null | undefined;
              screenshot: string | undefined;
            }) => (
              <img
                key={screenshot.id}
                src={screenshot.screenshot}
                alt={`App Screenshot ${screenshot.id}`}
                className="rounded-lg shadow-md"
                style={{ height: "300px" }}
              />
            )
          )}
        </div>
      </section>

      {/* About */}
      <section className="mt-20  mx-20">
        <h2
          className="text-gray-800 font-bold mb-4"
          style={{ fontSize: "20px" }}
        >
          About this app
        </h2>
        <p className="text-gray-700">{appDetails.description}</p>
      </section>

      {/* Ratings and Reviews */}
      <section className="mt-20 mx-20 mb-20">
        {/* Flex container for heading and button */}
        <div className="flex items-center justify-between">
          <h2 className="text-gray-800 font-bold" style={{ fontSize: "20px" }}>
            Reviews
          </h2>
          <button
            onClick={handleReviewButtonClick}
            className="flex items-center space-x-2 text-customblue  rounded-md px-4 py-2 hover:bg-blue-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
            </svg>
            <span>Write a Review</span>
          </button>
        </div>
        <div className="mt-6 space-y-4">
          {appDetails.reviews.map((review: any, index: number) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex flex-col">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src="/mint.png" // Replace with actual image URL or fallback
                      alt={review.user}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* User name and date */}
                  <div className="flex flex-col">
                    <p className="font-bold text-black">{review.user}</p>
                    <p className="text-black text-sm">
                      {new Date(review.created_at).toLocaleString()}
                    </p>
                  </div>

                  {/* Circular Avatar */}
                </div>
                <p className="text-black text-sm mt-5 mx-16">
                  {review.comment}
                </p>
              </div>
              {/* Text and Image in one line */}
              {/* Comment in the next line */}
            </div>
          ))}
        </div>

        {/* Review Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-bold mb-2 text-black">
                Leave A Comment
              </h3>
              <h3 className="text-lg mb-4 text-black">
                Share your feedback to help others! Submit your review, and
                we'll ensure it meets our guidelines before publishing.
              </h3>
              <textarea
                className="w-full border border-gray-300 p-2 rounded mb-4 text-black"
                rows={8}
                value={newReview.content}
                onChange={(e) =>
                  setNewReview({ ...newReview, content: e.target.value })
                }
              ></textarea>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-300 rounded mr-2 hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-customblue text-white rounded hover:bg-blue-600"
                  onClick={submitReview}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Login Prompt Modal */}
        {loginPromptOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-bold mb-4 text-black">
                Login Required
              </h3>
              <p className="text-gray-700 mb-6">
                You need to be logged in to write a review. Would you like to login now?
              </p>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-300 rounded mr-2 hover:bg-gray-400"
                  onClick={() => setLoginPromptOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-customblue text-white rounded hover:bg-blue-600"
                  onClick={() => {
                    setLoginPromptOpen(false);
                    router.push("/user/login");
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <footer className="bg-gray-100 py-5 px-10 ">
        <div className="flex flex-wrap justify-between items-center mb-6">
          {/* Logo Section */}
          <div className="flex flex-col items-start">
            {/* <img
                src="/logo_efdri.png"
                width={30}
                height={40}
                alt="Logo"
                className="h-12 mb-2"
              /> */}

            <p style={{ fontSize: "12px", color: "black" }}>
              Copyright © {new Date().getFullYear()} App Store. All rights
              reserved.
            </p>
            <div className="flex justify-center space-x-4 mt-2 text-black">
              <a
                style={{ fontSize: "12px" }}
                href="#"
                className="hover:text-blue-600"
              >
                Facebook
              </a>
              <a
                style={{ fontSize: "12px" }}
                href="#"
                className="hover:text-blue-600"
              >
                Twitter
              </a>
              <a
                style={{ fontSize: "12px" }}
                href="#"
                className="hover:text-blue-600"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-3 gap-8 text-sm text-black">
            {/* Column 1 */}
            <div>
              <h4 className="font-bold mb-2">Developers</h4>
              <ul>
                <li>
                  <a href="/login" className="hover:underline">
                    Developer Console
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:underline">
                    Submit APK
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2 */}

            {/* Column 3 */}
            <div className="ml-20">
              <h4 className="font-bold mb-2 ">Company</h4>
              <ul>
                <li>
                  <a 
                  
                  href="/landing_page_user/about_us"             
                  className="hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a
                                      href="/landing_page_user/contact_us"
                  // href="#"
                   className="hover:underline">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-4  text-black">
          <p style={{ fontSize: "12px" }}>
            Copyright © {new Date().getFullYear()} Gov App Ethiopia All rights
            reserved. | Privacy Policy | Copyright Policy | Terms | 
          </p>
        </div>
      </footer>
    </main>
  );
}
