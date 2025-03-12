"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Paperclip, MoreVertical, Phone, Video } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Sample data for conversations
const conversations = [
  {
    id: 1,
    name: "Dr. Joseph Mukasa",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "I'll bring the necessary vaccines for your cattle during our appointment tomorrow.",
    time: "2h ago",
    unread: true,
  },
  {
    id: 2,
    name: "Dr. Sarah Namuli",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage:
      "Based on your description, it sounds like your chickens might have Newcastle disease. We should discuss treatment options.",
    time: "Yesterday",
    unread: true,
  },
  {
    id: 3,
    name: "Dr. David Okello",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage:
      "Thank you for your payment. I've updated your records with the treatment details from our last visit.",
    time: "2 days ago",
    unread: false,
  },
  {
    id: 4,
    name: "Dr. Grace Achieng",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage: "Your dairy cows are doing well. The new feeding regimen is showing positive results.",
    time: "1 week ago",
    unread: false,
  },
]

// Sample messages for the selected conversation
const sampleMessages = [
  {
    id: 1,
    sender: "user",
    text: "Hello Dr. Mukasa, I'm concerned about one of my cows. She's not eating well and seems lethargic.",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "vet",
    text: "I'm sorry to hear that. How long has she been showing these symptoms?",
    time: "10:32 AM",
  },
  {
    id: 3,
    sender: "user",
    text: "It started yesterday evening. Her temperature also seems higher than normal.",
    time: "10:35 AM",
  },
  {
    id: 4,
    sender: "vet",
    text: "That could be several things. Can you send me a photo of the cow and any discharge if present? Also, has she been drinking water?",
    time: "10:38 AM",
  },
  {
    id: 5,
    sender: "user",
    text: "She's drinking a little water but not much. I'll send you photos shortly.",
    time: "10:40 AM",
  },
  {
    id: 6,
    sender: "vet",
    text: "Based on what you're describing, it could be a mild infection. I have an opening tomorrow at 10:00 AM. I can come to your farm to examine her. In the meantime, make sure she has access to clean water and monitor her temperature.",
    time: "10:45 AM",
  },
  {
    id: 7,
    sender: "user",
    text: "That would be great. Thank you for fitting us in so quickly.",
    time: "10:47 AM",
  },
  {
    id: 8,
    sender: "vet",
    text: "No problem at all. I'll bring the necessary vaccines for your cattle during our appointment tomorrow. Is there anything else you need?",
    time: "10:50 AM",
  },
]

export default function MessagesPage() {
  const { toast } = useToast()
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messages, setMessages] = useState(sampleMessages)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    const newMsg = {
      id: messages.length + 1,
      sender: "user",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMsg])
    setNewMessage("")

    // Simulate vet response after a delay
    setTimeout(() => {
      const vetResponse = {
        id: messages.length + 2,
        sender: "vet",
        text: "I've received your message. I'll get back to you shortly with more information.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, vetResponse])
    }, 2000)
  }

  const selectConversation = (conversation: any) => {
    setSelectedConversation(conversation)
    // In a real app, you would fetch messages for this conversation
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
        <p className="text-muted-foreground">Communicate with veterinarians about your livestock's health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <div className="md:col-span-1 overflow-hidden flex flex-col">
          <Card className="flex-1 overflow-hidden">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="p-4 border-b">
                <Input placeholder="Search conversations..." />
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 border-b ${
                      selectedConversation.id === conversation.id ? "bg-green-50" : ""
                    }`}
                    onClick={() => selectConversation(conversation)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.avatar} alt={conversation.name} />
                        <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                          conversation.status === "online" ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{conversation.name}</h4>
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread && <div className="h-2 w-2 rounded-full bg-green-600"></div>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 overflow-hidden flex flex-col">
          <Card className="flex-1 overflow-hidden">
            <CardContent className="p-0 flex flex-col h-full">
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                    <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedConversation.name}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedConversation.status === "online" ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === "user" ? "text-green-100" : "text-gray-500"}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Button variant="outline" size="icon" type="button">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

