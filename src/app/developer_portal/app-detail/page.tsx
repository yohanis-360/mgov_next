"use client";

import Image from "next/image";
import { Key, useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import React from "react";
// import React, { useEffect, useRef, useState } from "react";
import { useRequireAuth } from "@/utils/auth";

const steps = [
  { label: "App Information", step: 1 },
  { label: "Upload Files", step: 2 },
  { label: "Screenshot ", step: 3 },
  { label: "App Description ", step: 4 },
];
type UploadedFile = {
  name: string;
  size: number;
};
export default function AppDetails() {
  // Add authentication check (redirects to login if not authenticated)
  useRequireAuth("/login", "developer");

  const [apkFile, setApkFile] = useState<File | null>(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [apkUrl, setApkUrl] = useState<string | null>(null);
  const [appIcon, setAppIcon] = useState<File | null>(null);
  const [coverGraphics, setCoverGraphics] = useState<File | null>(null);
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [isAndroidChecked, setAndroidChecked] = useState(false);
  const [isIOSChecked, setIsIOSChecked] = useState(false);
  const nextStep = () => setActiveStep((prev) => prev + 1);
  const prevStep = () => setActiveStep((prev) => prev - 1);
  const [user, setUser] = useState(null);
  const [apps, setApps] = useState<App[]>([]); // Correct type for the apps state
  const [appName, setAppName] = useState("");
  const [status, setstatus] = useState("");
  const [appVersion, setAppVersion] = useState("");
  const [category, setCategory] = useState("");
  const [ioSurl, setIosurl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState("");
  const [releaseNotes, setReleaseNotes] = useState("");
  const totalSteps = steps.length;
  const [currentView, setCurrentView] = useState("overview");
  const [screenshots, setScreenshots] = useState(Array(3).fill(null));
  const [errorMessage, setErrorMessage] = useState("");
  const [userName, setusername] = useState("");
  const [webPortalUrl, setWebPortalUrl] = useState("");
  const backendUrl = process.env.BACKEND_URL;

  const [isLoading, setIsLoading] = useState(false);

  // Function to handle file upload
  const handleScreenshotUpload = (index: number, file: File) => {
    const newScreenshots = [...screenshots];
    newScreenshots[index] = file; // Update the specific index with the new file
    setScreenshots(newScreenshots); // Update the state
  };
  useEffect(() => {}, []);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setApkFile(file);
      setUploadPercentage(0);
      await startUpload(file);
    }
  };
  const startUpload = async (file: File) => {
    const totalSize = file.size;
    let uploaded = 0;

    const interval = setInterval(() => {
      uploaded += totalSize / 100;
      const percentage = Math.round((uploaded / totalSize) * 100);
      setUploadPercentage(percentage);

      if (percentage >= 100) {
        clearInterval(interval);
        handleFileUploaded(file);
      }
    }, 100);
  };

  const handleFileUploaded = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    setApkUrl(fileUrl);
  };

  const handleAppIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Null check
    if (file) {
      setAppIcon(file); // Store the file in state
    }
  };
  const handlecoverGraphicsUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]; // Null check
    if (file) {
      setCoverGraphics(file); // Store the file in state
    }
  };

  const handleAppClick = (id: number) => {
    router.push(`/app-submission/app-detail?id=${id}`);
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const developer_page = () => {
    router.push("/developer_portal");
  };
  const handleSubmit = async () => {};

  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    appIcon: null,
    apkFile: null,
  });

  interface App {
    id: number;
    app_name: string;
    app_version: string;
    category: string;
    status: string;
    created_at: string;
    tags: string;
  }
