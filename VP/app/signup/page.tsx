"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<"farmer" | "vet">("farmer")

  // Farmer form state
  const [farmerForm, setFarmerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    farmName: "",
    farmLocation: "",
    farmSize: "",
    livestockTypes: "",
    agreeToTerms: false,
  })

  // Vet form state
  const [vetForm, setVetForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
    specialty: "",
    experience: "",
    qualifications: "",
    servingLocations: "",
    bio: "",
    agreeToTerms: false,
  })

  const handleFarmerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFarmerForm({
      ...farmerForm,
      [name]: value,
    })
  }

  const handleVetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setVetForm({
      ...vetForm,
      [name]: value,
    })
  }

  const handleFarmerCheckboxChange = (checked: boolean) => {
    setFarmerForm({
      ...farmerForm,
      agreeToTerms: checked,
    })
  }

  const handleVetCheckboxChange = (checked: boolean) => {
    setVetForm({
      ...vetForm,
      agreeToTerms: checked,
    })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate form
    if (userType === "farmer") {
      if (!validateFarmerForm()) {
        setIsLoading(false)
        return
      }
    } else {
      if (!validateVetForm()) {
        setIsLoading(false)
        return
      }
    }

    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false)

      // Store user data in localStorage for demo purposes
      // In a real app, this would be handled by a backend API
      if (userType === "farmer") {
        localStorage.setItem("vetco_user_type", "farmer")
        localStorage.setItem(
          "vetco_farmer",
          JSON.stringify({
            id: `farmer-${Date.now()}`,
            ...farmerForm,
            createdAt: new Date().toISOString(),
          }),
        )

        toast({
          title: "Account created",
          description: "Welcome to Vetco! You can now connect with veterinarians.",
        })
        router.push("/dashboard")
      } else {
        localStorage.setItem("vetco_user_type", "vet")
        localStorage.setItem(
          "vetco_vet",
          JSON.stringify({
            id: `vet-${Date.now()}`,
            ...vetForm,
            createdAt: new Date().toISOString(),
            isVerified: false, // In a real app, vets would need to be verified
            isAvailable: true,
            rating: 0,
            reviews: 0,
          }),
        )

        toast({
          title: "Account created",
          description: "Welcome to Vetco! You can now manage your veterinary practice.",
        })
        router.push("/vet-dashboard")
      }
    }, 1500)
  }

  const validateFarmerForm = () => {
    // Check required fields
    if (
      !farmerForm.firstName ||
      !farmerForm.lastName ||
      !farmerForm.email ||
      !farmerForm.phone ||
      !farmerForm.password ||
      !farmerForm.confirmPassword
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return false
    }

    // Check password match
    if (farmerForm.password !== farmerForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return false
    }

    // Check terms agreement
    if (!farmerForm.agreeToTerms) {
      toast({
        title: "Terms and Conditions",
        description: "Please agree to the Terms of Service and Privacy Policy.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const validateVetForm = () => {
    // Check required fields
    if (
      !vetForm.firstName ||
      !vetForm.lastName ||
      !vetForm.email ||
      !vetForm.phone ||
      !vetForm.password ||
      !vetForm.confirmPassword ||
      !vetForm.licenseNumber ||
      !vetForm.specialty
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return false
    }

    // Check password match
    if (vetForm.password !== vetForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return false
    }

    // Check terms agreement
    if (!vetForm.agreeToTerms) {
      toast({
        title: "Terms and Conditions",
        description: "Please agree to the Terms of Service and Privacy Policy.",
        variant: "destructive",
      })
      return false
    }

    return true
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
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">Enter your details to create your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="farmer"
              className="w-full"
              onValueChange={(value) => setUserType(value as "farmer" | "vet")}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="farmer">Farmer</TabsTrigger>
                <TabsTrigger value="vet">Veterinarian</TabsTrigger>
              </TabsList>
              <TabsContent value="farmer">
                <form onSubmit={handleSignup}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          name="firstName"
                          placeholder="John"
                          value={farmerForm.firstName}
                          onChange={handleFarmerChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          name="lastName"
                          placeholder="Doe"
                          value={farmerForm.lastName}
                          onChange={handleFarmerChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={farmerForm.email}
                        onChange={handleFarmerChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+256 700 123 456"
                        value={farmerForm.phone}
                        onChange={handleFarmerChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farm-name">Farm Name (Optional)</Label>
                      <Input
                        id="farm-name"
                        name="farmName"
                        placeholder="Green Pastures Farm"
                        value={farmerForm.farmName}
                        onChange={handleFarmerChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farm-location">Farm Location</Label>
                      <Input
                        id="farm-location"
                        name="farmLocation"
                        placeholder="Kampala, Uganda"
                        value={farmerForm.farmLocation}
                        onChange={handleFarmerChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="farm-size">Farm Size (acres)</Label>
                        <Input
                          id="farm-size"
                          name="farmSize"
                          type="number"
                          placeholder="15"
                          value={farmerForm.farmSize}
                          onChange={handleFarmerChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="livestock-types">Livestock Types</Label>
                        <Input
                          id="livestock-types"
                          name="livestockTypes"
                          placeholder="Cattle, Goats, Chickens"
                          value={farmerForm.livestockTypes}
                          onChange={handleFarmerChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={farmerForm.password}
                        onChange={handleFarmerChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        value={farmerForm.confirmPassword}
                        onChange={handleFarmerChange}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={farmerForm.agreeToTerms}
                        onCheckedChange={handleFarmerCheckboxChange}
                        required
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <Link href="#" className="text-green-600 hover:text-green-700">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="#" className="text-green-600 hover:text-green-700">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="vet">
                <form onSubmit={handleSignup}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vet-first-name">First Name</Label>
                        <Input
                          id="vet-first-name"
                          name="firstName"
                          placeholder="Jane"
                          value={vetForm.firstName}
                          onChange={handleVetChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vet-last-name">Last Name</Label>
                        <Input
                          id="vet-last-name"
                          name="lastName"
                          placeholder="Smith"
                          value={vetForm.lastName}
                          onChange={handleVetChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vet-email">Email</Label>
                      <Input
                        id="vet-email"
                        name="email"
                        type="email"
                        placeholder="dr.jane@example.com"
                        value={vetForm.email}
                        onChange={handleVetChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vet-phone">Phone Number</Label>
                      <Input
                        id="vet-phone"
                        name="phone"
                        type="tel"
                        placeholder="+256 700 123 456"
                        value={vetForm.phone}
                        onChange={handleVetChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license">License Number</Label>
                      <Input
                        id="license"
                        name="licenseNumber"
                        placeholder="UVB12345"
                        value={vetForm.licenseNumber}
                        onChange={handleVetChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Select
                        value={vetForm.specialty}
                        onValueChange={(value) => setVetForm({ ...vetForm, specialty: value })}
                      >
                        <SelectTrigger id="specialty">
                          <SelectValue placeholder="Select your specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Large Animal Specialist">Large Animal Specialist</SelectItem>
                          <SelectItem value="Small Animal Specialist">Small Animal Specialist</SelectItem>
                          <SelectItem value="Poultry Specialist">Poultry Specialist</SelectItem>
                          <SelectItem value="Dairy Specialist">Dairy Specialist</SelectItem>
                          <SelectItem value="General Veterinarian">General Veterinarian</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        name="experience"
                        type="number"
                        placeholder="5"
                        value={vetForm.experience}
                        onChange={handleVetChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qualifications">Qualifications</Label>
                      <Input
                        id="qualifications"
                        name="qualifications"
                        placeholder="DVM, Makerere University"
                        value={vetForm.qualifications}
                        onChange={handleVetChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serving-locations">Serving Locations</Label>
                      <Input
                        id="serving-locations"
                        name="servingLocations"
                        placeholder="Kampala, Entebbe, Jinja"
                        value={vetForm.servingLocations}
                        onChange={handleVetChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell farmers about your experience and expertise..."
                        value={vetForm.bio}
                        onChange={handleVetChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vet-password">Password</Label>
                      <Input
                        id="vet-password"
                        name="password"
                        type="password"
                        value={vetForm.password}
                        onChange={handleVetChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vet-confirm-password">Confirm Password</Label>
                      <Input
                        id="vet-confirm-password"
                        name="confirmPassword"
                        type="password"
                        value={vetForm.confirmPassword}
                        onChange={handleVetChange}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="vet-terms"
                        checked={vetForm.agreeToTerms}
                        onCheckedChange={handleVetCheckboxChange}
                        required
                      />
                      <label
                        htmlFor="vet-terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <Link href="#" className="text-green-600 hover:text-green-700">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="#" className="text-green-600 hover:text-green-700">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

