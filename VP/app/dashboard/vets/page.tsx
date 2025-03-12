"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Star, Heart, BookmarkPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Reduced mock data for vets
const initialVets = [
  {
    id: 1,
    name: "Dr. Joseph Mukasa",
    specialty: "Large Animal Specialist",
    location: "Kampala, Uganda",
    distance: "5 km",
    rating: 4.8,
    reviews: 124,
    available: true,
    availableTimes: ["9:00 AM", "11:30 AM", "2:00 PM"],
    image: "/placeholder.svg?height=80&width=80",
    bio: "Dr. Mukasa has over 15 years of experience treating cattle, goats, and other large farm animals.",
    favorite: false,
    saved: false,
  },
  {
    id: 2,
    name: "Dr. Sarah Namuli",
    specialty: "Poultry Specialist",
    location: "Entebbe, Uganda",
    distance: "12 km",
    rating: 4.9,
    reviews: 98,
    available: true,
    availableTimes: ["10:00 AM", "1:00 PM"],
    image: "/placeholder.svg?height=80&width=80",
    bio: "Dr. Namuli is an expert in poultry health and disease management.",
    favorite: false,
    saved: false,
  },
  {
    id: 3,
    name: "Dr. David Okello",
    specialty: "General Veterinarian",
    location: "Jinja, Uganda",
    distance: "18 km",
    rating: 4.7,
    reviews: 156,
    available: false,
    availableTimes: [],
    image: "/placeholder.svg?height=80&width=80",
    bio: "Dr. Okello provides comprehensive veterinary care for all types of farm animals.",
    favorite: false,
    saved: false,
  },
]

