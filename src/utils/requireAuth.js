'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import jwt from 'jsonwebtoken';

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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.plan !== "Pro" || decoded.plan !=="Basic" || decoded.plan !=="Enterprise") {
        router.push("/upgrade")
      }
    } catch (error) {
      router.push("/")
    }
  }, [router])
}