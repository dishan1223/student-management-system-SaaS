'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useCheckPlanExpiry() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/check"); // your auth endpoint
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        if (!data.loggedIn) {
          router.push("/sign-in"); // not logged in
          return;
        }

        setUser(data.user);

        // Check expiry
        if (data.user.planExpiry) {
          const now = new Date();
          const expiryDate = new Date(data.user.planExpiry);
          if (now > expiryDate) {
            router.push("/order"); // redirect to plan selection
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/sign-in"); // fallback redirect
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  return { user, loading };
}
