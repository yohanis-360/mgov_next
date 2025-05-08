"use client";
import { useDropzone } from "react-dropzone";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Form, Input, Button, notification, Radio, message, Modal } from "antd";
import { handleLogout, useRequireAuth } from "@/utils/auth";
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

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
  // Add authentication check (redirects to login if not authenticated)
  useRequireAuth("/login", "developer");
  const { t } = useLanguage();

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

  // Add state for password change form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeErrors, setPasswordChangeErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState("");

  // Add new state for password change modal
  const [isPasswordChangeModalVisible, setIsPasswordChangeModalVisible] = useState(false);

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
    handleLogout(router, "/login");
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-6">
        <div className="bg-white shadow rounded p-3 md:p-4 text-center flex flex-col md:flex-row items-center md:gap-4">
          <img
            src="/icon_approv.png"
            alt="Total Apps"
            className="h-8 w-8 md:h-10 md:w-10 md:mr-8 mb-2 md:mb-0"
          />
          <div>
            <p className="text-lg md:text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-xs md:text-sm text-[#667085]">ጠቅላላ መተግበሪያዎች</p>
          </div>
        </div>
        <div className="bg-white shadow rounded p-3 md:p-4 text-center flex flex-col md:flex-row items-center md:gap-4">
          <img
            src="/icon_approv.png"
            alt="Approved"
            className="h-8 w-8 md:h-10 md:w-10 md:mr-8 mb-2 md:mb-0"
          />
          <div>
            <p className="text-lg md:text-2xl font-bold text-green-600">
              {stats.approved}
            </p>
            <p className="text-xs md:text-sm text-[#667085]">ጸድቋል</p>
          </div>
        </div>
        <div className="bg-white shadow rounded p-3 md:p-4 text-center flex flex-col md:flex-row items-center md:gap-4">
          <img
            src="/icon_approv.png"
            alt="Rejected"
            className="h-8 w-8 md:h-10 md:w-10 md:mr-8 mb-2 md:mb-0"
          />
          <div>
            <p className="text-lg md:text-2xl font-bold text-red-600">{stats.rejected}</p>
            <p className="text-xs md:text-sm text-[#667085]">ተቀባይነት አላገኘም</p>
          </div>
        </div>
        <div className="bg-white shadow rounded p-3 md:p-4 text-center flex flex-col md:flex-row items-center md:gap-4">
          <img
            src="/icon_approv.png"
            alt="Pending"
            className="h-8 w-8 md:h-10 md:w-10 md:mr-8 mb-2 md:mb-0"
          />
          <div>
            <p className="text-lg md:text-2xl font-bold text-orange-500">
              {stats.pending}
            </p>
            <p className="text-xs md:text-sm text-[#667085]">በመጠበቅ ላይ</p>
          </div>
        </div>
      </div>

      {/* Submit New App Button */}
      <div className="flex justify-end items-center mb-4 md:mb-6">
        <button
          onClick={() => setCurrentView("submitApp")}
          className="px-3 md:px-4 py-1 md:py-2 bg-customblue text-white rounded-[15px] hover:bg-customblue text-sm md:text-base"
          style={{ width: "auto", minWidth: "150px", maxWidth: "200px" }}
        >
          {t('submit_new_app')}
        </button>
      </div>

      {/* App List */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-6 gap-2 md:gap-4 p-2 md:p-4 text-xs md:text-base min-w-[650px]">
          <div className="text-[#6E6363]">
            {t('app_name')}
          </div>
          <div className="text-[#6E6363]">
            {t('version')}
          </div>
          <div className="text-[#6E6363]">
            {t('category')}
          </div>
          <div className="text-[#6E6363]">
            {t('register_date')}
          </div>
          <div className="text-[#6E6363]">
            {t('status')}
          </div>
          <div className="text-[#6E6363]">
            {t('action')}
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
                className="grid grid-cols-6 gap-2 md:gap-4 mb-2 p-2 md:p-4 border-b bg-grey-100 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 text-customblue text-xs md:text-base min-w-[650px]"
              >
                <div className="truncate">{app.app_name}</div>
                <div className="truncate">{app.app_version}</div>
                <div className="truncate">{app.category}</div>
                <div className="truncate">{new Date(app.created_at).toLocaleDateString()}</div>
                <div className={`truncate ${getStatusClass(app.status)}`}>{app.status}</div>
                <div className="truncate">View</div>
              </div>
            ))
        ) : (
          <div className="text-center py-4">No apps available</div>
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
        <div className="bg-white px-4 md:px-10 py-6 md:py-10">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4 text-black">
            {t('account_organization_details')}
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              {/* Account Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 text-black">
                    {t('full_name')}
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 text-black text-xs md:text-sm"
                    defaultValue={
                      developerInfo.user.first_name +
                      " " +
                      developerInfo.user.last_name
                    }
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 text-black">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    className="w-full border rounded-md p-2 text-black text-xs md:text-sm"
                    defaultValue={developerInfo.user.email}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 text-black">
                    {t('phone_number')}
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 text-black text-xs md:text-sm"
                    defaultValue={developerInfo.user.mobile_number}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div>
              {/* Organization Details */}
              <h3 className="text-sm md:text-base font-medium mb-2 text-black border-t pt-4">
                {t('organization_information')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-black">
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 text-black">
                    {t('organization_name')}
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 text-xs md:text-sm"
                    defaultValue={developerInfo.organization_name}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 text-black">
                    {t('organization_address')}
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 text-xs md:text-sm"
                    defaultValue={developerInfo.organization_address}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 text-black">
                    {t('organization_website')}
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 text-xs md:text-sm"
                    defaultValue={developerInfo.organization_website}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 text-black">
                    {t('city')}
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 text-xs md:text-sm"
                    defaultValue={developerInfo.city}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 text-black">
                    {t('sub_city')}
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 text-xs md:text-sm"
                    defaultValue={developerInfo.sub_city}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 text-black">
                    {t('zone')}
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 text-xs md:text-sm"
                    defaultValue={developerInfo.zone}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 text-black">
                    {t('woreda')}
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 text-xs md:text-sm"
                    defaultValue={developerInfo.woreda}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  // Render the Submit App Form
  const renderSubmitApp = () => (
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
                {t('app_information')}
              </h2>
              <form className="space-y-4 md:space-y-5 px-2 md:px-10">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {t('app_name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="Enter app name"
                    className={`text-black w-full px-3 md:px-4 py-2 border ${errors.appName ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150 text-sm md:text-base`}
                  />
                  {errors.appName && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">{errors.appName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {t('app_version')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={appVersion}
                    onChange={(e) => setAppVersion(e.target.value)}
                    placeholder="Enter app version"
                    className={`text-black w-full px-3 md:px-4 py-2 border ${errors.appVersion ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150 text-sm md:text-base`}
                  />
                  {errors.appVersion && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">{errors.appVersion}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {t('category')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`text-black w-full px-3 md:px-4 py-2 border ${errors.category ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150 text-sm md:text-base`}
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
                    <p className="text-red-500 text-xs md:text-sm mt-1">{errors.category}</p>
                  )}
                </div>

                <div className="mt-4 pt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {t('supported_platforms')} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={isAndroidChecked}
                        onChange={(e) => setAndroidChecked(e.target.checked)}
                        className="mr-2 w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                      />
                      Android
                    </label>
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={isIOSChecked}
                        onChange={(e) => setIsIOSChecked(e.target.checked)}
                        className="mr-2 w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                      />
                      iOS
                    </label>
                  </div>
                  {errors.platforms && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">{errors.platforms}</p>
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
                        className={`text-black w-full px-3 md:px-4 py-2 border ${errors.iosUrl ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150 text-sm md:text-base`}
                      />
                      {errors.iosUrl && (
                        <p className="text-red-500 text-xs md:text-sm mt-1">{errors.iosUrl}</p>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}
          {activeStep === 2 && (
            <div>
              <h2 className="text-lg md:text-xl font-bold text-customblue mb-3 md:mb-4">
                {t('upload_files')}
              </h2>
              <form className="space-y-3 md:space-y-4 px-2 md:px-10">
                {/* App Icon Section */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {t('app_icon')} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-4 md:gap-10 pb-4 md:pb-7">
                    <div className="w-full sm:w-1/2 md:w-1/3 relative">
                      {appIcon ? (
                        <div className="w-full h-full">
                          <label
                            htmlFor="app-icon-input"
                            className="cursor-pointer w-full h-full"
                          >
                            <img
                              src={URL.createObjectURL(appIcon)}
                              alt="App Icon Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xs md:text-sm z-10">
                              Tap to change
                            </div>
                          </label>
                          <input
                            type="file"
                            accept="image/png, image/jpeg"
                            className="hidden"
                            id="app-icon-input"
                            onChange={handleAppIconUpload}
                          />
                        </div>
                      ) : (
                        <label
                          htmlFor="app-icon-input"
                          className={`cursor-pointer flex flex-col items-center justify-center h-32 md:h-40 w-full border-2 border-dashed ${errors.appIcon ? "border-red-500" : "border-gray-300"} p-4 md:p-6 text-center hover:bg-gray-100`}
                        >
                          <input
                            type="file"
                            accept="image/png, image/jpeg"
                            className="hidden"
                            id="app-icon-input"
                            onChange={handleAppIconUpload}
                          />
                          <img
                            src="/upload_icon.svg"
                            alt="Upload Icon"
                            className="w-4 h-4 md:w-5 md:h-5 mb-2"
                          />
                          <span className="text-xs md:text-sm font-bold text-gray-700">
                            Choose a file or drag and drop it here
                          </span>
                          <p className="text-xs text-[#989090] mt-1">
                            Supports PNG, JPG formats
                          </p>
                        </label>
                      )}
                    </div>
                  </div>
                  {appIconError && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">{appIconError}</p>
                  )}
                  {errors.appIcon && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">{errors.appIcon}</p>
                  )}
                </div>

                {/* APK File Section */}
                {isAndroidChecked && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        {t('apk_file')} <span className="text-red-500">*</span>
                      </label>
                      <div
                        onClick={handleDivClick}
                        className={`border-2 border-dashed ${errors.apkFile ? "border-red-500" : "border-gray-300"} p-4 md:p-6 text-center cursor-pointer hover:bg-gray-100 h-32 md:h-40`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".apk"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div className="flex items-center justify-center mb-2 space-x-2">
                          <img
                            src="/upload_icon.svg"
                            alt="Upload Icon"
                            className="w-4 h-4 md:w-5 md:h-5 mr-2 text-center"
                          />
                        </div>
                        <span className="text-xs md:text-sm font-bold text-gray-700">
                          Choose a file or drag and drop it here
                        </span>
                        <p className="text-xs text-[#989090] mt-1">
                          Supports APK file format, max 500MB
                        </p>
                      </div>

                      {apkFile && (
                        <div className="mt-3 md:mt-4">
                          <p className="text-xs md:text-sm font-medium text-gray-700">
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
                        <div className="mt-3 md:mt-4">
                          <p className="text-xs md:text-sm font-medium text-gray-700">
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
                        <p className="text-red-500 text-xs md:text-sm mt-1">{errors.apkFile}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Cover Graphics Section */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {t('cover_graphics')} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-4 md:gap-10 pb-4 md:pb-7">
                    <div className="w-full sm:w-1/2 md:w-1/3 relative">
                      {coverGraphics ? (
                        <div className="w-full h-full">
                          <label
                            htmlFor="cover-graphics-input"
                            className="cursor-pointer w-full h-full"
                          >
                            <img
                              src={URL.createObjectURL(coverGraphics)}
                              alt="Cover Graphics Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xs md:text-sm z-10">
                              Tap to change
                            </div>
                          </label>
                          <input
                            type="file"
                            accept="image/png, image/jpeg"
                            className="hidden"
                            id="cover-graphics-input"
                            onChange={handlecoverGraphicsUpload}
                          />
                        </div>
                      ) : (
                        <label
                          htmlFor="cover-graphics-input"
                          className={`cursor-pointer flex flex-col items-center justify-center h-32 md:h-40 w-full border-2 border-dashed ${errors.coverGraphics ? "border-red-500" : "border-gray-300"} p-4 md:p-6 text-center hover:bg-gray-100`}
                        >
                          <input
                            type="file"
                            accept="image/png, image/jpeg"
                            className="hidden"
                            id="cover-graphics-input"
                            onChange={handlecoverGraphicsUpload}
                          />
                          <img
                            src="/upload_icon.svg"
                            alt="Upload Icon"
                            className="w-4 h-4 md:w-5 md:h-5 mb-2"
                          />
                          <span className="text-xs md:text-sm font-bold text-gray-700">
                            Choose a file or drag and drop it here
                          </span>
                          <p className="text-xs text-[#989090] mt-1">
                            Supports PNG, JPG formats, max 1MB
                          </p>
                        </label>
                      )}
                    </div>
                  </div>
                  {appGraphicsError && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">{appGraphicsError}</p>
                  )}
                  {errors.coverGraphics && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">{errors.coverGraphics}</p>
                  )}
                </div>
              </form>
            </div>
          )}
          {activeStep === 3 && (
            <div>
              <h2 className="text-lg md:text-xl font-bold text-customblue mb-3 md:mb-4">
                {t('screenshots')} <span className="text-red-500">*</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-2 md:px-10">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="relative">
                    {screenshots[index] ? (
                      <div className="w-full h-full">
                        <label
                          htmlFor={`screenshot-input-${index}`}
                          className="cursor-pointer w-full h-full"
                        >
                          <img
                            src={URL.createObjectURL(screenshots[index])}
                            alt={`Screenshot ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xs md:text-sm z-10">
                            Tap to change
                          </div>
                        </label>
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          className="hidden"
                          id={`screenshot-input-${index}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleScreenshotUpload(index, file);
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <label
                        htmlFor={`screenshot-input-${index}`}
                        className={`cursor-pointer flex flex-col items-center justify-center h-32 md:h-40 w-full border-2 border-dashed ${errors.screenshots && index === 0 ? "border-red-500" : "border-gray-300"} p-4 md:p-6 text-center hover:bg-gray-100`}
                      >
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          className="hidden"
                          id={`screenshot-input-${index}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleScreenshotUpload(index, file);
                            }
                          }}
                        />
                        <img
                          src="/upload_icon.svg"
                          alt="Upload Icon"
                          className="w-4 h-4 md:w-5 md:h-5 mb-2"
                        />
                        <span className="text-xs md:text-sm font-bold text-gray-700">
                          {t('add_screenshot')} {index + 1} {index === 0 && <span className="text-red-500">*</span>}
                        </span>
                        <p className="text-xs text-[#989090] mt-1">
                          Supports PNG, JPG formats, max 1MB
                        </p>
                      </label>
                    )}
                  </div>
                ))}
                {screenshotErorr && (
                  <p className="text-red-500 text-xs md:text-sm mt-1 col-span-full">{screenshotErorr}</p>
                )}
                {errors.screenshots && (
                  <p className="text-red-500 text-xs md:text-sm mt-1 col-span-full">{errors.screenshots}</p>
                )}
              </div>
            </div>
          )}
          {activeStep === 4 && (
            <div className="mt-2">
              <h2 className="text-xl md:text-2xl font-semibold text-customblue mb-3 md:mb-4 px-2 md:px-0">
                {t('app_description')}
              </h2>
              <form className="space-y-3 md:space-y-4 px-2 md:px-10">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {t('description')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Enter app description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`text-black w-full px-3 md:px-4 py-2 md:py-3 border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150 text-sm md:text-base`}
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {t('tags')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    type="text"
                    placeholder="Enter tags"
                    className={`text-black w-full px-3 md:px-4 py-2 border ${errors.tags ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150 text-sm md:text-base`}
                  />
                  {errors.tags && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">{errors.tags}</p>
                  )}
                </div>

                {/* Privacy Policy URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    {t('privacy_policy_url')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={privacyPolicyUrl}
                    onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
                    type="url"
                    placeholder="Enter privacy policy"
                    className={`text-black w-full px-3 md:px-4 py-2 border ${errors.privacyPolicyUrl ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue transition ease-in-out duration-150 text-sm md:text-base`}
                  />
                  {errors.privacyPolicyUrl && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">{errors.privacyPolicyUrl}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('web_portal_url_optional')}
                  </label>
                  <input
                    value={webPortalUrl}
                    onChange={(e) => setWebPortalUrl(e.target.value)}
                    type="url"
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
            {t('previous')}
          </button>
          {activeStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="px-3 md:px-4 py-2 bg-customblue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm md:text-base"
            >
              {t('next')}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm md:text-base"
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="spinner-border animate-spin w-4 h-4 md:w-6 md:h-6 border-4 border-t-transparent border-blue-500 rounded-full"></div>
                </div>
              ) : (
                t('submit')
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  );

  // Add Settings component to render password change form
  const renderSettings = () => {
    const validatePasswordForm = () => {
      const newErrors = {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      };
      let isValid = true;

      if (!currentPassword) {
        newErrors.currentPassword = t('current_password_required');
        isValid = false;
      }

      if (!newPassword) {
        newErrors.newPassword = t('new_password_required');
        isValid = false;
      } else if (newPassword.length < 8) {
        newErrors.newPassword = t('password_min_length');
        isValid = false;
      }

      if (!confirmNewPassword) {
        newErrors.confirmNewPassword = t('confirm_password_required');
        isValid = false;
      } else if (newPassword !== confirmNewPassword) {
        newErrors.confirmNewPassword = t('passwords_dont_match');
        isValid = false;
      }

      setPasswordChangeErrors(newErrors);
      return isValid;
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validatePasswordForm()) {
        return;
      }

      setPasswordChangeLoading(true);
      setPasswordChangeSuccess("");

      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/users/change-developer-password/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
          }),
        });

        if (response.ok) {
          setPasswordChangeSuccess(t('password_changed_success'));
          setCurrentPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
          setIsPasswordChangeModalVisible(true); // Show the success modal
        } else {
          const data = await response.json();
          if (data.detail) {
            setPasswordChangeErrors({
              ...passwordChangeErrors,
              currentPassword: data.detail,
            });
          } else {
            setPasswordChangeErrors({
              ...passwordChangeErrors,
              currentPassword: t('password_change_failed'),
            });
          }
        }
      } catch (error) {
        console.error("Error changing password:", error);
        setPasswordChangeErrors({
          ...passwordChangeErrors,
          currentPassword: t('password_change_error'),
        });
      } finally {
        setPasswordChangeLoading(false);
      }
    };

    const handlePasswordChangeModalOk = () => {
      setIsPasswordChangeModalVisible(false);
      handleLogout(router, "/login");
    };

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white px-6 md:px-12 py-8 md:py-12 shadow-lg rounded-lg border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-customblue mb-8 border-b pb-4">{t('account_settings')}</h2>
          
          <div className="px-4 md:px-8">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">{t('change_password')}</h3>
            
            {passwordChangeSuccess && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {passwordChangeSuccess}
              </div>
            )}
            
            <form onSubmit={handlePasswordChange} className="space-y-6 md:space-y-8">
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  {t('current_password')}
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`text-black w-full px-4 py-3 border ${
                    passwordChangeErrors.currentPassword ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue text-sm md:text-base`}
                  placeholder={t('enter_current_password')}
                />
                {passwordChangeErrors.currentPassword && (
                  <p className="text-red-500 text-xs md:text-sm mt-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {passwordChangeErrors.currentPassword}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  {t('new_password')}
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`text-black w-full px-4 py-3 border ${
                    passwordChangeErrors.newPassword ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue text-sm md:text-base`}
                  placeholder={t('enter_new_password')}
                />
                {passwordChangeErrors.newPassword && (
                  <p className="text-red-500 text-xs md:text-sm mt-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {passwordChangeErrors.newPassword}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">{t('password_requirement_hint')}</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                  {t('confirm_new_password')}
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className={`text-black w-full px-4 py-3 border ${
                    passwordChangeErrors.confirmNewPassword ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-customblue focus:border-customblue text-sm md:text-base`}
                  placeholder={t('confirm_new_password_placeholder')}
                />
                {passwordChangeErrors.confirmNewPassword && (
                  <p className="text-red-500 text-xs md:text-sm mt-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {passwordChangeErrors.confirmNewPassword}
                  </p>
                )}
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-customblue text-white py-2.5 md:py-3.5 px-4 md:px-10 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-customblue text-sm md:text-base transition duration-150 ease-in-out"
                  style={{ borderRadius: "20px" }}
                  disabled={passwordChangeLoading}
                >
                  {passwordChangeLoading ? (
                    <div className="flex justify-center items-center">
                      <div className="spinner-border animate-spin w-4 h-4 md:w-6 md:h-6 border-4 border-t-transparent border-blue-500 rounded-full"></div>
                      <span className="ml-2">{t('processing')}</span>
                    </div>
                  ) : (
                    t('change_password')
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">{t('password_requirements')}:</h4>
              <ul className="text-xs text-gray-600 space-y-1 list-disc pl-5">
                <li>{t('min_eight_chars')}</li>
                <li>{t('include_uppercase')}</li>
                <li>{t('include_number')}</li>
                <li>{t('include_special_char')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Add Password Change Success Modal */}
        <Modal
          title={t('password_changed_title')}
          open={isPasswordChangeModalVisible}
          onOk={handlePasswordChangeModalOk}
          onCancel={handlePasswordChangeModalOk}
          footer={[
            <button
              key="ok"
              onClick={handlePasswordChangeModalOk}
              className="px-4 py-2 bg-customblue text-white rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-customblue"
            >
              {t('login_again')}
            </button>
          ]}
        >
          <div className="text-center py-4">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              {t('password_changed_success')}
            </p>
            <p className="text-sm text-gray-500">
              {t('password_changed_message')}
            </p>
          </div>
        </Modal>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-full md:w-60 bg-white shadow-md">
        <div className="flex items-center py-3 md:py-5 justify-center md:justify-start">
          <img src="/logo_efdri.png" alt="Logo" className="h-10 md:h-14 md:ml-5" />
        </div>
        <ul className="flex md:flex-col overflow-x-auto md:overflow-visible space-x-4 md:space-x-0 md:space-y-3 px-4 md:px-0 pb-4 md:pb-0">
          <li>
            <a
              href="#"
              onClick={() => setCurrentView("overview")}
              className={`block py-2 px-3 md:px-5 ${
                currentView === "overview" ? "text-blue-600" : "text-gray-600"
              } font-medium text-sm md:text-base whitespace-nowrap`}
            >
              {t('overview')}
            </a>
          </li>
          <li>
            <a
              onClick={() => setCurrentView("Account Details")}
              href="#"
              className={`block py-2 px-3 md:px-5 ${
                currentView === "Account Details"
                  ? "text-blue-600"
                  : "text-gray-600"
              } font-medium text-sm md:text-base whitespace-nowrap`}
            >
              {t('account_details')}
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => setCurrentView("Settings")}
              className={`block py-2 px-3 md:px-5 ${
                currentView === "Settings" ? "text-blue-600" : "text-gray-600"
              } font-medium text-sm md:text-base whitespace-nowrap`}
            >
              {t('settings')}
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm py-3 md:py-4 px-4 md:px-6 flex items-center justify-end">
          <div className="mr-4">
            <LanguageSelector />
          </div>
          <h1 className="text-sm md:text-base text-gray-800">
            {userName}
          </h1>
          <button
            onClick={logoutclick}
            className="px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm text-black rounded-md ml-2 md:ml-4"
          >
            {t('logout')}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 md:px-6 py-4 md:py-6 overflow-x-hidden">
          {currentView === "overview"
            ? renderOverview()
            : currentView === "Account Details"
            ? AccountDetails()
            : currentView === "Settings"
            ? renderSettings()
            : renderSubmitApp()}
        </main>
      </div>
    </div>
  );
}
