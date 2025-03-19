"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export interface AppData {
  id: number;
  app_name: string;
  category: string;
  web_portal: string;
  tags: string;
  status: string;
  app_icon: string;
  cover_graphics: string;
  supported_platforms: string;
  created_at: string;
}

export default function SearchResults() {
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q");
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("android");

  useEffect(() => {
    const user = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (user) {
      const parsedUser = JSON.parse(user);
      setUsername(parsedUser.username);
    }
  }, []);

  useEffect(() => {
    setSearchQuery(query || "");
  }, [query]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/apps/search/?query=${query}`
          );
          if (response.ok) {
            const data = await response.json();
            setApps(data);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      }
      setLoading(false);
    };

    fetchSearchResults();
  }, [query]);

  const filteredApps = apps.filter(app => 
    app.supported_platforms.toLowerCase().includes(selectedPlatform.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search-results?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const handleAppClick = async (id: number) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/apps/increment-view-count/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ appId: id }),
        }
      );
    } catch (error) {
      console.error("Error updating view count:", error);
    }
    router.push(`/landing_page_user/app_detail?id=${id}`);
  };

  const logoutclick = () => {
    router.push("/user/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-gray-100">
        <div className="flex items-center space-x-4">
        <Link href="/landing_page_user">
      <Image src="/logo_efdri.png" alt="Logo" width={40} height={40} />
    </Link>
            </div>

        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search apps"
              style={{ width: "500px" }}
              className="ml-3 p-2 border border-gray-300 rounded-md text-sm text-black"
            />
          </form>
          <button
            onClick={username ? logoutclick : () => router.push("/user/login")}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-[50px]"
          >
            {username || "Login"}
          </button>
        </div>
      </header>

      <div className="mx-10">
        <section className="px-6 py-8">
          <h1 className="text-2xl font-bold mb-6 text-black">
            Search Results for "{query}"
          </h1>
          
          {/* Platform Filter Buttons */}
          <section className="flex px-6 py-4 space-x-4 mb-8">
            {/* Android Button */}
            <button
              style={{
                height: "30px",
              }}
              className={`${
                selectedPlatform === "android"
                  ? "bg-customblue text-white"
                  : "bg-white text-customblue border border-customblue"
              } px-8 py-1 rounded-[20px] hover:bg-customblue transition duration-300 flex items-center space-x-2`}
              onClick={() => setSelectedPlatform("android")}
            >
              <Image
                src="/platform_icon.png"
                alt="Android Icon"
                width={20}
                height={20}
              />
              <span>Android</span>
            </button>

            {/* iOS Button */}
            <button
              style={{
                height: "30px",
              }}
              className={`${
                selectedPlatform === "IOS"
                  ? "bg-customblue text-white"
                  : "bg-white text-customblue border border-customblue"
              } px-8 py-1 rounded-[20px] hover:bg-customblue transition duration-300 flex items-center space-x-2`}
              onClick={() => setSelectedPlatform("IOS")}
            >
              <Image
                src="/platform_icon.png"
                alt="iOS Icon"
                width={20}
                height={20}
              />
              <span>iOS</span>
            </button>
          </section>

          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredApps.map((app) => (
                <div
                  onClick={() => handleAppClick(app.id)}
                  key={app.id}
                  className="max-w-md bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
                >
                  {/* Image section */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "40.25%",
                    }}
                  >
                    <Image
                      src={`http://127.0.0.1:8000${app.cover_graphics}`}
                      alt={app.app_name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>

                  {/* Content section */}
                  <div className="p-4">
                    {/* App Icon and Title */}
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12">
                        <Image
                          src={`http://127.0.0.1:8000${app.app_icon}`}
                          alt={`${app.app_name} Icon`}
                          width={48}
                          height={48}
                          className="rounded-md"
                        />
                      </div>
                      <div>
                        <h2
                          className="font-semibold text-gray-800"
                          style={{ fontSize: "15px" }}
                        >
                          {app.app_name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {app.category} · {app.tags}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 text-lg text-gray-500">
              No results found for "{query}"
            </div>
          )}
        </section>
      </div>

      <footer className="bg-gray-100 py-5 px-10">
        <div className="flex flex-wrap justify-between items-center mb-6">
          {/* Logo Section */}
          <div className="flex flex-col items-start">
            <p style={{ fontSize: "12px", color: "black" }}>
              Copyright © {new Date().getFullYear()} App Store. All rights
              reserved.
            </p>
            <div className="flex justify-center space-x-4 mt-2 text-black">
              <a style={{ fontSize: "12px" }} href="#" className="hover:text-blue-600">
                Facebook
              </a>
              <a style={{ fontSize: "12px" }} href="#" className="hover:text-blue-600">
                Twitter
              </a>
              <a style={{ fontSize: "12px" }} href="#" className="hover:text-blue-600">
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

            {/* Column 3 */}
            <div className="ml-20">
              <h4 className="font-bold mb-2">Company</h4>
              <ul>
                <li>
                  <a href="/landing_page_user/about_us" className="hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/landing_page_user/contact_us" className="hover:underline">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/landing_page_user/faq" className="hover:underline">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-4 text-black">
          <p style={{ fontSize: "12px" }}>
            Copyright © {new Date().getFullYear()} Gov App Ethiopia All rights
            reserved. | Privacy Policy | Copyright Policy | Terms |
          </p>
        </div>
      </footer>
    </div>
  );
} 