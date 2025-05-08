"use client";

import Image from "next/image";
import Link from "next/link";
import { Key, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { handleLogout, isAuthenticated } from "@/utils/auth";
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import Footer from '@/components/Footer';

export default function AppDetails() {
  const { t } = useLanguage();
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
  const [newReview, setNewReview] = React.useState({ content: "", rating: 5 });
  const [hoveredRating, setHoveredRating] = React.useState(0);
  const [isReviewSuccessModalVisible, setIsReviewSuccessModalVisible] = useState(false);

  useEffect(() => {
    // Add this block to check authentication state for user-specific features
    const authenticated = isAuthenticated();
    if (authenticated) {
      // Only attempt to retrieve user data if authenticated
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUsername(parsedUser.username);
      }
    }
    
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const appId = urlParams.get("id");
      setId(appId);
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

          // Fetch related apps using the same endpoint as landing page
          if (data.category) {
            const queryParams = new URLSearchParams({
              category: data.category,
              exclude: id
            });
            const relatedResponse = await fetch(
              `http://127.0.0.1:8000/apps/search?${queryParams.toString()}`
            );
            const relatedData = await relatedResponse.json();
            setAppDetails((prev: any) => ({
              ...prev,
              related_apps: relatedData || []
            }));
          }
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
    handleLogout(router);
  };

  // Calculate average rating
  const averageRating = appDetails?.reviews?.length > 0
    ? (appDetails.reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / appDetails.reviews.length).toFixed(1)
    : 0;

  const submitReview = async () => {
    if (newReview.content.trim()) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/apps/reviews/${appDetails.id}/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ 
              comment: newReview.content,
              rating: newReview.rating 
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to submit review:", errorData);
          toast.error('Failed to submit review. Please try again.');
          return;
        }

        // Reset input and close review modal after successful submission
        setNewReview({ content: "", rating: 5 });
        setShowModal(false);
        
        // Show success modal
        setIsReviewSuccessModalVisible(true);
        
        // Fetch updated reviews
        fetchUpdatedReviews();

        console.log("Review submitted successfully.");
      } catch (error) {
        console.error("Error submitting review:", error);
        toast.error('An error occurred. Please try again.');
      }
    } else {
      toast.error('Please enter a review comment');
    }
  };

  const handleReviewSuccessModalOk = () => {
    setIsReviewSuccessModalVisible(false);
    // Refresh the reviews list
    fetchUpdatedReviews();
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
      <Toaster />
      <header className="flex justify-between items-center px-4 md:px-6 py-4 bg-gray-100">
        <div className="flex items-center space-x-4">
          <Link href="/landing_page_user">
            <Image src="/logo_efdri.png" alt="Logo" width={40} height={40} />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSelector />
          <button
            onClick={username ? logoutclick : () => router.push("/user/login")}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-[50px]"
          >
            {username || t('login')}
          </button>
        </div>
      </header>
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6 px-4 md:px-10 lg:px-20 py-6 md:py-10">
        <img
          src={appDetails.app_icon || "/eodb.jpg"} // Display fetched app icon
          alt="App Icon"
          className="w-32 md:w-40 lg:w-60 rounded-lg shadow-md"
        />
        <div className="w-full">
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold"
            style={{ color: "#2A0606", marginBottom: "5px" }}
          >
            {appDetails.app_name}
          </h1>
          <h2 className="text-md lg:text-lg text-gray-600">{appDetails.app_name}</h2>
          <div className="flex flex-wrap gap-4 md:gap-6 mt-4">
            <div>
              <p className="text-lg md:text-xl font-semibold text-black">
                {appDetails.view_count}
              </p>
              <p className="text-xs md:text-sm text-gray-500">Downloads</p>
            </div>
            <div>
              <p className="text-lg md:text-xl text-black font-semibold">
                {appDetails.category}
              </p>
              <p className="text-xs md:text-sm text-gray-500">Category</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            {appDetails.supported_platforms.includes("Android") && (
              <button
                className="bg-customblue text-white px-4 md:px-6 py-2 rounded-md text-sm md:text-base"
                style={{ width: "160px", maxWidth: "100%" }}
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
                className="bg-green-600 text-white px-4 md:px-6 py-2 rounded-md text-sm md:text-base"
                style={{ width: "160px", maxWidth: "100%" }}
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
      <section className="mt-8 md:mt-12 lg:mt-20 px-4 md:px-10 lg:px-20">
        <h2 className="text-gray-800 font-bold mb-3 md:mb-5" style={{ fontSize: "18px" }}>
          {t('screenshots')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {appDetails.screenshots?.map(
            (screenshot: {
              id: Key | null | undefined;
              screenshot: string | undefined;
            }) => (
              <img
                key={screenshot.id}
                src={screenshot.screenshot}
                alt={`App Screenshot ${screenshot.id}`}
                className="rounded-lg shadow-md w-full"
                style={{ height: "auto", maxHeight: "300px", objectFit: "cover" }}
              />
            )
          )}
        </div>
      </section>

      {/* About */}
      <section className="mt-8 md:mt-12 lg:mt-20 px-4 md:px-10 lg:px-20">
        <h2 className="text-gray-800 font-bold mb-3 md:mb-4" style={{ fontSize: "18px" }}>
          {t('about_app')}
        </h2>
        <p className="text-gray-700 text-sm md:text-base">{appDetails.description}</p>
      </section>

      {/* Ratings and Reviews */}
      <section className="mt-8 md:mt-12 lg:mt-20 px-4 md:px-10 lg:px-20 mb-10 md:mb-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-2">
            <h2 className="text-gray-800 font-bold" style={{ fontSize: "18px" }}>
              {t('reviews')}
            </h2>
            <div className="flex items-center">
              <span className="text-yellow-400 text-xl">★</span>
              <span className="ml-1 text-gray-700">{averageRating}</span>
              <span className="ml-1 text-gray-500">({appDetails?.reviews?.length || 0} reviews)</span>
            </div>
          </div>
          <button
            onClick={handleReviewButtonClick}
            className="flex items-center space-x-2 text-customblue rounded-md px-3 py-1 sm:px-4 sm:py-2 hover:bg-blue-50 transition-colors text-sm md:text-base"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
            </svg>
            <span>{t('write_review')}</span>
          </button>
        </div>
        <div className="mt-4 md:mt-6 space-y-4">
          {appDetails.reviews.map((review: any, index: number) => (
            <div key={index} className="flex items-start space-x-3 md:space-x-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-col w-full">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden">
                    <img
                      src="/mint.png"
                      alt={review.user}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* User name, date, and rating */}
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-black text-sm md:text-base">{review.user}</p>
                        <p className="text-black text-xs md:text-sm">
                          {new Date(review.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-sm md:text-base ${
                                star <= review.rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 md:mt-4 ml-12 md:ml-16">
                  <p className="text-black text-sm md:text-base bg-white p-3 rounded-md shadow-sm">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Review Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-base md:text-lg font-bold mb-2 text-black">
                {t('leave_comment')}
              </h3>
              <h3 className="text-sm md:text-base mb-4 text-black">
                {t('share_feedback')}
              </h3>
              
              {/* Rating Stars */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('rating')}
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`text-2xl focus:outline-none ${
                        star <= (hoveredRating || newReview.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                className="w-full border border-gray-300 p-2 rounded mb-4 text-black text-sm md:text-base"
                rows={6}
                value={newReview.content}
                onChange={(e) =>
                  setNewReview({ ...newReview, content: e.target.value })
                }
              ></textarea>
              <div className="flex justify-end">
                <button
                  className="px-3 py-1 md:px-4 md:py-2 bg-gray-300 rounded mr-2 hover:bg-gray-400 text-sm md:text-base"
                  onClick={() => setShowModal(false)}
                >
                  {t('cancel')}
                </button>
                <button
                  className="px-3 py-1 md:px-4 md:py-2 bg-customblue text-white rounded hover:bg-blue-600 text-sm md:text-base"
                  onClick={submitReview}
                >
                  {t('submit')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Login Prompt Modal */}
        {loginPromptOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-black">
                {t('login_required')}
              </h3>
              <p className="text-gray-700 mb-4 md:mb-6 text-sm md:text-base">
                {t('login_to_review')}
              </p>
              <div className="flex justify-end">
                <button
                  className="px-3 py-1 md:px-4 md:py-2 bg-gray-300 rounded mr-2 hover:bg-gray-400 text-sm md:text-base"
                  onClick={() => setLoginPromptOpen(false)}
                >
                  {t('cancel')}
                </button>
                <button
                  className="px-3 py-1 md:px-4 md:py-2 bg-customblue text-white rounded hover:bg-blue-600 text-sm md:text-base"
                  onClick={() => {
                    setLoginPromptOpen(false);
                    router.push("/user/login");
                  }}
                >
                  {t('login')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Success Modal */}
        {isReviewSuccessModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {t('review_submitted')}
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  {t('thank_you_review')}
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={handleReviewSuccessModalOk}
                    className="px-6 py-2 bg-customblue text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Related Apps Section */}
      <section className="mt-8 md:mt-12 lg:mt-20 px-4 md:px-10 lg:px-20 mb-10 md:mb-20">
        <h2 className="text-gray-800 font-bold mb-4" style={{ fontSize: "16px" }}>
          {t('related_apps')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
          {appDetails.related_apps
            ?.filter((app: any) => app.id !== appDetails.id) // Exclude current app
            .map((app: any) => (
              <div
                key={app.id}
                onClick={() => {
                  // Increment view count for the clicked app
                  fetch(`http://127.0.0.1:8000/apps/increment-view-count/`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ appId: app.id }),
                  }).catch(error => console.error("Error updating view count:", error));
                  
                  // Navigate to the app details page
                  router.push(`/landing_page_user/app_detail?id=${app.id}`);
                }}
                className="p-2 md:p-4 rounded cursor-pointer hover:bg-gray-50 transition-colors duration-300"
              >
                <div className="overflow-hidden rounded-lg shadow-lg mb-2 md:mb-5">
                  <Image
                    src={`http://127.0.0.1:8000${app.cover_graphics}`}
                    alt={app.app_name}
                    width={300}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="font-semibold text-gray-800" style={{ fontSize: "12px" }}>
                  {app.app_name}
                </h3>
                <p className="text-xs text-gray-500">
                  {app.category} • {app.tags}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {app.view_count || 0} downloads
                </p>
              </div>
            ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
