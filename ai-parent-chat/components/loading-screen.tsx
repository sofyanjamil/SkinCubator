"use client"

import { useEffect, useState } from "react"
import { Heart, MessageCircle } from "lucide-react"

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(0)

  const messages = [
    "Preparing your gentle space...",
    "Setting up your AI companion...",
    "Ready for your bonding journey...",
  ]

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length)
    }, 1000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#F7F9FC] to-[#E8F4F8] flex items-center justify-center z-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#A8D5BA] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-[#6282E3] rounded-full opacity-15 animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-[#F7A07C] rounded-full opacity-10 animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <Heart className="w-12 h-12 text-[#F7A07C] animate-pulse" />
          <span className="text-4xl font-bold text-[#1B2250]">SkinCubator</span>
        </div>

        {/* Loading Message */}
        <p className="text-xl text-[#333333] mb-8 h-8 transition-opacity duration-500">{messages[currentMessage]}</p>

        {/* Progress Bar */}
        <div className="w-80 h-2 bg-white/50 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-[#6282E3] to-[#A8D5BA] rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Floating Icon */}
        <MessageCircle className="w-8 h-8 text-[#6282E3] mx-auto animate-bounce" />
      </div>
    </div>
  )
}
