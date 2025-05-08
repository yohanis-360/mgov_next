"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RegistrationSuccess from "../../components/RegistrationSuccess";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    organizationName: "",
    organizationAddress: "",
    organizationWebsite: "",
    city: "",
    woreda: "",
    zone: "",
    subCity: "",
    businessRegistrationNumber: "",
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [userData, setUserData] = useState(null);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Retrieve the stored registration data from localStorage
    const registrationData = localStorage.getItem("registrationData");
    if (registrationData) {
      setUserData(JSON.parse(registrationData)); // Set the user data from localStorage
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
    if (e.target.checked) {
      setTermsError("");
    }
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalVisible(false);
    router.push("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if terms and conditions are accepted
    if (!termsAccepted) {
      setTermsError("You must accept the terms and conditions to continue");
      setIsLoading(false);
      return;
    }

    // Ensure user data exists in localStorage
    if (!userData) {
      alert("User registration data not found.");
      setIsLoading(false);
      return;
    }

    // Combine user data from localStorage with the organization data from the form
    const combinedData = {
      ...(userData as { [key: string]: any }),
      userid: formData.businessRegistrationNumber,
      organization_name: formData.organizationName,
      username: formData.username,
      organization_address: formData.organizationAddress,
      organization_website: formData.organizationWebsite,
      city: formData.city,
      woreda: formData.woreda,
      zone: formData.zone,
      sub_city: formData.subCity,
      business_registration_number: formData.businessRegistrationNumber,
      terms_accepted: termsAccepted,
    };

    // Send the combined data to your backend API
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/users/developer/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(combinedData),
        }
      );

      if (response.status == 201) {
        const result = await response.json();
        // Show success modal instead of alert
        setIsSuccessModalVisible(true);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row bg-white">
        <div
          className="w-full md:w-1/2 py-6 md:min-h-full bg-customblue"
        >
           <p className="text-lg md:text-xl font-bold mt-5 md:mt-10 px-4 md:ml-10 text-white text-center md:text-left">Government App Store<br />Developer Account Registration</p> 
          <img src="/logo.png" alt="Logo" className="w-full max-w-xs mx-auto mt-6 md:mt-10" />
        </div>

        <div className="w-full md:w-1/2 px-6 py-8 md:mt-2 md:py-10 md:px-20 bg-white shadow-md flex flex-col items-center">
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
          <form className="w-full mt-10 md:mt-4" onSubmit={handleSubmit}>
            <div className="mb-4 md:mb-6">
              <label className="text-xl md:text-2xl font-bold text-customblue pb-6 md:pb-10 block">
                Organization Info
              </label>
              <span className="block text-xs md:text-sm text-[#989090] pt-2 md:pt-3">
                Provide your organization's details to complete registration
              </span>
            </div>

            {[
              { name: "username", label: "User Name" },
              { name: "organizationName", label: "Organization Name" },
              { name: "organizationAddress", label: "Organization Address" },
              { name: "organizationWebsite", label: "Organization Website" },
              { name: "city", label: "City" },
              { name: "woreda", label: "Woreda" },
              { name: "zone", label: "Zone" },
              { name: "subCity", label: "Sub City" },
              {
                name: "businessRegistrationNumber",
                label: "Business Registration Number",
              },
            ].map((field) => (
              <div key={field.name} className="mb-3 md:mb-4 w-full">
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}
                </label>
                <input
                  type="text"
                  id={field.name}
                  name={field.name}
                  maxLength={80}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black text-sm md:text-base"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
                <div className="text-xs text-gray-500 text-right">
                  {formData[field.name as keyof typeof formData].length}/80
                </div>
              </div>
            ))}

            {/* Terms and Conditions Checkbox */}
            <div className="mb-6 w-full">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={handleCheckboxChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I agree to the 
                    <a href="#" className="text-customblue hover:text-blue-800 ml-1 inline-flex items-center" onClick={(e) => {e.preventDefault(); alert("Terms and Privacy Policy document would open here.")}}>
                      Terms and Conditions
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                      </svg>
                    </a>
                  </label>
                  <p className="text-gray-500">I understand that by submitting this form, I consent to the collection and use of information as per the privacy policy.</p>
                </div>
              </div>
              {termsError && <p className="mt-2 text-sm text-red-600">{termsError}</p>}
            </div>

            <div className="flex flex-col md:flex-row mt-4 md:mt-6 justify-between w-full space-y-3 md:space-y-0 md:space-x-4">
              <button
                type="submit"
                className="w-full bg-customblue text-white py-2 md:py-3 px-4 md:px-10 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-customblue text-sm md:text-base"
                style={{ borderRadius: "20px", marginTop: "10px" }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <div className="spinner-border animate-spin w-4 h-4 md:w-6 md:h-6 border-4 border-t-transparent border-blue-500 rounded-full"></div>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-700 py-2 md:py-3 px-6 md:px-10 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 w-full md:w-auto text-sm md:text-base flex items-center justify-center"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Success modal */}
      <RegistrationSuccess 
        isOpen={isSuccessModalVisible}
        userType="developer"
        onClose={handleSuccessModalClose}
      />
    </>
  );
}
