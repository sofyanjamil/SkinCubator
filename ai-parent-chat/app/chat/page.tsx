"use client"

import { useState, useRef, useEffect } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { sendChat } from "@/lib/chatClient"

interface Message {
	id: string
	content: string
	sender: "user" | "ai"
	timestamp: Date
}

export default function SkinCubatorChat() {
	const [isMounted, setIsMounted] = useState(false)
	useEffect(() => {
		setIsMounted(true)
	}, [])

	const [messages, setMessages] = useState<Message[]>([])
	const [inputValue, setInputValue] = useState("")
	const [isTyping, setIsTyping] = useState(false)
	const [errorText, setErrorText] = useState<string | null>(null)
	const scrollAreaRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (isMounted && messages.length === 0) {
			setMessages([
				{
					id: "welcome-1",
					content: `Hi there, and welcome to our neonatal intensive care unit, or NICU for short.
I am Skincu-AI, and I'm part of a tool that has been built to help you understand how you can support and care for your baby while they are in the NICU and think about solutions for some of the problems you might have.
You probably have a lot of questions and concerns, I'm sure it's been very intense so far, and our team will try to answer all of them shortly.

You probably didn’t intend to be here right now, and this isn’t what you planned. 
But here you are, and before we start, 

We are committed to helping you and your baby get through this, with the best outcome possible.
And to do that, we need your help. 

This conversation is going to have a few simple steps. 

The information you share is confidential, and only the staff caring for your baby will have access to it.

So, shall we begin?`,
					sender: "ai",
					timestamp: new Date(Date.now() - 5 * 60 * 1000),
				},
			])
		}
	}, [isMounted, messages.length])

	const quickReplies = [
		"How long should skin-to-skin sessions be?",
		"Benefits of kangaroo care",
		"When to start skin-to-skin contact",
	]

	useEffect(() => {
		if (scrollAreaRef.current) {
			const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]") as HTMLDivElement | null
			if (scrollContainer) {
				scrollContainer.scrollTo({
					top: scrollContainer.scrollHeight,
					behavior: "smooth",
				})
			}
		}
	}, [messages, isTyping])

	const handleSendMessage = async (message?: string) => {
		const messageToSend = message || inputValue
		if (!messageToSend.trim()) return

		setErrorText(null)
		const userMessage: Message = {
			id: Date.now().toString(),
			content: messageToSend,
			sender: "user",
			timestamp: new Date(),
		}

		setMessages((prev: Message[]) => [...prev, userMessage])
		setInputValue("")
		setIsTyping(true)

		try {
			const reply = await sendChat(
				[...messages, userMessage].map((m) => ({ id: m.id, content: m.content, sender: m.sender, timestamp: m.timestamp })),
				60000
			)
			const aiMessage: Message = {
				id: (Date.now() + 1).toString(),
				content: reply,
				sender: "ai",
				timestamp: new Date(),
			}
			setMessages((prev: Message[]) => [...prev, aiMessage])
		} catch (e: any) {
			setErrorText(e?.message || "Failed to get a response. Please try again.")
		} finally {
			setIsTyping(false)
		}
	}

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		})
	}

	if (!isMounted) {
		return null
	}

	return (
		<div className="min-h-screen" style={{ backgroundColor: "#F7F9FC" }}>
			<header
				className="sticky top-0 z-10 shadow-sm"
				style={{ backgroundColor: "#1B2250", borderBottom: "1px solid #e2e8f0" }}
			>
				<div className="max-w-4xl mx-auto px-4 py-4">
					<div className="flex items-center gap-3">
						<Link href="/landing">
							<Button variant="ghost" size="sm" className="text-white hover:bg-[#6282E3] mr-2">
								<ArrowLeft className="w-4 h-4" />
							</Button>
						</Link>
						<div
							className="w-10 h-10 rounded-full flex items-center justify-center"
							style={{ backgroundColor: "#6282E3" }}
						>
							<Sparkles className="w-5 h-5 text-white" />
						</div>
						<div>
							<h1 className="font-sans font-semibold text-lg text-white">SkinCubator</h1>
							<p className="text-sm" style={{ color: "#A8D5BA" }}>
								Your gentle guide for skin-to-skin bonding
							</p>
						</div>
					</div>
				</div>
			</header>

			{/* Chat Container */}
			<div className="max-w-4xl mx-auto px-4 py-6">
				<Card
					className="shadow-lg h-[calc(100vh-220px)] flex flex-col"
					style={{ backgroundColor: "white", border: "1px solid #e2e8f0" }}
				>
					{/* Messages */}
					<ScrollArea ref={scrollAreaRef} className="flex-1 p-6 min-h-0">
						<div className="space-y-6">
							{messages.map((message: Message) => (
								<div
									key={message.id}
									className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
								>
									{message.sender === "ai" && (
										<Avatar className="w-8 h-8" style={{ backgroundColor: "#6282E3" }}>
											<AvatarFallback className="text-white text-sm" style={{ backgroundColor: "#6282E3" }}>
												AI
											</AvatarFallback>
										</Avatar>
									)}

									<div className={`max-w-[80%] ${message.sender === "user" ? "order-first" : ""}`}>
										<div
											className={`rounded-2xl px-4 py-3 shadow-sm ${message.sender === "user" ? "ml-auto" : ""}`}
											style={{
												backgroundColor: message.sender === "user" ? "#A8D5BA" : "#6282E3",
												color: "white",
											}}
										>
											<p className="text-sm leading-relaxed font-serif">{message.content}</p>
										</div>
										<p className="text-xs mt-1 px-2" style={{ color: "#64748b" }}>
											{formatTime(message.timestamp)}
										</p>
									</div>

									{message.sender === "user" && (
										<Avatar className="w-8 h-8" style={{ backgroundColor: "#A8D5BA" }}>
											<AvatarFallback className="text-white text-sm" style={{ backgroundColor: "#A8D5BA" }}>
												You
											</AvatarFallback>
										</Avatar>
									)}
								</div>
							))}

							{isTyping && (
								<div className="flex gap-3 justify-start">
									<Avatar className="w-8 h-8" style={{ backgroundColor: "#6282E3" }}>
										<AvatarFallback className="text-white text-sm" style={{ backgroundColor: "#6282E3" }}>
											AI
										</AvatarFallback>
									</Avatar>
									<div className="rounded-2xl px-4 py-3 shadow-sm" style={{ backgroundColor: "#f1f5f9" }}>
										<div className="flex gap-1 items-center">
											<span className="text-sm mr-2" style={{ color: "#64748b" }}>
												SkinCubator is thinking
											</span>
											<div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "#6282E3" }}></div>
											<div
												className="w-2 h-2 rounded-full animate-bounce"
												style={{ backgroundColor: "#6282E3", animationDelay: "0.1s" }}
											></div>
											<div
												className="w-2 h-2 rounded-full animate-bounce"
												style={{ backgroundColor: "#6282E3", animationDelay: "0.2s" }}
											></div>
										</div>
									</div>
								</div>
							)}

							{errorText && (
								<div className="text-center text-xs" style={{ color: "#b91c1c" }}>
									{errorText}
								</div>
							)}
						</div>
					</ScrollArea>

					{/* Input and Send Button */}
					<div className="p-4" style={{ backgroundColor: "#F7F9FC" }}>
						<div className="flex gap-2">
							<Input
								value={inputValue}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
								placeholder="Ask about skin-to-skin care with your baby..."
								className="flex-1 font-serif border-2 rounded-lg shadow-sm"
								style={{
									borderColor: "#d1d5db",
									backgroundColor: "white",
								}}
								onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSendMessage()}
							/>
							<Button
								onClick={() => handleSendMessage()}
								disabled={!inputValue.trim() || isTyping}
								size="icon"
								className="shrink-0 shadow-sm h-11 w-11"
								style={{ backgroundColor: "#F7A07C" }}
							>
								<Send className="w-5 h-5" />
							</Button>
						</div>
					</div>
				</Card>

				<div className="flex flex-wrap gap-2 mt-4 justify-center">
					{quickReplies.map((reply, index) => (
						<button
							key={index}
							onClick={() => handleSendMessage(reply)}
							className="px-2 py-1 rounded-full text-xs transition-colors hover:opacity-80"
							style={{
								backgroundColor: "#F7F9FC",
								color: "#1B2250",
								border: "1px solid #e2e8f0",
							}}
						>
							{reply}
						</button>
					))}
				</div>
			</div>
		</div>
	)
}
