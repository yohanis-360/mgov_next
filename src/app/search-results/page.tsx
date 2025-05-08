"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
}

// Create a client-side only component for the search functionality
function SearchResultsContent() {
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q");
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("android");
  const { t, getBackendValue } = useLanguage();

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

  // Show all apps without filtering by platform
  const filteredApps = apps;

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
    handleLogout(router);
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
      <header className="flex justify-between items-center px-4 md:px-6 py-4 bg-gray-100">
        <div className="flex items-center space-x-4">
          <Link href="/landing_page_user">
            <Image src="/logo_efdri.png" alt="Logo" width={40} height={40} />
          </Link>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('search_placeholder')}
              className="ml-0 md:ml-3 p-2 border border-gray-300 rounded-md text-sm text-black w-full md:w-[300px] lg:w-[500px]"
            />
          </form>
          <LanguageSelector />
          <button
            onClick={username ? logoutclick : () => router.push("/user/login")}
            className="text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white rounded-[50px]"
          >
            {username || t('login')}
          </button>
        </div>
      </header>

      <div className="mx-4 md:mx-10">
        <section className="px-3 md:px-6 py-4 md:py-8">
          <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-black">
            {t('search_results_for')} "{query}"
          </h1>
          
          {/* Platform Filter Buttons */}
          <section className="flex px-3 md:px-6 py-2 md:py-4 space-x-2 md:space-x-4 mb-4 md:mb-8">
            {/* Android Button */}
            <button
              style={{
                height: "30px",
              }}
              className={`${
                selectedPlatform === "android"
                  ? "bg-customblue text-white"
                  : "bg-white text-customblue border border-customblue"
              } px-4 md:px-8 py-1 rounded-[20px] hover:bg-customblue transition duration-300 flex items-center space-x-2 text-xs md:text-sm`}
              onClick={() => setSelectedPlatform("android")}
            >
              <Image
                src="/platform_icon.png"
                alt={t('android_icon')}
                width={16}
                height={16}
                className="w-4 h-4 md:w-5 md:h-5"
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
              } px-4 md:px-8 py-1 rounded-[20px] hover:bg-customblue transition duration-300 flex items-center space-x-2 text-xs md:text-sm`}
              onClick={() => setSelectedPlatform("IOS")}
            >
              <Image
                src="/platform_icon.png"
                alt={t('ios_icon')}
                width={16}
                height={16}
                className="w-4 h-4 md:w-5 md:h-5"
              />
              <span>{t('ios')}</span>
            </button>
          </section>

          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {filteredApps.map((app) => (
                <div
                  onClick={() => handleAppClick(app.id)}
                  key={app.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
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
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-10 h-10 md:w-12 md:h-12">
                        <Image
                          src={`http://127.0.0.1:8000${app.app_icon}`}
                          alt={`${app.app_name} ${t('icon')}`}
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 text-base md:text-lg text-gray-500 px-4 text-center">
              {t('no_results_found')} "{query}"
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}

// Main component with suspense boundary
export default function SearchResults() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>}>
      <SearchResultsContent />
    </Suspense>
  );
} 