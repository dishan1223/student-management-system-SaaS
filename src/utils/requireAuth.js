'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function useRequirePaid() {
  const router = useRouter()

  useEffect(() => {
    async function verifyUser() {
      try {
        const res = await fetch("/api/auth/planCheck", { cache: "no-store" })
        const data = await res.json()

        if (!data.success) {
          switch (data.reason) {
            case "notLoggedIn":
              router.push("/")
              break
            case "noPlan":
              router.push("/upgrade")
              break
            case "expired":
              router.push("/upgrade?status=expired")
              break
            default:
              router.push("/")
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err)
        router.push("/")
      }
    }

    verifyUser()
  }, [router])
}
