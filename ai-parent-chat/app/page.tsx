"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/landing")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F7F9FC" }}>
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-[#6282E3] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#1B2250]">Loading SkinCubator...</p>
      </div>
    </div>
  )
}
