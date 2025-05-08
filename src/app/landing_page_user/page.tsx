"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogout } from "@/utils/auth";
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import Footer from '@/components/Footer';

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
  view_count: number;
}

export default function Home() {
  const { t, getBackendValue } = useLanguage();
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

  // Map of category display names to backend values
  const categoryMap = {
    [t('education')]: 'Education',
    [t('finance')]: 'Finance',
    [t('health')]: 'Health',
    [t('agriculture')]: 'Agriculture',
    [t('trade')]: 'Trade',
    [t('technology')]: 'Technology',
    [t('social')]: 'Social Affairs',
    [t('justice')]: 'Justice',
    [t('logistics')]: 'Logistics'
  };

  const images = [
    {
      src: "/main_banner.png",
      caption: t('welcome_banner'),
    },
    {
      src: "/banner_top.png",
      caption: t('explore_apps'),
    },
    {
      src: "/banner_bot_1.png",
      caption: t('simplifying_governance'),
    },
    {
      src: "/banner_bot_2.png",
      caption: t('empowering_citizens'),
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
          setApps(data);
        } else {
          console.error("Failed to fetch apps");
        }
      } catch (error) {
        console.error("Error fetching apps:", error);
      }
    }
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // 3-second interval
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    const user = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (user) {
      const parsedUser = JSON.parse(user);
      setUsername(parsedUser.username);
    }
    async function fetchApps() {
      try {
        // Get the backend category value
        const backendCategory = selectedCategory === "All" ? "All" : categoryMap[selectedCategory];
        
        // Construct the filter query parameters
        const queryParams = new URLSearchParams({
          query: searchQuery,
          category: backendCategory,
          platform: selectedPlatform,
        });

        // Send request to the backend with the filters
        const response = await fetch(
          `http://127.0.0.1:8000/apps/search?${queryParams.toString()}`
        );
        if (response.ok) {
          const data = await response.json();
          setApps(data);
        } else {
          console.error("Failed to fetch apps");
        }
      } catch (error) {
        console.error("Error fetching apps:", error);
      }
    }

    fetchApps();
  }, [selectedPlatform, selectedCategory, searchQuery]);

  const categories = [
    {
      name: t('education'),
      icon: "/edu.png",
      icon_onclick: "/edu_white.png",
    },
    {
      name: t('finance'),
      icon: "/finance.png",
      icon_onclick: "/finance_white.png",
    },
    { 
      name: t('health'), 
      icon: "/health.png", 
      icon_onclick: "/health_white.png" 
    },
    {
      name: t('agriculture'),
      icon: "/agri.png",
      icon_onclick: "/agriculture_white.png",
    },
    { 
      name: t('trade'), 
      icon: "/trade.png", 
      icon_onclick: "/trade_white.png" 
    },
    {
      name: t('technology'),
      icon: "/technology.png",
      icon_onclick: "/technology_white.png",
    },
    {
      name: t('social'),
      icon: "/social.png",
      icon_onclick: "/social_white.png",
    },
    {
      name: t('justice'),
      icon: "/justice.png",
      icon_onclick: "/justice_white.png",
    },
    {
      name: t('logistics'),
      icon: "/logistic.png",
      icon_onclick: "/logistic_white.png",
    },
  ];

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
    handleLogout(router);
  };

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
      {/* Header - Made responsive */}
      <header className="flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-4 bg-gray-100 gap-4">
        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center space-x-4">
            <Image 
              src="/efdri.svg" 
              alt="Logo" 
              width={40} 
              height={30} 
              className="object-contain h-full"
            />

            <div className="flex flex-col pr-2 md:pr-10">
              <h1 className="text-black" style={{fontSize: "16px", color:"#767676"}}>{t('government_appstore')}</h1>
              <h1 className="text-black" style={{fontSize: "12px", color:"#767676"}}>{t('official_appstore_fdre')}</h1>
            </div>
          </div>

          {/* Mobile login button */}
          <button
            onClick={username ? logoutclick : () => router.push("/user/login")}
            className="md:hidden text-sm px-4 py-2 bg-blue-600 text-white rounded-[50px]"
          >
            {username || "Login"}
          </button>
        </div>

        {/* Tabs - Responsive design */}
        <div className="flex justify-center w-full md:w-auto">
          <button
            className={`px-4 md:px-6 py-3 text-sm font-semibold ${
              activeTab === "Mobile Apps"
                ? "text-customblue border-b-2 border-customblue font-bold"
                : "text-gray-500"
            } cursor-pointer`}
            onClick={() => setActiveTab("Mobile Apps")}
          >
            {t('mobile_apps')}
          </button>
          <button
            className={`px-4 md:px-6 py-3 text-sm font-semibold ${
              activeTab === "Web Portal"
                ? "text-customblue border-b-2 border-customblue font-bold"
                : "text-gray-500"
            } cursor-pointer`}
            onClick={() => setActiveTab("Web Portal")}
          >
            {t('web_portal')}
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchClick();
              }
            }}
            placeholder={t('search_apps')}
            className="w-full md:w-[300px] lg:w-[500px] p-2 border border-gray-300 rounded-md text-sm text-black cursor-text"
          />
       
          {/* Desktop login button and language selector - hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <button
              onClick={username ? logoutclick : () => router.push("/user/login")}
              className="text-sm px-4 py-2 bg-blue-600 text-white rounded-[50px] cursor-pointer hover:bg-blue-700 transition-colors duration-300"
            >
              {username || "Login"}
            </button>
          </div>
        </div>
      </header>

      <section className="w-full bg-white py-4 px-4 md:px-10">
      {/* Top Full-Width Image - Made responsive */}
      <div className="relative w-full h-[30vh] md:h-[40vh] lg:h-[60vh] overflow-hidden rounded-2xl">
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

        {/* Caption - Made responsive */}
        <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 bg-black/10 text-white p-2 md:p-4 rounded-lg max-w-[90%] md:max-w-[60%]">
          <h2 className="text-sm md:text-lg font-bold">{images[currentIndex].caption}</h2>
        </div>

        {/* Arrows for Navigation - Made responsive */}
        <div className="absolute inset-y-0 flex justify-between items-center w-full px-2 md:px-6">
          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="w-8 h-8 md:w-12 md:h-12 bg-white/80 shadow-lg rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 cursor-pointer"
          >
            <svg
              className="w-4 h-4 md:w-6 md:h-6 text-gray-800"
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
            className="w-8 h-8 md:w-12 md:h-12 bg-white/80 shadow-lg rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 cursor-pointer"
          >
            <svg
              className="w-4 h-4 md:w-6 md:h-6 text-gray-800"
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


      <div className="mx-2 md:mx-6 lg:mx-10">
        {activeTab === "Mobile Apps" && (
          <>
            <section className="flex px-2 md:px-6 py-4 md:py-8 space-x-2 md:space-x-4">
              {/* Android Button */}
              <button
                style={{
                  height: "30px",
                }}
                className={`${
                  selectedPlatform === "android"
                    ? "bg-customblue text-white"
                    : "bg-white text-customblue border border-customblue"
                } px-4 md:px-8 py-1 rounded-[20px] hover:bg-customblue transition duration-300 flex items-center space-x-2 text-xs md:text-sm cursor-pointer`}
                onClick={() => setSelectedPlatform("android")}
              >
                <Image
                  src={selectedPlatform === "android" ? "/android.svg" : "/android_nw.svg"}  
                  alt={t('android_icon')}
                  width={16}
                  height={16}
                  className={selectedPlatform === "android" ? "brightness-0 invert" : ""}
                />
                <span>{t('android')}</span>
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
                } px-4 md:px-8 py-1 rounded-[20px] hover:bg-customblue transition duration-300 flex items-center space-x-2 text-xs md:text-sm cursor-pointer`}
                onClick={() => setSelectedPlatform("IOS")}
              >
                <Image
                  src={selectedPlatform === "IOS" ? "/ios_new.svg" : "/ios.svg"} 
                  alt={t('ios_icon')}
                  width={16}
                  height={16}
                  className={selectedPlatform === "IOS" ? "brightness-0 invert" : ""}
                />
                <span>{t('ios')}</span>
              </button>
            </section>
            <section className="flex px-2 md:px-6 space-x-1 md:space-x-4 flex-wrap gap-1 md:gap-2 justify-center md:justify-start">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className={`${
                    selectedCategory === category.name
                      ? "bg-customblue text-white"
                      : "bg-white text-customblue"
                  } flex flex-col items-center justify-center w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-[8px] hover:bg-customblue transition duration-300 cursor-pointer`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {selectedCategory === category.name ? (
                    <Image
                      src={category.icon_onclick}
                      alt={`${category.name} Icon`}
                      width={20}
                      height={20}
                      className={`mb-2 md:mb-3`}
                    />
                  ) : (
                    <Image
                      src={category.icon}
                      alt={`${category.name} Icon`}
                      width={20}
                      height={20}
                      className={`mb-2 md:mb-5`}
                    />
                  )}
                  <span className="text-xs md:text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </section>
            {filteredApps.length > 0 ? (
              <>
                <section className="px-2 md:px-6 py-4 md:py-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {filteredApps
                      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                      .slice(0, 6)
                      .map((app) => (
                        <div
                          onClick={() => handleAppClick(app.id)}
                          key={app.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow duration-300"
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
                          <div className="p-3 md:p-4">
                            {/* App Icon and Title */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3 md:space-x-4">
                                <div className="w-10 h-10 md:w-12 md:h-12">
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
                                    style={{ fontSize: "14px" }}
                                  >
                                    {app.app_name}
                                  </h2>
                                  <p className="text-xs md:text-sm text-gray-500">
                                    {app.category} · {app.tags}
                                  </p>
                                </div>
                              </div>
                              <p className="text-xs md:text-sm text-gray-500">
                                {app.view_count || 0} downloads
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </section>

                {/* Additional apps section */}
                {filteredApps.length > 6 && (
                  <section className="px-2 md:px-6 py-4 md:py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                      {filteredApps
                        .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                        .slice(6)
                        .map((app) => (
                          <div
                            onClick={() => handleAppClick(app.id)}
                            key={app.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow duration-300"
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
                            <div className="p-3 md:p-4">
                              {/* App Icon and Title */}
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3 md:space-x-4">
                                  <div className="w-10 h-10 md:w-12 md:h-12">
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
                                      style={{ fontSize: "14px" }}
                                    >
                                      {app.app_name}
                                    </h2>
                                    <p className="text-xs md:text-sm text-gray-500">
                                      {app.category} · {app.tags}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-xs md:text-sm text-gray-500">
                                  {app.view_count || 0} downloads
                                </p>
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
              <section className="px-2 md:px-6 py-4 md:py-8">
                <h2
                  className="text-gray-800 font-bold mb-4"
                  style={{ fontSize: "16px" }}
                >
                  {t('latest_updates')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                  {filteredApps
                    .sort((a, b) => {
                      const dateA = new Date(a.created_at).getTime();
                      const dateB = new Date(b.created_at).getTime();
                      return dateB - dateA;
                    })
                    .slice(0, 6)
                    .map((app) => (
                      <div
                        onClick={() => handleAppClick(app.id)}
                        key={app.id}
                        className="p-2 md:p-4 rounded cursor-pointer hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="overflow-hidden rounded-lg shadow-lg mb-2 md:mb-5">
                          <Image
                            src={`http://127.0.0.1:8000${app.cover_graphics}`}
                            alt={app.app_name}
                            width={300}
                            height={200}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <h3
                          className="font-semibold text-gray-800"
                          style={{ fontSize: "12px" }}
                        >
                          {app.app_name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {app.category} • {app.tags}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {app.view_count || 0} {t('downloads')}
                        </p>
                      </div>
                    ))}
                </div>
              </section>
            ) : (
              <div className="flex justify-center items-center h-64 text-lg text-gray-500">
                {t('no_apps_found')}
              </div>
            )}
          </>
        )}
      </div>
      <div className="mx-2 md:mx-6 lg:mx-10">
        {activeTab === "Web Portal" && (
          <>
            <section className="flex px-2 md:px-6 py-4 md:py-4 space-x-1 md:space-x-4 flex-wrap gap-1 md:gap-4 justify-center md:justify-start">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className={`${
                    selectedCategory === category.name
                      ? "bg-customblue text-white"
                      : "bg-white text-customblue"
                  } flex flex-col items-center justify-center w-[80px] h-[80px] md:w-[100px] md:h-[120px] rounded-[8px] hover:bg-customblue transition duration-300 cursor-pointer`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {selectedCategory === category.name ? (
                    <Image
                      src={category.icon_onclick}
                      alt={`${category.name} Icon`}
                      width={20}
                      height={20}
                      className={`mb-2 md:mb-5`}
                    />
                  ) : (
                    <Image
                      src={category.icon}
                      alt={`${category.name} Icon`}
                      width={20}
                      height={20}
                      className={`mb-2 md:mb-5`}
                    />
                  )}
                  <span className="text-xs md:text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </section>
            <section className="px-2 md:px-6 py-4 md:py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {filteredWebApps
                  .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                  .map((app) => (
                    <div
                      onClick={() => {
                        window.open(app.web_portal, "_blank");
                      }}
                      key={app.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow duration-300"
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
                      <div className="p-3 md:p-4">
                        {/* App Icon and Title */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3 md:space-x-4">
                            <div className="w-10 h-10 md:w-12 md:h-12">
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
                                style={{ fontSize: "14px" }}
                              >
                                {app.web_portal}
                              </h2>
                              <p className="text-xs md:text-sm text-gray-500">
                                {app.category} · {app.tags}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs md:text-sm text-gray-500">
                            {app.view_count || 0} downloads
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
            {filteredWebApps.length > 0 ? (
              <section className="px-2 md:px-6 py-4 md:py-8">
                <h2
                  className="text-gray-800 font-bold mb-4"
                  style={{ fontSize: "16px" }}
                >
                  {t('latest_app')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                  {filteredWebApps
                    .sort((a, b) => {
                      const dateA = new Date(a.created_at).getTime(); // Convert to timestamp
                      const dateB = new Date(b.created_at).getTime(); // Convert to timestamp
                      return dateB - dateA; // Sort descending by date
                    })
                    .slice(0, 6)
                    .map((app) => (
                      <div
                        onClick={() => {
                          window.open(app.web_portal, "_blank");
                        }}
                        key={app.id}
                        className="p-2 md:p-4 rounded"
                      >
                        <div className="overflow-hidden rounded-lg shadow-lg mb-2 md:mb-5">
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
                          style={{ fontSize: "12px" }}
                        >
                          {app.web_portal}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500">
                          {app.category} · {app.tags}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500 mt-1">
                          {app.view_count || 0} downloads
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

      <Footer />
    </div>
  );
}
