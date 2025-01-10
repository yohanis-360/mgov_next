"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible); // Toggle visibility state
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setUsernameError("");
    setPasswordError("");
    setErrorMessage("");

    if (!username) {
      setUsernameError("Username is required.");
    }
    if (!password) {
      setPasswordError("Password is required.");
    }

    if (!username || !password) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData?.detail || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      // Save tokens and user details to local storage
      if (data.user && data.access_token && data.refresh_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to the App Submission Overview page
        router.push("/developer_portal");
      } else {
        setIsLoading(false);
        setErrorMessage("Invalid user data.");
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("An error occurred during login. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="flex-1 bg-customblue pt-20 fixed top-0 left-0 w-1/2 h-full">
        <img src="/logo.png" alt="Logo" />
      </div>
      <div className="sm:w-1/2 ml-auto pb-20 pl-20 pr-20 pt-20 bg-white shadow-md flex flex-col items-center overflow-y-auto h-screen">
        <div className="mb-6 w-full">
          <div className="absolute top-5 right-5 flex items-center space-x-2">
            <img src="/mint.png" alt="Logo" className="w-15 h-10" />
            <span className="text-sm font-medium text-customblue">
              Government App Store
            </span>
          </div>
          <label className="text-2xl font-bold text-customblue pb-10">
            Sign In
          </label>
          <span className="block text-sm text-[#989090] pt-3">
            Sign in to access your account
          </span>
        </div>

        <form onSubmit={handleLogin} className="w-full">
          {/* Username */}
          <div className="mb-4 w-full">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && (
              <p className="text-red-500 text-xs mt-1">{usernameError}</p>
            )}
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
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>
          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between mb-4 w-full">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <a
              href="/forgot_password"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-customblue text-white py-3 px-10 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-customblue"
            style={{ borderRadius: "20px", marginTop: "10px" }}
            onClick={handleLogin}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="spinner-border animate-spin w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full"></div>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">or</div>

        {/* Sign in with Google */}
        <button
          type="button"
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <img
            src="/google-icon.svg"
            alt="Google Icon"
            className="w-5 h-5 mr-2"
          />
          Sign in with Google
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Need an account?{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            Create one
          </a>
        </p>
        <p className="mt-4 text-center text-sm text-gray-600">
          Login As User?{" "}
          <a href="/user/login" className="text-indigo-600 hover:underline">
            Create one
          </a>
        </p>
      </div>

      {/* Image Section */}
    </div>
  );
}