export default function VetsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [specialty, setSpecialty] = useState("all")
  const [availability, setAvailability] = useState("all")
  const [selectedVet, setSelectedVet] = useState<any>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [appointmentNotes, setAppointmentNotes] = useState("")
  const [vets, setVets] = useState(initialVets)
  const [customNotes, setCustomNotes] = useState<Record<number, string>>({})

  // Filter vets based on search and filters
  const filteredVets = vets.filter((vet) => {
    const matchesSearch =
      vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSpecialty = specialty === "all" || vet.specialty.toLowerCase().includes(specialty.toLowerCase())

    const matchesAvailability =
      availability === "all" ||
      (availability === "available" && vet.available) ||
      (availability === "unavailable" && !vet.available)

    return matchesSearch && matchesSpecialty && matchesAvailability
  })

  const handleBookAppointment = (vet: any) => {
    setSelectedVet(vet)
    setSelectedTime("")
    setSelectedDate("")
    setAppointmentNotes(customNotes[vet.id] || "")
    setBookingDialogOpen(true)
  }

  const confirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select both a date and time for your appointment.",
        variant: "destructive",
      })
      return
    }

    // Save custom notes for this vet
    if (appointmentNotes) {
      setCustomNotes({
        ...customNotes,
        [selectedVet.id]: appointmentNotes,
      })
    }

    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${selectedVet.name} on ${selectedDate} at ${selectedTime} has been confirmed.`,
    })
    setBookingDialogOpen(false)
  }

  const toggleFavorite = (id: number) => {
    setVets(vets.map((vet) => (vet.id === id ? { ...vet, favorite: !vet.favorite } : vet)))

    const vet = vets.find((v) => v.id === id)
    if (vet) {
      toast({
        title: vet.favorite ? "Removed from favorites" : "Added to favorites",
        description: `${vet.name} has been ${vet.favorite ? "removed from" : "added to"} your favorites.`,
      })
    }
  }

  const toggleSaved = (id: number) => {
    setVets(vets.map((vet) => (vet.id === id ? { ...vet, saved: !vet.saved } : vet)))

    const vet = vets.find((v) => v.id === id)
    if (vet) {
      toast({
        title: vet.saved ? "Removed from saved" : "Saved for later",
        description: `${vet.name} has been ${vet.saved ? "removed from" : "added to"} your saved list.`,
      })
    }
  }

  const updateVetNote = (id: number, note: string) => {
    setCustomNotes({
      ...customNotes,
      [id]: note,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Find a Veterinarian</h2>
        <p className="text-muted-foreground">Connect with qualified veterinarians across Uganda.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name, specialty, or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="large animal">Large Animal</SelectItem>
                  <SelectItem value="poultry">Poultry</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Select value={availability} onValueChange={setAvailability}>
                <SelectTrigger id="availability">
                  <SelectValue placeholder="Any Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Availability</SelectItem>
                  <SelectItem value="available">Available Today</SelectItem>
                  <SelectItem value="unavailable">Not Available</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="distance">Distance</Label>
              <Select defaultValue="50">
                <SelectTrigger id="distance">
                  <SelectValue placeholder="Max Distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Within 10 km</SelectItem>
                  <SelectItem value="25">Within 25 km</SelectItem>
                  <SelectItem value="50">Within 50 km</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          {filteredVets.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No veterinarians found matching your criteria.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchTerm("")
                  setSpecialty("all")
                  setAvailability("all")
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            filteredVets.map((vet) => (
              <Card key={vet.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 lg:w-1/5 p-6 flex flex-col items-center justify-center bg-gray-50">
                      <div className="relative">
                        <img
                          src={vet.image || "/placeholder.svg"}
                          alt={vet.name}
                          className="h-20 w-20 rounded-full object-cover border-2 border-white"
                        />
                        {vet.available ? (
                          <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></span>
                        ) : (
                          <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-gray-300 border-2 border-white"></span>
                        )}
                      </div>
                      <div className="mt-4 text-center">
                        <div className="flex items-center justify-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 font-medium">{vet.rating}</span>
                          <span className="ml-1 text-sm text-gray-500">({vet.reviews})</span>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${vet.favorite ? "text-red-500" : ""}`}
                          onClick={() => toggleFavorite(vet.id)}
                        >
                          <Heart className={`h-4 w-4 ${vet.favorite ? "fill-current" : ""}`} />
                          <span className="sr-only">{vet.favorite ? "Remove from favorites" : "Add to favorites"}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${vet.saved ? "text-blue-500" : ""}`}
                          onClick={() => toggleSaved(vet.id)}
                        >
                          <BookmarkPlus className={`h-4 w-4 ${vet.saved ? "fill-current" : ""}`} />
                          <span className="sr-only">{vet.saved ? "Remove from saved" : "Save for later"}</span>
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">{vet.name}</h3>
                          <p className="text-sm text-gray-500">{vet.specialty}</p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <MapPin className="mr-1 h-4 w-4" />
                            {vet.location} ({vet.distance})
                          </div>
                          <p className="mt-4 text-sm">{vet.bio}</p>

                          <div className="mt-3">
                            <Textarea
                              placeholder="Add your notes about this vet..."
                              className="text-sm h-20"
                              value={customNotes[vet.id] || ""}
                              onChange={(e) => updateVetNote(vet.id, e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => handleBookAppointment(vet)}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={!vet.available}
                          >
                            {vet.available ? "Book Appointment" : "Not Available"}
                          </Button>
                          <Button variant="outline">View Profile</Button>
                        </div>
                      </div>
                      {vet.available && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Available Today:</p>
                          <div className="flex flex-wrap gap-2">
                            {vet.availableTimes.map((time) => (
                              <Badge key={time} variant="outline" className="bg-green-50">
                                <Clock className="mr-1 h-3 w-3" />
                                {time}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        <TabsContent value="map">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Map view is currently under development.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book an Appointment</DialogTitle>
            <DialogDescription>{selectedVet && `Schedule an appointment with ${selectedVet.name}`}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="appointment-date">Date</Label>
              <Input
                id="appointment-date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointment-time">Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger id="appointment-time">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {selectedVet?.availableTimes.map((time: string) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointment-notes">Notes (Optional)</Label>
              <Textarea
                id="appointment-notes"
                placeholder="Describe your livestock's condition"
                value={appointmentNotes}
                onChange={(e) => setAppointmentNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBooking} className="bg-green-600 hover:bg-green-700">
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

