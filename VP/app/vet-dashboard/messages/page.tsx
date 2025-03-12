"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Paperclip, MoreVertical, Phone, Video, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"

// Sample data for conversations - in a real app, this would come from an API
const initialConversations = [
  {
    id: 1,
    farmer: {
      id: "farmer-001",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastSeen: null,
    },
    lastMessage: "I'll be ready for the appointment tomorrow. Do I need to prepare anything specific?",
    time: "2h ago",
    unread: true,
  },
  {
    id: 2,
    farmer: {
      id: "farmer-002",
      name: "Sarah Namuli",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      lastSeen: "3h ago",
    },
    lastMessage: "Thank you for the information about deworming. I'll make sure to follow your instructions.",
    time: "Yesterday",
    unread: true,
  },
  {
    id: 3,
    farmer: {
      id: "farmer-003",
      name: "David Okello",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      lastSeen: "1d ago",
    },
    lastMessage:
      "I'm concerned about the symptoms my chickens are showing. Can we discuss this before our appointment?",
    time: "2 days ago",
    unread: false,
  },
  {
    id: 4,
    farmer: {
      id: "farmer-004",
      name: "Mary Auma",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      lastSeen: "5d ago",
    },
    lastMessage: "The treatment you prescribed is working well. The cow is recovering nicely.",
    time: "1 week ago",
    unread: false,
  },
]

// Sample messages for the selected conversation
const sampleMessages = {
  "farmer-001": [
    {
      id: 1,
      sender: "farmer",
      text: "Hello Dr. Mukasa, I have an appointment scheduled for tomorrow at 10:00 AM for my dairy cow's vaccination.",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "vet",
      text: "Hello John, yes I have it in my schedule. I'll be coming to your farm for the East Coast Fever vaccination.",
      time: "10:32 AM",
    },
    {
      id: 3,
      sender: "farmer",
      text: "Great! Is there anything specific I need to prepare before you arrive?",
      time: "10:35 AM",
    },
    {
      id: 4,
      sender: "vet",
      text: "Please ensure the cow is restrained properly for the vaccination. Also, have her health records ready for me to review and update.",
      time: "10:38 AM",
    },
    {
      id: 5,
      sender: "farmer",
      text: "I'll make sure everything is ready. Thank you!",
      time: "10:40 AM",
    },
    {
      id: 6,
      sender: "vet",
      text: "Perfect. Also, please keep the cow in a shaded area as they might experience mild fever after vaccination. I'll bring all the necessary equipment and vaccines.",
      time: "10:45 AM",
    },
    {
      id: 7,
      sender: "farmer",
      text: "I'll be ready for the appointment tomorrow. Do I need to prepare anything specific?",
      time: "2:30 PM",
    },
  ],
  "farmer-002": [
    {
      id: 1,
      sender: "farmer",
      text: "Dr. Mukasa, I need advice on deworming my goats. What's the best approach?",
      time: "Yesterday, 9:15 AM",
    },
    {
      id: 2,
      sender: "vet",
      text: "Hello Sarah, for goats, I recommend using a broad-spectrum dewormer. How many goats do you have and what are their ages?",
      time: "Yesterday, 9:30 AM",
    },
    {
      id: 3,
      sender: "farmer",
      text: "I have 5 goats, all adults between 2-4 years old.",
      time: "Yesterday, 9:35 AM",
    },
    {
      id: 4,
      sender: "vet",
      text: "For adult goats, you can use Albendazole or Ivermectin. The dosage is based on their weight. It's important to rotate dewormers to prevent resistance. I can bring some when I visit next week.",
      time: "Yesterday, 9:45 AM",
    },
    {
      id: 5,
      sender: "farmer",
      text: "That would be great. How often should I deworm them?",
      time: "Yesterday, 10:00 AM",
    },
    {
      id: 6,
      sender: "vet",
      text: "For adult goats in your area, every 3-4 months is usually sufficient. However, during rainy seasons, you might need to do it more frequently. Also, keep their living area clean to reduce reinfection.",
      time: "Yesterday, 10:15 AM",
    },
    {
      id: 7,
      sender: "farmer",
      text: "Thank you for the information about deworming. I'll make sure to follow your instructions.",
      time: "Yesterday, 2:45 PM",
    },
  ],
  "farmer-003": [
    {
      id: 1,
      sender: "farmer",
      text: "Dr. Mukasa, I'm noticing some concerning symptoms in my chicken flock. Many of them are showing respiratory issues and reduced egg production.",
      time: "2 days ago, 8:00 AM",
    },
    {
      id: 2,
      sender: "vet",
      text: "Hello David, I'm sorry to hear that. These symptoms could indicate Newcastle disease or infectious bronchitis. Are you seeing any other symptoms like diarrhea or nervous signs?",
      time: "2 days ago, 8:15 AM",
    },
    {
      id: 3,
      sender: "farmer",
      text: "Yes, some birds are showing diarrhea, and a few seem to have coordination problems.",
      time: "2 days ago, 8:20 AM",
    },
    {
      id: 4,
      sender: "vet",
      text: "This sounds like Newcastle disease. It's highly contagious. Please isolate any sick birds immediately. I've scheduled an urgent appointment for tomorrow at 10:00 AM to assess the situation and start treatment.",
      time: "2 days ago, 8:30 AM",
    },
    {
      id: 5,
      sender: "farmer",
      text: "I'll isolate them right away. Is there anything I can do before you arrive?",
      time: "2 days ago, 8:35 AM",
    },
    {
      id: 6,
      sender: "vet",
      text: "Ensure all birds have access to clean water with added electrolytes if possible. Maintain good ventilation but protect them from drafts. Monitor for any birds showing severe symptoms and keep track of mortality. I'll bring vaccines and medications tomorrow.",
      time: "2 days ago, 8:45 AM",
    },
    {
      id: 7,
      sender: "farmer",
      text: "I'm concerned about the symptoms my chickens are showing. Can we discuss this before our appointment?",
      time: "2 days ago, 4:30 PM",
    },
  ],
  "farmer-004": [
    {
      id: 1,
      sender: "farmer",
      text: "Dr. Mukasa, I wanted to update you on my cow's condition after the mastitis treatment you provided last week.",
      time: "1 week ago, 9:00 AM",
    },
    {
      id: 2,
      sender: "vet",
      text: "Hello Mary, thank you for the update. How is she doing?",
      time: "1 week ago, 9:10 AM",
    },
    {
      id: 3,
      sender: "farmer",
      text: "She's doing much better! The swelling has gone down significantly, and milk production is almost back to normal.",
      time: "1 week ago, 9:15 AM",
    },
    {
      id: 4,
      sender: "vet",
      text: "That's excellent news! Did you complete the full course of antibiotics as prescribed?",
      time: "1 week ago, 9:20 AM",
    },
    {
      id: 5,
      sender: "farmer",
      text: "Yes, I followed your instructions exactly. I also improved the milking hygiene as you suggested.",
      time: "1 week ago, 9:25 AM",
    },
    {
      id: 6,
      sender: "vet",
      text: "Perfect. Continue monitoring her for the next few days. If you notice any recurrence of symptoms, let me know immediately. Otherwise, we'll do a follow-up check during my next visit to your area.",
      time: "1 week ago, 9:30 AM",
    },
    {
      id: 7,
      sender: "farmer",
      text: "The treatment you prescribed is working well. The cow is recovering nicely.",
      time: "1 week ago, 2:15 PM",
    },
  ],
}

