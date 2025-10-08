'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import jwt_decode from 'jwt-decode';

export default function useRequirePaid(){
  const router = useRouter();

  useEffect(()=>{
    const token = document.cookie
    .split('; ')
    .find(row => row.startsWith("token="))
    ?.split("=")[1];

    if(!token){
      router.push("/")
      return
    }

    try {
      const decoded = jwt_decode(token);
      if (decoded.plan !== "Paid") {
        router.push("/upgrade")
      }
    } catch (error) {
      router.push("/")
    }
  }, [router])
}