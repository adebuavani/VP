"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: number
  title: string
  message: string
  time: string
  read: boolean
}

export function NotificationBadge() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Appointment Confirmed",
      message: "Your appointment with Dr. Mukasa has been confirmed for tomorrow at 10:00 AM.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "New Message",
      message: "Dr. Namuli sent you a message about your upcoming appointment.",
      time: "Yesterday",
      read: false,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read.",
    })
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  // Simulate receiving a new notification
  useEffect(() => {
    const timer = setTimeout(() => {
      const newNotification = {
        id: notifications.length + 1,
        title: "Appointment Reminder",
        message: "Your appointment with Dr. Mukasa is tomorrow at 10:00 AM.",
        time: "Just now",
        read: false,
      }

      setNotifications([newNotification, ...notifications])

      toast({
        title: newNotification.title,
        description: newNotification.message,
      })
    }, 30000) // Show after 30 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-4 text-center text-sm text-gray-500">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-3 cursor-pointer ${notification.read ? "opacity-70" : ""}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex flex-col gap-1">
                  <div className="font-medium flex items-center">
                    {notification.title}
                    {!notification.read && <span className="ml-2 h-2 w-2 rounded-full bg-green-500"></span>}
                  </div>
                  <div className="text-sm text-gray-500">{notification.message}</div>
                  <div className="text-xs text-gray-400">{notification.time}</div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

