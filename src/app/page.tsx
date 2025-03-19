"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/landing_page_user");
  }, [router]);

  return null; // No UI is needed as it's just a redirect
}
