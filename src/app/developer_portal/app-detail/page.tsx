"use client";

import Image from "next/image";
import { Key, useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import React from "react";
// import React, { useEffect, useRef, useState } from "react";

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

  const [isLoading, setIsLoading] = useState(false);

  // Function to handle file upload
  const handleScreenshotUpload = (index: number, file: File) => {
    const newScreenshots = [...screenshots];
    newScreenshots[index] = file; // Update the specific index with the new file
    setScreenshots(newScreenshots); // Update the state
  };
  useEffect(() => {
    
  }, []);
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

  const logoutclick = () => {
    router.push("/login");
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
      <div className="max-w-4xl mx-auto pl-6">
        {/* Progress Steps */}
        <div className="relative flex justify-between items-center mb-8">
          {steps.map(({ step, label }, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    activeStep >= step ? "bg-customblue" : "bg-gray-300"
                  }`}
                >
                  {activeStep > step ? "✔" : step}
                </div>
                {/* Step Label */}
                <span
                  className={`mt-2 text-sm ${
                    activeStep >= step ? "text-customblue" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Horizontal Line */}
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-grow mx-2 mb-5 ${
                    activeStep > step ? "bg-customblue" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="border rounded-lg p-6 shadow-lg bg-white">
          {activeStep === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-customblue">
                App Information
              </h2>
              <form className="space-y-5 pl-10 pr-10">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App Name
                  </label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="Enter app name"
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App Version
                  </label>
                  <input
                    type="text"
                    value={appVersion}
                    onChange={(e) => setAppVersion(e.target.value)}
                    placeholder="Enter app version"
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150"
                  >
                    <option value="">Select category</option>
                    <option>Education</option>
                    <option>Health</option>
                    <option>Finance</option>
                  </select>
                </div>

                <div className="mt-4 pt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supported Platforms
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <input
                        onChange={(e) => setAndroidChecked(e.target.checked)}
                        type="checkbox"
                        // checked={androidChecked}
                        className="mr-2 w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                      />
                      Android
                    </label>
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={isIOSChecked}
                        className="mr-2 w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                        onChange={(e) => setIsIOSChecked(e.target.checked)}
                      />
                      iOS
                    </label>
                  </div>
                  <div className="mt-4 pl-0 pt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      iOS URL(Optional)
                    </label>
                    <input
                      onChange={(e) => setIosurl(e.target.value)}
                      type="text"
                      value={ioSurl}
                      placeholder="Enter iOS URL"
                      className=" text-black w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150"
                    />
                  </div>
                </div>
              </form>
            </div>
          )}
          {activeStep === 2 && (
            <div>
              <h2 className="text-xl font-bold text-customblue mb-4">
                Upload Files
              </h2>
              <form className="space-y-4 pl-10 pr-10">
                {/* App Icon Section */}
                <div>
                  <label className="block text-gray-600 mb-1">App Icon</label>
                  <div className="flex flex-wrap gap-10 pb-7">
                    <div className="w-full sm:w-1/3 relative">
                      {appDetails.app_icon ? (
                        <div className="w-full h-full">
                          <img
                            src={appDetails.app_icon || "/eodb.jpg"} // Display fetched app icon
                            alt="App Icon"
                            className="w-full h-full object-cover rounded-lg mr-5"
                          />
                        </div>
                      ) : (
                        <p className="text-gray-500">No app icon uploaded</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* APK File Section */}
                <div>
                  <label className="block text-gray-600 mb-1">APK File</label>
                  {appDetails.apk_file ? (
                    <div className="flex items-center">
                      <a
                        href={appDetails.apk_file}
                        download
                        className="text-blue-600 underline cursor-pointer"
                      >
                        {appDetails.app_name}
                      </a>
                    </div>
                  ) : (
                    <p className="text-gray-500">No APK file uploaded</p>
                  )}
                </div>

                {/* Cover Graphics Section */}
                <div>
                  <label className="block text-gray-600 mb-1">
                    Cover Graphics
                  </label>
                  <div className="flex flex-wrap gap-10 pb-7">
                    <div className="w-full sm:w-1/3 relative">
                      {appDetails.cover_graphics ? (
                        <div className="w-full h-full">
                          <img
                            src={appDetails.cover_graphics}
                            alt="Cover Graphics"
                            className="w-full h-full object-cover rounded-lg mr-5"
                          />
                        </div>
                      ) : (
                        <p className="text-gray-500">
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
              <label className="text-xl font-bold text-customblue">
                Screenshots
              </label>
              <div className="flex flex-wrap gap-10 pl-10 pr-10">
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
            </div>
          )}
          {activeStep === 4 && (
            <div className="mt-2">
              <h2 className="text-2xl font-semibold text-customblue mb-4">
                App Description
              </h2>
              <form className="space-y-4 pl-10  pr-10">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    // rows="4"
                    placeholder="Enter app description"
                    value={appDetails.description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="text-black  w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150"
                  ></textarea>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    value={appDetails.tags}
                    onChange={(e) => setTags(e.target.value)}
                    type="text"
                    placeholder="Enter tags"
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150"
                  />
                </div>

                {/* Privacy Policy URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Privacy Policy URL
                  </label>
                  <input
                    value={appDetails.privacy_policy_url}
                    onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
                    type="url"
                    placeholder="Enter privacy policy"
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Web Portal URL(Optional)
                  </label>
                  <input
                    value={appDetails.web_portal}
                    onChange={(e) => setWebPortalUrl(e.target.value)}
                    type="url"
                    placeholder="Enter web portal URL"
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150"
                  />
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            disabled={activeStep === 1}
            className=" text-white px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          {activeStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="  px-4 py-2 bg-customblue text-white rounded-lg hover:bg-customblue disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => handleSubmit()} // Wrap the async function in an arrow function
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="spinner-border animate-spin w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full"></div>
                </div>
              ) : (
                "Update"
              )}
              {/* Submit */}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