const [isPublished, setIsPublished] = useState(false);
  

  const handleToggle = async () => {
    const newStatus = isPublished ? "Unpublished" : "Approved";
    setstatus(newStatus);
    setIsPublished(!isPublished);
    
    try {
      const accessToken = localStorage.getItem("access_token");
      const res = await fetch(`http://127.0.0.1:8000/apps/update/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        router.back(); setTimeout(() => { router.refresh(); }, 500);
            } else {
        const errorResponse = await res.json();
        console.error(errorResponse);
      }
    } catch (err) {
      console.error(err);
    }
    // setIsPublished((prev) => !prev);
    // console.log(isPublished);
    // console.log(isPublished);

  };

  const [activeTab, setActiveTab] = useState("Mobile Apps");
  const [appDetails, setAppDetails] = useState<any>(null); // State to store app details
  const [id, setId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>("");

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

  // components/UpdateAppStatus.js

  const handleUpdate = async () => {
    console.log("Updating before app status...",isPublished);
    const updatedStatus = isPublished ? 'Approved' : 'Unpublished';
    console.log("Updating after app status...",updatedStatus);


    try {
      const accessToken = localStorage.getItem("access_token");
      const res = await fetch(`http://127.0.0.1:8000/apps/update/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: updatedStatus }),
      });

      if (res.ok) {
        router.back(); setTimeout(() => { router.refresh(); }, 500);
            } else {
        const errorResponse = await res.json();
        console.error(errorResponse);
      }
    } catch (err) {
      console.error(err);
    }
  };

   
  

  useEffect(() => {
    console.log(id);
    if (id) {
      // Fetch app details based on the id from the backend
      const fetchAppDetails = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/apps/app_listing/${id}`
          );

          const data = await response.json();
          console.log(data);
          setAppDetails(data);
          setAppName(data.app_name || "");
          setstatus(data.status || "");
          const fetchedStatus = data.status || "";
          setIsPublished(fetchedStatus === "Approved");
          setAppVersion(data.app_version || "");
          setCategory(data.category || "");
          setAndroidChecked(data.supported_platforms.includes("Android"));
          setIsIOSChecked(data.supported_platforms.includes("IOS"));
          setIosurl(data.ios_url || "");
        } catch (error) {
          console.error("Error fetching app details:", error);
        }
      };

      fetchAppDetails();
    }
  }, [id]);

  if (!appDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Progress Steps */}
        <div className="relative flex justify-between items-center my-4 md:mb-8 overflow-x-auto py-2 md:py-0">
          {steps.map(({ step, label }, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    activeStep >= step ? "bg-customblue" : "bg-gray-300"
                  }`}
                >
                  {activeStep > step ? "✔" : step}
                </div>
                {/* Step Label */}
                <span
                  className={`mt-1 md:mt-2 text-xs md:text-sm ${
                    activeStep >= step ? "text-customblue" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Horizontal Line */}
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-grow mx-1 md:mx-2 mb-4 md:mb-5 ${
                    activeStep > step ? "bg-customblue" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="border rounded-lg p-4 md:p-6 shadow-lg bg-white">
          {activeStep === 1 && (
            <div>
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-customblue">
                App Information
              </h2>
              <form className="space-y-4 md:space-y-5 px-2 md:px-10">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    App Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="Enter app name"
                    className="text-black w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150 text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    App Version
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={appVersion}
                    onChange={(e) => setAppVersion(e.target.value)}
                    placeholder="Enter app version"
                    className="text-black w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150 text-sm md:text-base"
                  />
                </div>

                <div className="mt-2 md:mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="text-black w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150 text-sm md:text-base"
                  >
                    <option value="">Select category</option>
                    <option>Education</option>
                    <option>Health</option>
                    <option>Finance</option>
                  </select>
                </div>
               
                <div className="mt-2 md:mt-4 pt-2 md:pt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Supported Platforms
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <input
                        onChange={(e) => setAndroidChecked(e.target.checked)}
                        type="checkbox"
                        className="mr-2 w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                      />
                      Android
                    </label>
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <input
                        readOnly
                        type="checkbox"
                        checked={isIOSChecked}
                        className="mr-2 w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                        onChange={(e) => setIsIOSChecked(e.target.checked)}
                      />
                      iOS
                    </label>
                  </div>
                  <div className="mt-2 md:mt-4 pt-2 md:pt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      iOS URL(Optional)
                    </label>
                    <input
                      onChange={(e) => setIosurl(e.target.value)}
                      type="text"
                      readOnly
                      value={ioSurl}
                      placeholder="Enter iOS URL"
                      className="text-black w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150 text-sm md:text-base"
                    />
                  </div>
                </div>
              </form>
            </div>
          )}
          {activeStep === 2 && (
            <div>
              <h2 className="text-lg md:text-xl font-bold text-customblue mb-3 md:mb-4">
                Upload Files
              </h2>
              <form className="space-y-3 md:space-y-4 px-2 md:px-10">
                {/* App Icon Section */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">App Icon</label>
                  <div className="flex flex-wrap gap-4 md:gap-10 pb-4 md:pb-7">
                    <div className="w-full sm:w-1/2 md:w-1/3 relative">
                      {appDetails.app_icon ? (
                        <div className="w-full h-full">
                          <img
                            src={appDetails.app_icon || "/eodb.jpg"}
                            alt="App Icon"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No app icon uploaded</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* APK File Section */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">APK File</label>
                  {appDetails.apk_file ? (
                    <div className="flex items-center">
                      <a
                        href={appDetails.apk_file}
                        download
                        className="text-blue-600 underline cursor-pointer text-sm md:text-base"
                      >
                        {appDetails.app_name}
                      </a>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No APK file uploaded</p>
                  )}
                </div>

                {/* Cover Graphics Section */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Cover Graphics
                  </label>
                  <div className="flex flex-wrap gap-4 md:gap-10 pb-4 md:pb-7">
                    <div className="w-full sm:w-1/2 md:w-1/3 relative">
                      {appDetails.cover_graphics ? (
                        <div className="w-full h-full">
                          <img
                            src={appDetails.cover_graphics}
                            alt="Cover Graphics"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No cover graphics uploaded
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
          {activeStep === 3 && (
            <div>
              <label className="text-lg md:text-xl font-bold text-customblue block mb-3 md:mb-4">
                Screenshots
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 px-2 md:px-10">
                {appDetails.screenshots && appDetails.screenshots.length > 0 ? (
                  appDetails.screenshots.map(
                    (screenshot: {
                      id: Key | null | undefined;
                      screenshot: string | undefined;
                    }) => (
                      <img
                        key={screenshot.id}
                        src={screenshot.screenshot}
                        alt={`App Screenshot ${screenshot.id}`}
                        className="rounded-lg shadow-md w-full h-auto max-h-[200px] md:max-h-[300px] object-contain mx-auto"
                      />
                    )
                  )
                ) : (
                  <p className="text-gray-500 text-sm col-span-full text-center py-4">No screenshots available</p>
                )}
              </div>
            </div>
          )}
          {activeStep === 4 && (
            <div className="mt-2">
             <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-4 px-2 md:px-10">
              <h2 className="text-xl md:text-2xl font-semibold text-customblue mb-2 md:mb-0">
                App Description
              </h2>
              {(status === "Approved" || status === "Unpublished") && (
              <div className="flex items-center gap-2 md:gap-4">
                <div
                  onClick={handleToggle}
                  className={`w-10 md:w-12 h-5 md:h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition ${
                    isPublished? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  <div
                    className={`w-4 md:w-5 h-4 md:h-5 bg-white rounded-full shadow-md transform transition ${
                      isPublished ? "translate-x-5 md:translate-x-6" : ""
                    }`}
                  ></div>
                </div>
                <span className={`text-xs md:text-sm font-medium ${isPublished ? "text-green-600" : "text-red-600"}`}>
                {isPublished ? "Published" : "Unpublished"}
                </span>
              </div>
              )}
            </div>
      

              <form className="space-y-3 md:space-y-4 px-2 md:px-10">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter app description"
                    readOnly
                    value={appDetails.description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="text-black w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150 text-sm md:text-base"
                  ></textarea>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Tags
                  </label>
                  <input
                    value={appDetails.tags}
                    readOnly
                    onChange={(e) => setTags(e.target.value)}
                    type="text"
                    placeholder="Enter tags"
                    className="text-black w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150 text-sm md:text-base"
                  />
                </div>

                {/* Privacy Policy URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Privacy Policy URL
                  </label>
                  <input
                    value={appDetails.privacy_policy_url}
                    readOnly
                    onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
                    type="url"
                    placeholder="Enter privacy policy"
                    className="text-black w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150 text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Web Portal URL(Optional)
                  </label>
                  <input
                    value={appDetails.web_portal}
                    onChange={(e) => setWebPortalUrl(e.target.value)}
                    type="url"
                    readOnly
                    placeholder="Enter web portal URL"
                    className="text-black w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150 text-sm md:text-base"
                  />
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4 md:mt-6 px-2">
          <button
            onClick={prevStep}
            disabled={activeStep === 1}
            className="text-white px-3 md:px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50 text-sm md:text-base"
          >
            Previous
          </button>
          {activeStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="px-3 md:px-4 py-2 bg-customblue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm md:text-base"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => handleUpdate()}
              className="px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm md:text-base"
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="spinner-border animate-spin w-4 h-4 md:w-6 md:h-6 border-4 border-t-transparent border-blue-500 rounded-full"></div>
                </div>
              ) : (
                "Update"
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