export default function MessagesPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const farmerParam = searchParams.get("farmer")

  const [conversations, setConversations] = useState(initialConversations)
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Set initial selected conversation based on URL parameter
  useEffect(() => {
    if (farmerParam) {
      const conversation = conversations.find((c) => c.farmer.id === farmerParam)
      if (conversation) {
        selectConversation(conversation)
      }
    } else if (conversations.length > 0 && !selectedConversation) {
      selectConversation(conversations[0])
    }
  }, [farmerParam, conversations])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedConversation) return

    const newMsg = {
      id: messages.length + 1,
      sender: "vet",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMsg])
    setNewMessage("")

    // In a real app, this would be sent to an API
    // and potentially trigger a notification for the farmer

    // Simulate farmer response after a delay (for demo purposes)
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const farmerResponse = {
          id: messages.length + 2,
          sender: "farmer",
          text: "Thank you for the information, doctor. I'll follow your advice.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        setMessages((prev) => [...prev, farmerResponse])

        // Update the conversation list with the new message
        setConversations(
          conversations.map((conv) =>
            conv.id === selectedConversation.id
              ? {
                  ...conv,
                  lastMessage: farmerResponse.text,
                  time: "Just now",
                  unread: true,
                }
              : conv,
          ),
        )
      }, 5000)
    }
  }

  const selectConversation = (conversation: any) => {
    setSelectedConversation(conversation)

    // Mark as read
    if (conversation.unread) {
      setConversations(conversations.map((conv) => (conv.id === conversation.id ? { ...conv, unread: false } : conv)))
    }

    // Load messages for this conversation
    const conversationMessages = sampleMessages[conversation.farmer.id] || []
    setMessages(conversationMessages)
  }

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
        <p className="text-muted-foreground">Communicate with farmers about their livestock's health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <div className="md:col-span-1 overflow-hidden flex flex-col">
          <Card className="flex-1 overflow-hidden">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No conversations found</div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-b ${
                        selectedConversation?.id === conversation.id ? "bg-green-50 dark:bg-green-900/20" : ""
                      }`}
                      onClick={() => selectConversation(conversation)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.farmer.avatar} alt={conversation.farmer.name} />
                          <AvatarFallback>{conversation.farmer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${
                            conversation.farmer.status === "online" ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium truncate">{conversation.farmer.name}</h4>
                          <span className="text-xs text-gray-500">{conversation.time}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread && (
                        <Badge className="bg-green-600 h-2 w-2 rounded-full p-0 flex items-center justify-center">
                          <span className="sr-only">Unread message</span>
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 overflow-hidden flex flex-col">
          <Card className="flex-1 overflow-hidden">
            <CardContent className="p-0 flex flex-col h-full">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedConversation.farmer.avatar} alt={selectedConversation.farmer.name} />
                        <AvatarFallback>{selectedConversation.farmer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{selectedConversation.farmer.name}</h3>
                        <p className="text-xs text-gray-500">
                          {selectedConversation.farmer.status === "online"
                            ? "Online"
                            : selectedConversation.farmer.lastSeen
                              ? `Last seen ${selectedConversation.farmer.lastSeen}`
                              : "Offline"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" title="Voice call">
                        <Phone className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Video call">
                        <Video className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" title="More options">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "vet" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === "vet"
                              ? "bg-green-600 text-white"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                          }`}
                        >
                          <p>{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${message.sender === "vet" ? "text-green-100" : "text-gray-500 dark:text-gray-400"}`}
                          >
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
                      <Button variant="outline" size="icon" type="button" title="Attach file">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={!newMessage.trim()}>
                        <Send className="h-5 w-5" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

