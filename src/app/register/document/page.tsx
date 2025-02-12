"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  const [userData, setUserData] = useState(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure user data exists in localStorage
    if (!userData) {
      alert("User registration data not found.");
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
        alert("Registration successful");
        router.push("/login");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div
        className="flex-1 min-h-full bg-customblue pt-10"
        // style={{ backgroundColor: "customblue" }}
      >
         <p className="text-lg mr-40 mt-5 ml-10">Government App Store
         Developer Account Registration</p> 
        <img src="/logo.png" alt="Logo" />
      </div>

      <div className="sm:w-1/2 mt-2 pb-20 pl-20 pr-20 pt-20 rounded-tr-[40px] rounded-br-[40px] bg-white shadow-md flex flex-col items-center">
        <div className="absolute top-5 right-5 flex items-center space-x-2">
          <img src="/mint.png" alt="Logo" className="w-15 h-10" />
          <span className="text-sm font-medium text-customblue">
            Government App Store
          </span>
        </div>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="text-2xl font-bold text-customblue pb-10">
              Organization Info
            </label>
            <span className="block text-sm text-[#989090] pt-3">
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
            <div key={field.name} className="mb-4 w-full">
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
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
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
              <div className="text-xs text-gray-500 text-right">
                {formData[field.name as keyof typeof formData].length}/80
              </div>
            </div>
          ))}

          {<p className="text-red-500 text-sm mb-4"></p>}

          <div className="flex mt-6 justify-between w-full">
            <button
              type="submit"
              // disabled={loading}
              className={`bg-customblue text-white py-3 px-10 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-customblue 
                // loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {"Submit..."}
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-700 py-3 px-10 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
