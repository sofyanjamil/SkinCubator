"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MessageCircle, Shield, Moon, Sun, Pause, Play } from "lucide-react"
import LoadingScreen from "@/components/loading-screen"

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isAnimationPaused, setIsAnimationPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const navigateToChat = () => {
    setIsLoading(true)
  }

  const handleLoadingComplete = () => {
    router.push("/chat")
  }

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark bg-[#1B2250]" : "bg-gradient-to-br from-[#F7F9FC] to-[#E8F4F8]"}`}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 ${isAnimationPaused ? "" : "animate-pulse"}`}>
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#A8D5BA] rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-[#6282E3] rounded-full opacity-15 animate-float-delayed"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-[#F7A07C] rounded-full opacity-10 animate-float-slow"></div>
          <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-[#A8D5BA] rounded-full opacity-20 animate-float"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <Heart className="w-8 h-8 text-[#F7A07C]" />
          <span className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-[#1B2250]"}`}>SkinCubator</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAnimationPaused(!isAnimationPaused)}
            className={`${isDarkMode ? "text-white hover:bg-[#6282E3]" : "text-[#1B2250] hover:bg-[#6282E3] hover:text-white"}`}
          >
            {isAnimationPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`${isDarkMode ? "text-white hover:bg-[#6282E3]" : "text-[#1B2250] hover:bg-[#6282E3] hover:text-white"}`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center py-20 px-6">
        <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-[#1B2250]"}`}>
          SkinCubator
        </h1>
        <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${isDarkMode ? "text-gray-200" : "text-[#333333]"}`}>
          Your gentle AI companion for skin-to-skin bonding with your baby
        </p>
        <p className={`text-lg mb-12 max-w-2xl mx-auto ${isDarkMode ? "text-gray-300" : "text-[#333333]"}`}>
          Get personalized guidance, reassurance, and evidence-based support for kangaroo care at every stage of your
          journey.
        </p>
        <Button
          size="lg"
          onClick={navigateToChat}
          className="bg-[#F7A07C] hover:bg-[#F7A07C]/90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Start Your Journey
          <MessageCircle className="ml-2 w-5 h-5" />
        </Button>
      </section>

      {/* Information Sections */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Why Skin-to-Skin Care */}
          <div
            className={`mb-20 p-12 rounded-3xl ${isDarkMode ? "bg-[#1B2250]/80 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"} shadow-xl`}
          >
            <h2
              className={`text-3xl md:text-4xl font-bold mb-8 text-center ${isDarkMode ? "text-white" : "text-[#1B2250]"}`}
            >
              Why Skin-to-Skin Care?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card
                className={`${isDarkMode ? "bg-[#6282E3]/20 border-[#6282E3]/30" : "bg-[#F7F9FC] border-[#A8D5BA]/30"} shadow-lg`}
              >
                <CardContent className="p-6 text-center">
                  <Heart className="w-12 h-12 text-[#F7A07C] mx-auto mb-4" />
                  <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-white" : "text-[#1B2250]"}`}>
                    Bonding & Attachment
                  </h3>
                  <p className={`${isDarkMode ? "text-gray-300" : "text-[#333333]"}`}>
                    Promotes secure attachment and emotional connection between parent and baby through direct contact.
                  </p>
                </CardContent>
              </Card>
              <Card
                className={`${isDarkMode ? "bg-[#6282E3]/20 border-[#6282E3]/30" : "bg-[#F7F9FC] border-[#A8D5BA]/30"} shadow-lg`}
              >
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 text-[#A8D5BA] mx-auto mb-4" />
                  <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-white" : "text-[#1B2250]"}`}>
                    Health Benefits
                  </h3>
                  <p className={`${isDarkMode ? "text-gray-300" : "text-[#333333]"}`}>
                    Regulates baby's temperature, heart rate, and breathing while boosting immune system development.
                  </p>
                </CardContent>
              </Card>
              <Card
                className={`${isDarkMode ? "bg-[#6282E3]/20 border-[#6282E3]/30" : "bg-[#F7F9FC] border-[#A8D5BA]/30"} shadow-lg`}
              >
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-12 h-12 text-[#6282E3] mx-auto mb-4" />
                  <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-white" : "text-[#1B2250]"}`}>
                    Stress Reduction
                  </h3>
                  <p className={`${isDarkMode ? "text-gray-300" : "text-[#333333]"}`}>
                    Reduces cortisol levels in both parent and baby, promoting calm and reducing anxiety.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How SkinCubator Works */}
          <div
            className={`mb-20 p-12 rounded-3xl ${isDarkMode ? "bg-[#1B2250]/80 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"} shadow-xl`}
          >
            <h2
              className={`text-3xl md:text-4xl font-bold mb-8 text-center ${isDarkMode ? "text-white" : "text-[#1B2250]"}`}
            >
              How SkinCubator Works
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-[#1B2250]"}`}>
                    Personalized Guidance
                  </h3>
                  <p className={`text-lg mb-6 ${isDarkMode ? "text-gray-300" : "text-[#333333]"}`}>
                    Our AI companion provides tailored advice based on your baby's age, your experience level, and
                    specific questions about kangaroo care techniques.
                  </p>
                  <ul className={`space-y-3 ${isDarkMode ? "text-gray-300" : "text-[#333333]"}`}>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#A8D5BA] rounded-full mr-3"></div>
                      Hourly session guidance for newborns
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#A8D5BA] rounded-full mr-3"></div>
                      Daily routine integration tips
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#A8D5BA] rounded-full mr-3"></div>
                      Monthly developmental milestones
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <div
                    className={`w-full h-64 rounded-2xl ${isDarkMode ? "bg-[#6282E3]/20" : "bg-[#F7F9FC]"} flex items-center justify-center shadow-lg`}
                  >
                    <MessageCircle className="w-24 h-24 text-[#6282E3] opacity-60" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust & Safety */}
          <div
            className={`p-12 rounded-3xl ${isDarkMode ? "bg-[#1B2250]/80 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"} shadow-xl`}
          >
            <h2
              className={`text-3xl md:text-4xl font-bold mb-8 text-center ${isDarkMode ? "text-white" : "text-[#1B2250]"}`}
            >
              Trusted by Parents Worldwide
            </h2>
            <div className="text-center max-w-3xl mx-auto">
              <p className={`text-lg mb-8 ${isDarkMode ? "text-gray-300" : "text-[#333333]"}`}>
                "SkinCubator provided the confidence and guidance I needed during those precious early bonding moments
                with my baby. The evidence-based advice helped me feel secure in my parenting journey."
              </p>
              <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-[#6282E3]"}`}>
                - Sarah M., New Parent
              </p>
              <div className="mt-8 flex justify-center">
                <Button
                  size="lg"
                  onClick={navigateToChat}
                  className="bg-[#6282E3] hover:bg-[#6282E3]/90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Begin Your Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(90deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
