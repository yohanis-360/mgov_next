"use client";
import { useDropzone } from "react-dropzone";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Form, Input, Button, notification, Radio, message, Modal } from "antd";

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
interface App {
  app_name: string;
  app_version: string;
  category: string;
  created_at: string;
  status: string;
  tags?: string; // Optional field, in case 'tags' is not always available
}

export default function AppSubmissionOverview() {
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [apkUrl, setApkUrl] = useState<string | null>(null);
  const [appIcon, setAppIcon] = useState<File | null>(null);
  const [coverGraphics, setCoverGraphics] = useState<File | null>(null);
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Form validation state
  const [errors, setErrors] = useState({
    appName: "",
    appVersion: "",
    category: "",
    platforms: "",
    iosUrl: "",
    appIcon: "",
    apkFile: "",
    coverGraphics: "",
    description: "",
    tags: "",
    privacyPolicyUrl: "",
    screenshots: "",
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [isAndroidChecked, setAndroidChecked] = useState(false);
  const [isIOSChecked, setIsIOSChecked] = useState(false);
  const nextStep = () => {
    // Validate the current step before proceeding
    if (validateCurrentStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };
  
  const validateCurrentStep = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (activeStep === 1) {
      // Validate App Information step
      if (!appName.trim()) {
        newErrors.appName = "App name is required";
        isValid = false;
      } else {
        newErrors.appName = "";
      }
      
      if (!appVersion.trim()) {
        newErrors.appVersion = "App version is required";
        isValid = false;
      } else {
        newErrors.appVersion = "";
      }
      
      if (!category) {
        newErrors.category = "Category is required";
        isValid = false;
      } else {
        newErrors.category = "";
      }
      
      if (!isAndroidChecked && !isIOSChecked) {
        newErrors.platforms = "At least one platform must be selected";
        isValid = false;
      } else {
        newErrors.platforms = "";
      }
      
      if (isIOSChecked && !ioSurl.trim()) {
        newErrors.iosUrl = "iOS URL is required when iOS platform is selected";
        isValid = false;
      } else {
        newErrors.iosUrl = "";
      }
    } else if (activeStep === 2) {
      // Validate Upload Files step
      if (!appIcon) {
        newErrors.appIcon = "App icon is required";
        isValid = false;
      } else {
        newErrors.appIcon = "";
      }
      
      if (isAndroidChecked && !apkFile) {
        newErrors.apkFile = "APK file is required for Android apps";
        isValid = false;
      } else {
        newErrors.apkFile = "";
      }
      
      if (!coverGraphics) {
        newErrors.coverGraphics = "Cover graphics are required";
        isValid = false;
      } else {
        newErrors.coverGraphics = "";
      }
    } else if (activeStep === 3) {
      // Validate Screenshot step
      // Check if at least one screenshot is uploaded
      const hasScreenshot = screenshots.some(screenshot => screenshot !== null);
      if (!hasScreenshot) {
        newErrors.screenshots = "At least one screenshot is required";
        isValid = false;
      } else {
        newErrors.screenshots = "";
      }
    } else if (activeStep === 4) {
      // Validate App Description step
      if (!description.trim()) {
        newErrors.description = "Description is required";
        isValid = false;
      } else {
        newErrors.description = "";
      }
      
      if (!tags.trim()) {
        newErrors.tags = "Tags are required";
        isValid = false;
      } else {
        newErrors.tags = "";
      }
      
      if (!privacyPolicyUrl.trim()) {
        newErrors.privacyPolicyUrl = "Privacy Policy URL is required";
        isValid = false;
      } else {
        newErrors.privacyPolicyUrl = "";
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
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
  const [appIconError, setappiconError] = useState<string | null>(null);
  const [appGraphicsError, setappGraphicsError] = useState<string | null>(null);
  const [screenshotErorr, setScreenshotErorr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle file upload
  const handleScreenshotUpload = (index: number, file: File) => {
    if (file.size > 1024 * 1024) {
      // File size validation
      setScreenshotErorr(
        `Screenshot ${index + 1}: File size must be less than 1MB.`
      );
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      // Check image dimensions (e.g., 1280x720 as an example)
      if (img.width !== 1000 || img.height !== 517) {
        setScreenshotErorr(
          `Screenshot ${index + 1}: Image dimensions must be 1280x720 pixels.`
        );
        URL.revokeObjectURL(objectUrl);
        return;
      }

      setScreenshotErorr(null); // Clear previous error

      // Update the specific screenshot in the array
      const newScreenshots = [...screenshots];
      newScreenshots[index] = file;
      setScreenshots(newScreenshots);

      URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      setScreenshotErorr(`Screenshot ${index + 1}: Invalid image file.`);
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    const data = localStorage.getItem("data");
    const parsedData = data ? JSON.parse(data) : null;

    console.log("DATA", parsedData?.developer_info);

    if (userData) {
      const parsedUser = JSON.parse(userData);
      setusername(parsedUser.username);
    }
    console.log(accessToken);
    if (accessToken) {
      axios
        .get("http://127.0.0.1:8000/apps/developer_apps/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setApps(response.data.apps);
          setStats({
            total: response.data.total_apps,
            approved: response.data.approved_count,
            rejected: response.data.rejected_count,
            pending: response.data.pending_count,
          });
        })
        .catch((error) => {
          console.error("Error fetching apps and stats:", error);
        });
    }
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
  const handleOk = () => {
    setIsModalVisible(false);
    window.location.reload(); // Refresh the page
  };
  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  const handleFileUploaded = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    setApkUrl(fileUrl);
  };

  const handleAppIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setappiconError("File size must be less than 1MB.");
      setAppIcon(null);
      return;
    }
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      if (img.width !== 640 || img.height !== 640) {
        setappiconError("app icon dimensions must be 640x640."); // Set error message
        setAppIcon(null); // Clear the app icon state
        URL.revokeObjectURL(objectUrl);
        return;
      }

      setappiconError(null); // Clear any previous error
      setAppIcon(file); // Store the valid file
      URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      setappiconError("Invalid app icon file."); // Handle invalid image
      setAppIcon(null);
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };
  const handlecoverGraphicsUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // const file = e.target.files?.[0]; // Null check
    // if (file) {
    //   setCoverGraphics(file); // Store the file in state
    // }

    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setappGraphicsError("File size must be less than 1MB.");
      setCoverGraphics(null);
      return;
    }
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      if (img.width !== 640 || img.height !== 640) {
        setappGraphicsError("app graphics dimensions must be 640x640."); // Set error message
        setCoverGraphics(null); // Clear the app icon state
        URL.revokeObjectURL(objectUrl);
        return;
      }

      setappGraphicsError(null); // Clear any previous error
      setCoverGraphics(file); // Store the valid file
      URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      setappGraphicsError("Invalid app icon file."); // Handle invalid image
      setCoverGraphics(null);
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };

  const handleAppClick = async (id: number) => {
    // try {
    //   await fetch("http://127.0.0.1:8000/apps/increment-view-count/", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ appId: id }),
    //   });
    // } catch (error) {
    //   console.error("Error updating view count:", error);
    // }
    console.log(id);
    router.push(`/developer_portal/app-detail?id=${id}`);
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const logoutclick = () => {
    router.push("/login");
  };
  const handleSubmit = async () => {
    // Validate the final step first
    if (!validateCurrentStep()) {
      return; // Stop if validation fails
    }
    
    const formData = new FormData();
    formData.append("app_name", appName);
    formData.append("app_version", appVersion);
    formData.append("category", category);
    formData.append("ios_url", ioSurl);
    const supportedPlatforms = [];

    console.log(isAndroidChecked);
    if (isAndroidChecked) supportedPlatforms.push("Android");
    // if (isIOSChecked) supportedPlatforms.push("iOS");

    supportedPlatforms.forEach((platform) => {
      formData.append("supported_platforms", platform);
    });

    if (apkFile) formData.append("apk_file", apkFile);
    if (appIcon) formData.append("app_icon", appIcon);
    if (coverGraphics) formData.append("cover_graphics", coverGraphics);

    if (screenshots) {
      screenshots.forEach((screenshot) => {
        if (screenshot) {
          formData.append("screenshots_upload", screenshot); // Use the exact key expected in the backend
        }
      });
    }

    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("privacy_policy_url", privacyPolicyUrl);
    formData.append("release_notes", releaseNotes);
    formData.append("web_portal", webPortalUrl);

    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      console.log(accessToken);
      const response = await fetch("http://localhost:8000/apps/submit/", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();
      console.log(result);
      if (response.status === 201) {
        setIsModalVisible(true);
        // toast.success("App submitted successfully!");
        setIsLoading(false);
      } else {
        toast.error(
          result.error || "Something went wrong while submitting the app."
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error submitting app:", error);
      toast.error("Failed to submit the app. Please try again.");
      setIsLoading(false);
    }
  };

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

  const getStatusClass = (status: any) => {
    switch (status) {
      case "Approved":
        return "text-green-600";
      case "Rejected":
        return "text-red-600";
      default:
        return "text-orange-500";
    }
  };

  // Render the Overview Page
  const renderOverview = () => (
    <>
      {/* Stats Summary */}

      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow rounded p-4 text-center flex items-center gap-4">
          <img
            src="/icon_approv.png"
            alt="Total Apps"
            className="h-10 w-10 mr-8"
          />
          <div>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-[#667085]">Total Apps</p>
          </div>
        </div>
        <div className="bg-white shadow rounded p-4 text-center flex items-center gap-4">
          <img
            src="/icon_approv.png"
            alt="Approved"
            className="h-10 w-10 mr-8"
          />
          <div>
            <p className="text-2xl font-bold text-green-600">
              {stats.approved}
            </p>
            <p className="text-[#667085]">Approved</p>
          </div>
        </div>
        <div className="bg-white shadow rounded p-4 text-center flex items-center gap-4">
          <img
            src="/icon_approv.png"
            alt="Rejected"
            className="h-10 w-10 mr-8"
          />
          <div>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            <p className="text-[#667085]">Rejected</p>
          </div>
        </div>
        <div className="bg-white shadow rounded p-4 text-center flex items-center gap-4">
          <img
            src="/icon_approv.png"
            alt="Pending"
            className="h-10 w-10 mr-8"
          />
          <div>
            <p className="text-2xl font-bold text-orange-500">
              {stats.pending}
            </p>
            <p className="text-[#667085]">Pending</p>
          </div>
        </div>
      </div>

      {/* Submit New App Button */}
      <div className="flex justify-end items-center mb-6">
        <button
          onClick={() => setCurrentView("submitApp")}
          className="px-4 py-2 bg-customblue text-white  rounded-[15px] hover:bg-customblue"
          style={{ width: "200px" }}
        >
          Submit New App
        </button>
      </div>

      {/* App List */}
      <div>
        <div className="grid grid-cols-6 gap-4  p-4">
          <div className="text-[#6E6363] " style={{ fontSize: "15px" }}>
            App Name
          </div>
          <div className="text-[#6E6363] " style={{ fontSize: "15px" }}>
            Version
          </div>
          <div className="text-[#6E6363]" style={{ fontSize: "15px" }}>
            Category
          </div>
          <div className="text-[#6E6363]" style={{ fontSize: "15px" }}>
            Register Date
          </div>
          <div className="text-[#6E6363]" style={{ fontSize: "15px" }}>
            Status
          </div>
          <div className="text-[#6E6363]" style={{ fontSize: "15px" }}>
            Action
          </div>
        </div>
        {apps && apps.length > 0 ? (
          apps
            .sort((a, b) => {
              const dateA = new Date(a.created_at).getTime();
              const dateB = new Date(b.created_at).getTime();
              return dateB - dateA; // Sort descending
            })
            .map((app, index) => (
              <div
                onClick={() => handleAppClick(app.id)}
                key={index}
                className="grid grid-cols-6 gap-4 mb-2 p-4 border-b bg-grey-100 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 text-customblue"
              >
                <div>{app.app_name}</div>
                <div>{app.app_version}</div>
                <div>{app.category}</div>
                <div>{new Date(app.created_at).toLocaleDateString()}</div>
                <div className={getStatusClass(app.status)}>{app.status}</div>
                {/* <div>
      //   <button
      //     onClick={() => alert(`Action for ${app.app_name}`)}
      //     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      //   >
      //     View
      //   </button>
      // </div> */}
              </div>
            ))
        ) : (
          <div>No apps available</div>
        )}
      </div>
    </>
  );
  const AccountDetails = () => {
    // Get the data from localStorage and parse it
    const data = localStorage.getItem("data");
    const parsedData = data ? JSON.parse(data) : null;
    const developerInfo = parsedData.developer_info;

    return (
      <>
        {/* Stats Summary */}
        <div className="bg-white px-10 py-10">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4 text-black">
            Account And Organization Details
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              {/* Account Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 text-black"
                    defaultValue={
                      developerInfo.user.first_name +
                      " " +
                      developerInfo.user.last_name
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full border rounded-md p-2 text-black"
                    defaultValue={developerInfo.user.email}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 text-black"
                    defaultValue={developerInfo.user.mobile_number}
                  />
                </div>
              </div>
            </div>

            <div>
              {/* Organization Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-black">
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    defaultValue={developerInfo.organization_name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">
                    Organization Address
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    defaultValue={developerInfo.organization_address}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">
                    Organization Website
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    defaultValue={developerInfo.organization_website}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">
                    Region
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    defaultValue={developerInfo.sub_city}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">
                    Zone
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    defaultValue={developerInfo.zone}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    defaultValue={developerInfo.city}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">
                    Sub City
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    defaultValue={developerInfo.sub_city}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">
                    Woreda
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    defaultValue={developerInfo.woreda}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Save Changes
          </button> */}
        </div>
      </>
    );
  };
  // Render the Submit App Form
  const renderSubmitApp = () => (
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
                  App Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="Enter app name"
                  className={`text-black w-full px-4 py-2 border ${errors.appName ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150`}
                />
                {errors.appName && (
                  <p className="text-red-500 text-sm mt-1">{errors.appName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App Version <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={appVersion}
                  onChange={(e) => setAppVersion(e.target.value)}
                  placeholder="Enter app version"
                  className={`text-black w-full px-4 py-2 border ${errors.appVersion ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150`}
                />
                {errors.appVersion && (
                  <p className="text-red-500 text-sm mt-1">{errors.appVersion}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`text-black w-full px-4 py-2 border ${errors.category ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150`}
                >
                  <option value="">Select category</option>
                  <option>Education</option>
                  <option>Finance</option>
                  <option>Health</option>
                  <option>Agriculture</option>
                  <option>Trade</option>
                  <option>Technology</option>
                  <option>Social Affairs</option>
                  <option>Justice</option>
                  <option>Logistics</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div className="mt-4 pt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supported Platforms <span className="text-red-500">*</span>
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
                      type="checkbox"
                      className="mr-2 w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                      onChange={(e) => setIsIOSChecked(e.target.checked)}
                    />
                    iOS
                  </label>
                </div>
                {errors.platforms && (
                  <p className="text-red-500 text-sm mt-1">{errors.platforms}</p>
                )}
                {isIOSChecked && (
                  <div className="mt-4 pl-0 pt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      iOS URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      onChange={(e) => setIosurl(e.target.value)}
                      type="text"
                      value={ioSurl}
                      placeholder="Enter iOS URL"
                      className={`text-black w-full px-4 py-2 border ${errors.iosUrl ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150`}
                    />
                    {errors.iosUrl && (
                      <p className="text-red-500 text-sm mt-1">{errors.iosUrl}</p>
                    )}
                  </div>
                )}
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
                <label className="block text-gray-600 mb-1">
                  App Icon <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-10 pb-7">
                  <div className="w-full sm:w-1/3 relative">
                    {appIcon ? (
                      <div className="w-full h-full">
                        {/* Label wrapping image */}
                        <label
                          htmlFor="app-icon-input"
                          className="cursor-pointer w-full h-full"
                        >
                          <img
                            src={URL.createObjectURL(appIcon)}
                            alt="App Icon Preview"
                            className="w-full h-full object-cover rounded-lg mr-5"
                          />
                          {/* Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm z-10">
                            Tap to change
                          </div>
                        </label>
                        {/* Hidden file input */}
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          className="hidden"
                          id="app-icon-input"
                          onChange={handleAppIconUpload} // Handle app icon upload
                        />
                      </div>
                    ) : (
                      // Upload area when no app icon is selected
                      <label
                        htmlFor="app-icon-input"
                        className={`cursor-pointer flex flex-col items-center justify-center h-full border-2 border-dashed ${errors.appIcon ? "border-red-500" : "border-gray-300"} p-6 text-center hover:bg-gray-100`}
                        style={{ height: "150px", width: "700px" }}
                      >
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          className="hidden"
                          id="app-icon-input"
                          onChange={handleAppIconUpload} // Handle app icon upload
                        />
                        <img
                          src="/upload_icon.svg"
                          alt="Upload Icon"
                          className="w-5 h-5 mb-2"
                        />
                        <span className="text-sm font-bold text-gray-700">
                          Choose a file or drag and drop it here
                        </span>
                        <p className="text-xs text-[#989090]">
                          Supports PNG, JPG formats, with a maximum file size of
                          1MB and dimensions of 640 x 640
                        </p>
                      </label>
                    )}
                    {appIconError && (
                      <p className="text-red-500 text-sm mt-2">
                        {appIconError}
                      </p>
                    )}
                    {errors.appIcon && (
                      <p className="text-red-500 text-sm mt-2">{errors.appIcon}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* APK File Section */}
              {isAndroidChecked && (
                <>
                  <label className="block text-gray-600 mb-1">
                    APK File <span className="text-red-500">*</span>
                  </label>
                  <div
                    onClick={handleDivClick}
                    className={`border-2 border-dashed ${errors.apkFile ? "border-red-500" : "border-gray-300"} p-6 text-center cursor-pointer hover:bg-gray-100`}
                    style={{ height: "150px" }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".apk" // Allow only APK files
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center mb-2 space-x-2">
                      <img
                        src="/upload_icon.svg"
                        alt="Upload Icon"
                        className="w-5 h-5 mr-2 text-center"
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      Choose a file or drag and drop it here
                    </span>
                    <p className="text-xs text-[#989090]">
                      Supports APK file format, with a maximum file size of 500MB
                    </p>
                  </div>

                  {apkFile && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700">
                        APK:{" "}
                        <a
                          href={apkUrl || "#"}
                          download={apkFile?.name}
                          className="text-blue-600 underline cursor-pointer"
                        >
                          {apkFile.name}
                        </a>
                      </p>
                      <p className="text-xs text-gray-500">
                        Size: {(apkFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  )}

                  {apkFile && uploadPercentage > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700">
                        {uploadPercentage < 100 ? `Uploading... ${uploadPercentage}%` : 'Upload successful'}
                      </p>
                      <progress
                        value={uploadPercentage}
                        max="100"
                        className="w-full"
                      ></progress>
                    </div>
                  )}
                  
                  {errors.apkFile && (
                    <p className="text-red-500 text-sm mt-2">{errors.apkFile}</p>
                  )}
                </>
              )}

              {/* Cover Graphics Section */}
              <div>
                <label className="block text-gray-600 mb-1">
                  Cover Graphics <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-10 pb-7">
                  <div className="w-full sm:w-1/3 relative">
                    {coverGraphics ? (
                      <div className="w-full h-full">
                        {/* Label wrapping image */}
                        <label
                          htmlFor="cover-graphics-input"
                          className="cursor-pointer w-full h-full"
                        >
                          <img
                            src={URL.createObjectURL(coverGraphics)}
                            alt="Cover Graphics Preview"
                            className="w-full h-full object-cover rounded-lg mr-5"
                          />
                          {/* Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm z-10">
                            Tap to change
                          </div>
                        </label>
                        {/* Hidden file input */}
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          className="hidden"
                          id="cover-graphics-input"
                          onChange={handlecoverGraphicsUpload} // Handle cover graphics upload
                        />
                      </div>
                    ) : (
                      // Upload area when no cover graphics is selected
                      <label
                        htmlFor="cover-graphics-input"
                        className={`cursor-pointer flex flex-col items-center justify-center h-full border-2 border-dashed ${errors.coverGraphics ? "border-red-500" : "border-gray-300"} p-6 text-center hover:bg-gray-100`}
                        style={{ height: "150px", width: "700px" }}
                      >
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          className="hidden"
                          id="cover-graphics-input"
                          onChange={handlecoverGraphicsUpload} // Handle cover graphics upload
                        />
                        <img
                          src="/upload_icon.svg"
                          alt="Upload Icon"
                          className="w-5 h-5 mb-2"
                        />
                        <span className="text-sm font-bold text-gray-700">
                          Choose a file or drag and drop it here
                        </span>
                        <p className="text-xs text-[#989090]">
                          Supports PNG, JPG formats, with a maximum file size of
                          1MB and dimensions of 640 x 640
                        </p>
                      </label>
                    )}
                    {appGraphicsError && (
                      <p className="text-red-500 text-sm mt-2">
                        {appGraphicsError}
                      </p>
                    )}
                    {errors.coverGraphics && (
                      <p className="text-red-500 text-sm mt-2">{errors.coverGraphics}</p>
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
              Screenshots <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-10 pl-10 pr-10">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="w-full sm:w-1/3 relative">
                  {screenshots[index] ? (
                    <div className="w-full h-full">
                      {/* The label triggers the file input */}
                      <label
                        htmlFor={`screenshot-input-${index}`}
                        className="cursor-pointer w-full h-full"
                      >
                        <img
                          src={URL.createObjectURL(screenshots[index])}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg mr-5"
                        />
                        {/* Overlay: This sits above the image */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm z-10">
                          Tap to change
                        </div>
                      </label>
                      {/* Hidden file input triggered by the label */}
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        id={`screenshot-input-${index}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0]; // Null check
                          if (file) {
                            handleScreenshotUpload(index, file); // Assuming this function handles the upload
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <label
                      htmlFor={`screenshot-input-${index}`}
                      className={`cursor-pointer flex flex-col items-center justify-center h-full border-2 border-dashed ${errors.screenshots && index === 0 ? "border-red-500" : "border-gray-300"} p-6 text-center hover:bg-gray-100`}
                      style={{ height: "300px", width: "300px" }}
                    >
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        id={`screenshot-input-${index}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0]; // Null check
                          if (file) {
                            handleScreenshotUpload(index, file); // Assuming this function handles the upload
                          }
                        }}
                      />
                      <img
                        src="/upload_icon.svg"
                        alt="Upload Icon"
                        className="w-5 h-5 mb-2"
                      />
                      <span className="text-sm font-bold text-gray-700">
                        Add Screenshot {index + 1} {index === 0 && <span className="text-red-500">*</span>}
                      </span>
                      <p className="text-xs text-[#989090]">
                        Supports PNG, JPG formats, with a maximum file size of
                        1MB and dimensions of 640 x 640{" "}
                      </p>
                    </label>
                  )}
                </div>
              ))}
              {screenshotErorr && (
                <p className="text-red-500 text-sm mt-2">{screenshotErorr}</p>
              )}
              {errors.screenshots && (
                <p className="text-red-500 text-sm mt-2 ml-10">{errors.screenshots}</p>
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
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  // rows="4"
                  placeholder="Enter app description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`text-black w-full px-4 py-3 border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150`}
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags <span className="text-red-500">*</span>
                </label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  type="text"
                  placeholder="Enter tags"
                  className={`text-black w-full px-4 py-2 border ${errors.tags ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150`}
                />
                {errors.tags && (
                  <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
                )}
              </div>

              {/* Privacy Policy URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Privacy Policy URL <span className="text-red-500">*</span>
                </label>
                <input
                  value={privacyPolicyUrl}
                  onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
                  type="url"
                  placeholder="Enter privacy policy"
                  className={`text-black w-full px-4 py-2 border ${errors.privacyPolicyUrl ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150`}
                />
                {errors.privacyPolicyUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.privacyPolicyUrl}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Web Portal URL (Optional)
                </label>
                <input
                  value={webPortalUrl}
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
          className="text-white px-4 py-2 bg-customblue rounded-lg hover:bg-customblue disabled:opacity-50"
        >
          Previous
        </button>
        {activeStep < totalSteps ? (
          <button
            onClick={nextStep}
            className="px-4 py-2 bg-customblue text-white rounded-lg hover:bg-customblue disabled:opacity-50"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => handleSubmit()} // Wrap the async function in an arrow function
            className="px-4 py-2 bg-customblue text-white rounded-lg hover:bg-green-700"
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="spinner-border animate-spin w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full"></div>
              </div>
            ) : (
              "Submit"
            )}
            {/* Submit */}
          </button>
        )}
        <Modal
          title="You have successfully submitted your app"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="ok" onClick={handleOk}>
              Ok
            </Button>,
          ]}
        >
          <p>{errorMessage}</p>
        </Modal>{" "}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-60 bg-white shadow-md">
        <div className="flex items-center py-5">
          <img src="/logo_efdri.png" alt="Logo" className="h-14 ml-5" />
        </div>
        <ul className="space-y-3">
          <li>
            <a
              href="#"
              onClick={() => setCurrentView("overview")}
              className={`block py-2 px-5 ${
                currentView === "overview" ? "text-blue-600" : "text-gray-600"
              } font-medium`}
            >
              Overview
            </a>
          </li>
          <li>
            <a
              onClick={() => setCurrentView("Account Details")}
              href="#"
              className={`block py-2 px-5 ${
                currentView === "Account Details"
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Account Details
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`block py-2 px-5 ${
                currentView === "Settings" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Settings
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-end">
          <h1 className="text-xl text-gray-800" style={{ fontSize: "16px" }}>
            {userName}
          </h1>
          <button
            onClick={logoutclick}
            className="px-4 py-2 text-sm text-black rounded-md ml-4"
          >
            Log Out
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-6 py-6">
          {currentView === "overview"
            ? renderOverview()
            : currentView === "Account Details"
            ? AccountDetails()
            : renderSubmitApp()}
        </main>
      </div>
    </div>
  );
}
