"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<"farmer" | "vet">("farmer")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate form
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password.",
        variant: "destructive"
      })
      setIsLoading(false)
      return
    }

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      
      // In a real app, this would be handled by a backend API
      // For demo purposes, we'll just redirect to the appropriate dashboard
      if (userType === "farmer") {
        // Store user type in localStorage for demo purposes
        localStorage.setItem("vetco_user_type", "farmer")
        
        toast({
          title: "Login successful",
          description: "Welcome back to Vetco!",
        })
        router.push("/dashboard")
      } else {
        // Store user type in localStorage for demo purposes
        localStorage.setItem("vetco_user_type", "vet")
        
        toast({
          title: "Login successful",
          description: "Welcome back to Vetco!",
        })
        router.push("/vet-dashboard")
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center mb-8 text-green-600 hover:text-green-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Home
        </Link>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="farmer" className="w-full" onValueChange={(value) => setUserType(value as "farmer" | "vet")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="farmer">Farmer</TabsTrigger>
                <TabsTrigger value="vet">Veterinarian</TabsTrigger>
              </TabsList>
              <TabsContent value="farmer">
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                          Forgot password?
                        </Link>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                      />
                    </div>
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="vet">
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="vet-email">Email</Label>
                      <Input 
                        id="vet-email" 
                        type="email" 
                        placeholder="dr.name@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="vet-password">Password</Label>
                        <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                          Forgot password?
                        </Link>
                      </div>
                      <Input 
                        id="vet-password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                      />
                    </div>
                    <Button type="submit" className="w-full\

