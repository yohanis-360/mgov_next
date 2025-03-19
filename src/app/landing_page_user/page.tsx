"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function Home() {
  const [apps, setApps] = useState<AppData[]>([]);
  const [platform, setPlatform] = useState<string>("android");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("Mobile Apps");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("android");
  const [username, setUsername] = useState<string | null>("");
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    {
      src: "/main_banner.png",
      caption: "Welcome to the Ethiopian Government App Store This is our best app developed by 360ground",
    },
    {
      src: "/banner_top.png",
      caption: "Explore Our Top-Rated Applications",
    },
    {
      src: "/banner_bot_1.png",
      caption: "Simplifying Governance with Technology",
    },
    {
      src: "/banner_bot_2.png",
      caption: "Empowering Citizens Through Apps",
    },
  ];
  const handleSearchClick = async () => {
    if (searchQuery.trim()) {
      router.push(`/search-results?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      console.log("Fetching all apps...");
      try {
        const response = await fetch("http://127.0.0.1:8000/apps/listing");
        if (response.ok) {
          const data = await response.json();
          setApps(data); // Reset app list to show all approved apps
        } else {
          console.error("Failed to fetch apps");
        }
      } catch (error) {
        console.error("Error fetching apps:", error);
      }
    }
  };
   const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Navigate to the previous image
  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const logoutclick = () => {
    router.push("/user/login");
  };
  const categories = [
    {
      name: "Education",
      icon: "/edu.png",
      icon_onclick: "/edu_white.png",
    },
    {
      name: "Finance",
      icon: "/finance.png",
      icon_onclick: "/finance_white.png",
    },
    { name: "Health", icon: "/health.png", icon_onclick: "/health_white.png" },
    {
      name: "Agriculture",
      icon: "/agri.png",
      icon_onclick: "/agriculture_white.png",
    },
    { name: "Trade", icon: "/trade.png", icon_onclick: "/trade_white.png" },
    {
      name: "Technology",
      icon: "/technology.png",
      icon_onclick: "/technology_white.png",
    },
    {
      name: "Social Affairs",
      icon: "/social.png",
      icon_onclick: "/social_white.png",
    },
    {
      name: "Justice",
      icon: "/justice.png",
      icon_onclick: "/justice_white.png",
    },
    {
      name: "Logistics",
      icon: "/logistic.png",
      icon_onclick: "/logistic_white.png",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1000); // 3-second interval
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);
  const handleAppClick = async (id: number) => {
    try {
      console.log(id);
      console.log(id);
      console.log(id);
      var response = await fetch(
        "http://127.0.0.1:8000/apps/increment-view-count/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ appId: id }),
        }
      );
      console.log(response.body);
    } catch (error) {
      console.error("Error updating view count:", error);
    }
    router.push(`/landing_page_user/app_detail?id=${id}`);
  };
  const user =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  useEffect(() => {
    console.log(user);
    if (user) {
      const parsedUser = JSON.parse(user);
      setUsername(parsedUser.username);
    }
    async function fetchApps() {
      try {
        // Construct the filter query parameters
        const queryParams = new URLSearchParams({
          query: searchQuery,
          category: selectedCategory,
          platform: selectedPlatform,
        });

        // Send request to the backend with the filters
        const response = await fetch(
          `http://127.0.0.1:8000/apps/search?${queryParams.toString()}`
        );
        if (response.ok) {
          const data = await response.json();
          setApps(data); // Set filtered apps data
        } else {
          console.error("Failed to fetch apps");
        }
      } catch (error) {
        console.error("Error fetching apps:", error);
      }
    }

    fetchApps();
  }, [selectedPlatform, selectedCategory, searchQuery]);

  //   const filteredApps = apps.filter(
  //     (app) =>
  //       app.supported_platforms.toLowerCase().includes(platform.toLowerCase()) &&
  //       app.category === selectedCategory &&
  //       app.app_name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by app name
  //   );

  const filteredApps = apps;
  const filteredWebApps = apps.filter((app) => {
    return (
      app.web_portal &&
      (selectedCategory === "All" || app.category === selectedCategory) &&
      app.app_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-gray-100">
        <div className="flex items-center space-x-4">
          <Image 
            src="/efdri.svg" 
            alt="Logo" 
            width={40} 
            height={30} 
            className="object-contain h-full"
          />

          <div className="flex flex-col pr-10">
            <h1 className="text-black" style={{fontSize: "16px", color:"#767676"}}>Government Appstore</h1>
            <h1 className="text-black" style={{fontSize: "12px", color:"#767676"}}>The official app store of FDRE</h1>
          </div>

          {/* Tabs */}
          <div className="flex justify-center ">
            <button
              className={`px-6 py-3 text-sm font-semibold ${
                activeTab === "Mobile Apps"
                  ? "text-customblue border-b-2 border-customblue font-bold"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("Mobile Apps")}
            >
              Mobile Apps
            </button>
            <button
              className={`px-6 py-3 text-sm font-semibold ${
                activeTab === "Web Portal"
                  ? "text-customblue border-b-2 border-customblue font-bold"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("Web Portal")}
            >
              Web Portal
            </button>
          </div>
          {/* <nav className="flex space-x-6 text-sm">
            <a
              href="#"
              className="text-gray-700  hover:text-blue-600"
              style={{
                fontWeight: "bold",
              }}
            >
              Mobile Apps
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600"
              style={{
                fontWeight: "bold",
              }}
            >
              Web Portal
            </a>
          </nav> */}
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchClick();
              }
            }}
            placeholder="Search apps"
            style={{ width: "500px" }}
            className="ml-3 p-2 border border-gray-300 rounded-md text-sm text-black"
          />
       
          <button
            onClick={username ? logoutclick : () => router.push("/user/login")}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-[50px]"
          >
            
            {username || "Login"}
          </button>
        </div>
      </header>

      <section className="w-full bg-white py-4 px-10">
      {/* Top Full-Width Image */}
      <div className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden rounded-2xl">
        {/* Current Image */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <Image
            src={images[currentIndex].src}
            alt={`Carousel Image ${currentIndex + 1}`}
            layout="fill"
            objectFit="cover"
            className="rounded-2xl"
            priority
          />
        </div>

        {/* Caption */}
        <div className="absolute bottom-8 left-8 bg-black/10 text-white p-4 rounded-lg">
          <h2 className="text-lg font-bold">{images[currentIndex].caption}</h2>
        </div>

        {/* Arrows for Navigation */}
        <div className="absolute inset-y-0 flex justify-between items-center w-full px-6">
          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="w-12 h-12 bg-white/80 shadow-lg rounded-full flex items-center justify-center hover:bg-white transition-all duration-300"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="w-12 h-12 bg-white/80 shadow-lg rounded-full flex items-center justify-center hover:bg-white transition-all duration-300"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>


      <div className="mx-10">
        {activeTab === "Mobile Apps" && (
          <>
            <section className="flex px-6 py-8 space-x-4">
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
                  src= {selectedPlatform === "android" ? "/android.svg" : "/android_nw.svg"}  
                  alt="Android Icon"
                  width={20}
                  height={20}
                  className={selectedPlatform === "android" ? "brightness-0 invert" : ""}
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
                  src= {selectedPlatform === "IOS" ? "/ios_new.svg" : "/ios.svg"} 
                  alt= "iOS Icon"
                  width={20}
                  height={20}
                  className={selectedPlatform === "IOS" ? "brightness-0 invert" : ""}
                />
                <span>iOS</span>
              </button>
            </section>
            <section className="flex px-6 space-x-4 flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className={`${
                    selectedCategory === category.name
                      ? "bg-customblue text-white"
                      : "bg-white text-customblue"
                  } flex flex-col items-center justify-center w-[100px] h-[100px] rounded-[8px] hover:bg-customblue transition duration-300`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {selectedCategory === category.name ? (
                    <Image
                      src={category.icon_onclick}
                      alt={`${category.name} Icon`}
                      width={25}
                      height={25}
                      className={`mb-3`}
                    />
                  ) : (
                    <Image
                      src={category.icon}
                      alt={`${category.name} Icon`}
                      width={25}
                      height={25}
                      className={`mb-5`}
                    />
                  )}
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </section>
            {filteredApps.length > 0 ? (
              <>
                <section className="px-6 py-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredApps.slice(0, 6).map((app) => (
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
                </section>

                {/* Additional apps section */}
                {filteredApps.length > 6 && (
                  <section className="px-6 py-8">
                    {/* <h2 className="text-gray-800 font-bold mb-4" style={{ fontSize: "18px" }}>
                      More Apps
                    </h2> */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {filteredApps.slice(6).map((app) => (
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
                  </section>
                )}
              </>
            ) : (
              <div className="flex justify-center items-center h-64 text-lg text-gray-500">
                {/* There is no app ... */}
              </div>
            )}
            {filteredApps.length > 0 ? (
              <section className="px-6 py-8">
                <h2
                  className="text-gray-800 font-bold mb-4"
                  style={{ fontSize: "18px" }}
                >
                  Latest Updates
                </h2>
                <div className="grid grid-cols-6 gap-4">
                  {filteredApps
                    .sort((a, b) => {
                      const dateA = new Date(a.created_at).getTime(); // Convert to timestamp
                      const dateB = new Date(b.created_at).getTime(); // Convert to timestamp
                      return dateB - dateA; // Sort descending
                    })
                    .slice(0, 6)
                    .map((app) => (
                      <div
                        onClick={() => handleAppClick(app.id)}
                        key={app.id}
                        className="p-4 rounded"
                      >
                        <div className="overflow-hidden rounded-lg shadow-lg mb-5">
                          <Image
                            src={`http://127.0.0.1:8000${app.cover_graphics}`} // Assuming cover_graphics is the relative URL
                            alt={app.app_name}
                            width={300} // Width for the image
                            height={200} // Height for the image to fit in the container
                            className="object-cover w-full h-full" // Ensures the image covers the container
                          />
                        </div>
                        <h3
                          className="font-semibold text-gray-800"
                          style={{ fontSize: "13px" }}
                        >
                          {app.app_name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {app.category} • {app.tags}
                        </p>
                      </div>
                    ))}
                </div>
              </section>
            ) : (
              <div className="flex justify-center items-center h-64 text-lg text-gray-500">
                There is no app...
              </div>
            )}
          </>
        )}
      </div>
      <div className="mx-10">
        {activeTab === "Web Portal" && (
          <>
            <section className="flex px-6 py-4 space-x-4 flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className={`${
                    selectedCategory === category.name
                      ? "bg-customblue text-white"
                      : "bg-white text-customblue"
                  } flex flex-col items-center justify-center w-[100px] h-[120px] rounded-[8px] hover:bg-customblue transition duration-300`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {selectedCategory === category.name ? (
                    <Image
                      src={category.icon_onclick}
                      alt={`${category.name} Icon`}
                      width={25}
                      height={25}
                      className={`mb-5`}
                    />
                  ) : (
                    <Image
                      src={category.icon}
                      alt={`${category.name} Icon`}
                      width={25}
                      height={25}
                      className={`mb-5`}
                    />
                  )}
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </section>
            <section className="px-6 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredWebApps.map((app) => (
                  <div
                    onClick={() => {
                      window.open(app.web_portal, "_blank");
                    }}
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
                        objectFit="contain" // Use "contain" if you want the entire image visible
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
                            {app.web_portal}
                          </h2>
                          {/* <p className="text-sm text-gray-500">
                          {app.category} · {app.tags}
                        </p> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            {filteredWebApps.length > 0 ? (
              <section className="px-6 py-8">
                <h2
                  className="text-gray-800 font-bold mb-4"
                  style={{ fontSize: "18px" }}
                >
                  Latest App
                </h2>
                <div className="grid grid-cols-6 gap-4">
                  {filteredWebApps
                    .sort((a, b) => {
                      const dateA = new Date(a.created_at).getTime(); // Convert to timestamp
                      const dateB = new Date(b.created_at).getTime(); // Convert to timestamp
                      return dateB - dateA; // Sort descending
                    })
                    .slice(0, 6)
                    .map((app) => (
                      <div
                        onClick={() => {
                          window.open(app.web_portal, "_blank");
                        }}
                        key={app.id}
                        className="p-4 rounded"
                      >
                        <div className="overflow-hidden rounded-lg shadow-lg mb-5">
                          <Image
                            src={`http://127.0.0.1:8000${app.cover_graphics}`} // Assuming cover_graphics is the relative URL
                            alt={app.app_name}
                            width={300} // Width for the image
                            height={200} // Height for the image to fit in the container
                            className="object-cover w-full h-full" // Ensures the image covers the container
                          />
                        </div>
                        <h3
                          className="font-semibold text-gray-800"
                          style={{ fontSize: "13px" }}
                        >
                          {app.web_portal}
                        </h3>
                      </div>
                    ))}
                </div>
              </section>
            ) : (
              <div className="flex justify-center items-center h-64 text-lg text-gray-500">
                There is no app...
              </div>
            )}
          </>
        )}
      </div>

      <footer className="bg-gray-100 py-5 px-10 ">
        <div className="flex flex-wrap justify-between items-center mb-6">
          {/* Logo Section */}
          <div className="flex flex-col items-start">
            {/* <img
                src="/logo_efdri.png"
                width={30}
                height={40}
                alt="Logo"
                className="h-12 mb-2"
              /> */}

            <p style={{ fontSize: "12px", color: "black" }}>
              Copyright © {new Date().getFullYear()} App Store. All rights
              reserved.
            </p>
            <div className="flex justify-center space-x-4 mt-2 text-black">
              <a
                style={{ fontSize: "12px" }}
                href="#"
                className="hover:text-blue-600"
              >
                Facebook
              </a>
              <a
                style={{ fontSize: "12px" }}
                href="#"
                className="hover:text-blue-600"
              >
                Twitter
              </a>
              <a
                style={{ fontSize: "12px" }}
                href="#"
                className="hover:text-blue-600"
              >
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

            {/* Column 2 */}

            {/* Column 3 */}
            <div className="ml-20">
              <h4 className="font-bold mb-2 ">Company</h4>
              <ul>
                <li>
                  <a
                    href="/landing_page_user/about_us"             
                    className="hover:underline"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                  href="/landing_page_user/contact_us"
                    className="hover:underline">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/landing_page_user/faq"             
                    className="hover:underline">
                        FAQ
                    </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-4  text-black">
          <p style={{ fontSize: "12px" }}>
            Copyright © {new Date().getFullYear()} Gov App Ethiopia All rights
            reserved. | Privacy Policy | Copyright Policy | Terms | 
          </p>
        </div>
      </footer>
    </div>

    // </footer> */}
    // );
    // </div>
  );
}
