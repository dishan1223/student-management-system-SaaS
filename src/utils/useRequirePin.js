'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'


export default function useRequirePin(){
    const router = useRouter()

    useEffect(() => {
        const pin = localStorage.getItem('userPin')

        if (!pin) {
            router.replace("/")
        }
    }, [router])
}
