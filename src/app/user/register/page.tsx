"use client";

import PhoneInput from "react-phone-input-2";
import React, { useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { DatePicker, ConfigProvider } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";
import locale from "antd/locale/en_US";
import "antd/dist/reset.css";
type Errors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  mobile_number?: string;
  date_of_birth?: string;
};

export default function Register() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile_number, setMobile_number] = useState("");
  const [gender, setGender] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const { getRootProps, getInputProps } = useDropzone({
    maxSize: 10 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
    },
  });
  const [date_of_birth, setDate_of_birth] = useState<string | null>(null);

  const handleChange = (date: Dayjs | null, dateString: string | string[]) => {
    if (typeof dateString === "string") {
      console.log("Selected Date:", dateString);
      setDate_of_birth(dateString);
    }
  };
  const validateForm = () => {
    const newErrors: Errors = {};

    // Check for empty fields
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!username.trim()) newErrors.username = "Username is required";
    if (!mobile_number.trim())
      newErrors.mobile_number = "Phone number is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";

    // Password validation
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (password && !passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters long and include letters and numbers";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Date of Birth
    if (!date_of_birth) newErrors.date_of_birth = "Date of birth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  const handleSubmit = async (e: React.FormEvent) => {
    if (validateForm()) {
      console.log("true");
      e.preventDefault();
      setLoading(true);

      // Collect form data
      const userData = {
        firstName,
        lastName,
        email,
        username,
        password,
        mobile_number,
        gender: (
          document.querySelector(
            'input[name="gender"]:checked'
          ) as HTMLInputElement
        )?.value,
        date_of_birth,
      };
      try {
        console.log(userData);
        // Send data to backend (adjust API endpoint as needed)
        const response = await fetch("http://127.0.0.1:8000/users/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (response.status == 201) {
          // message.success("Your form has been submitted successfully!");
          // message.success("Sign up successful!");
          router.push("/user/login");
        } else {
          setErrorMessage(
            data.detail || data.message || "Sign up failed! Please try again."
          );
          setIsModalVisible(true); // Show modal with error message

          //     if (data?.detail) {
          //       message.error(
          //         data.detail || "Sign up failed! Please check your details."
          //       );
          //     } else if (data?.message) {
          //       message.error(
          //         data.message || "An unexpected error occurred. Please try again."
          //       );
          //     } else {
          //       message.error("Sign up failed! Please try again.");
          //     }
        }
      } finally {
        //    catch (error) {
        //     console.log(error);
        //     setErrorMessage("An error occurred. Please try again.");
        //     setIsModalVisible(true);
        //   }
        setLoading(false);
      }
    }
  };
  const handleOk = () => {
    setIsModalVisible(false); // Close the modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div
        className="flex-1 min-h-full bg-customblue pt-40"
        // style={{ backgroundColor: "customblue" }}
      >
        <img src="/logo.png" alt="Logo" />
      </div>
      <div className="sm:w-1/2 mt-2 pb-20 pl-20 pr-20 pt-20 rounded-tr-[40px] rounded-br-[40px] bg-white shadow-md flex flex-col items-center">
        <div className="mb-6 w-full">
          <div className="absolute top-5 right-5 flex items-center space-x-2">
            <img src="/mint.png" alt="Logo" className="w-15 h-10" />
            <span className="text-sm font-medium text-customblue">
              Government App Store
            </span>
          </div>
          <label className="text-2xl font-bold text-customblue pb-10">
            Sign up
          </label>
          <span className="block text-sm text-[#989090] pt-3">
            Sign up to enjoy the feature of gov app
          </span>
        </div>
        {/* Full Name */}
        <div className="mb-4 w-full">
          <label
            htmlFor="firstname"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
            id="firstname"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            required
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName}</p>
          )}
        </div>
        <div className="mb-4 w-full">
          <label
            htmlFor="lastname"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            type="text"
            id="lasttname"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            required
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}
        </div>
        {/* Email */}
        <div className="mb-4 w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>
        <div className="mb-4 w-full">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="username"
            id="username"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            required
          />
        </div>
        {/* Password */}
        <div className="mb-4 w-full">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        {/* Confirm Password */}
        <div className="mb-4 w-full">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            id="confirmPassword"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>
        {/* Phone Number */}
        <div className="mb-4 w-full">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <PhoneInput
            country={"et"} // Default country
            value={mobile_number} // Controlled value
            onChange={(value) => setMobile_number(value)} // Update state
            inputProps={{
              name: "phone",
              required: true,
              autoFocus: true,
              className:
                " pl-10 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black",
            }}
            containerClass="w-full mb-4"
          />
          {errors.mobile_number && (
            <p className="text-red-500 text-sm">{errors.mobile_number}</p>
          )}
        </div>
        {/* Gender */}
        <div className="mb-4 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sex
          </label>
          <div className="flex items-center pl-7 pt-2 pb-3">
            <div className="flex items-center mr-4">
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="male" className="ml-2 text-sm text-gray-700">
                Male
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="female" className="ml-2 text-sm text-gray-700">
                Female
              </label>
            </div>
          </div>
        </div>
        <div className="mb-4 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <ConfigProvider locale={locale}>
            <DatePicker
              onChange={handleChange}
              value={date_of_birth ? dayjs(date_of_birth) : null}
              format="YYYY-MM-DD"
              placeholder="Select your date of birth"
              style={{ width: "100%" }}
            />
            {/* {dateOfBirth && <p>Your selected date of birth: {dateOfBirth}</p>} */}
          </ConfigProvider>
          {errors.date_of_birth && (
            <p className="text-red-500 text-sm">{errors.date_of_birth}</p>
          )}
        </div>
        {/* ID Document */}
        {/* <div className="mb-4 w-full pb-5">
          <label
            htmlFor="fileUpload"
            className="block text-sm font-medium text-gray-700 pb-3"
          >
            Id Document
          </label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer hover:bg-gray-100"
          >
            <input {...getInputProps()} />
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
              Supports PDF and DOC file formats, with a maximum file size of
              10MB
            </p>
          </div>
        </div> */}
        <p className="text-red-500 text-sm">{errorMessage}</p>
        <button
          disabled={loading} // Disable button while loading
          onClick={handleSubmit}
          type="submit"
          className="w-full bg-customblue text-white py-3 px-10 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-customblue"
          style={{ borderRadius: "20px", marginTop: "10px" }}
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="spinner-border animate-spin w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full"></div>
            </div>
          ) : (
            "Sign In"
          )}{" "}
        </button>
        {/* <Modal
          title="Error"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Close
            </Button>,
          ]}
        >
          <p>{errorMessage}</p>
        </Modal>{" "} */}
        <div className="my-4 text-center text-gray-500">or</div>
        <button
          type="button"
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <img
            src="/google-icon.svg"
            alt="Google Icon"
            className="w-5 h-5 mr-2"
          />
          Sign up with Google
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
      {/* Image Section: 50% width */}
      {/* <div className="flex justify-center items-center w-[604.28px] h-[456px] p-4 bg-#086976">
        <img
          src="/phone_image.png"
          alt="GOV App Ethiopia"
          className="w-full h-full object-cover"
        />
      </div> */}
    </div>
  );
}
