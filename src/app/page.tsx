"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login"); // Redirect to the login page
  }, [router]);

  return null; // No UI is needed as it's just a redirect
}
