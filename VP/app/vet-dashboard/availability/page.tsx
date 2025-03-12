"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Clock, MapPin, Save, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Initial availability data - in a real app, this would come from an API
const initialAvailability = {
  isAvailable: true,
  workingHours: [
    { day: "Monday", start: "09:00", end: "17:00", available: true },
    { day: "Tuesday", start: "09:00", end: "17:00", available: true },
    { day: "Wednesday", start: "09:00", end: "17:00", available: true },
    { day: "Thursday", start: "09:00", end: "17:00", available: true },
    { day: "Friday", start: "09:00", end: "17:00", available: true },
    { day: "Saturday", start: "10:00", end: "14:00", available: true },
    { day: "Sunday", start: "00:00", end: "00:00", available: false },
  ],
  locations: [
    { id: 1, name: "Kampala Central", isDefault: true, radius: 15 },
    { id: 2, name: "Entebbe Area", isDefault: false, radius: 20 },
    { id: 3, name: "Jinja District", isDefault: false, radius: 25 },
  ],
  specialDates: [
    { date: new Date(2023, 11, 25), available: false, reason: "Christmas Day" },
    { date: new Date(2023, 11, 26), available: false, reason: "Boxing Day" },
    { date: new Date(2024, 0, 1), available: false, reason: "New Year's Day" },
  ],
  services: [
    { id: 1, name: "General Check-up", duration: 30, price: 50000 },
    { id: 2, name: "Vaccination", duration: 15, price: 30000 },
    { id: 3, name: "Deworming", duration: 15, price: 25000 },
    { id: 4, name: "Pregnancy Diagnosis", duration: 45, price: 60000 },
    { id: 5, name: "Emergency Visit", duration: 60, price: 100000 },
  ],
  bufferTime: 30,
  maxAppointmentsPerDay: 8,
  noticeRequired: 2, // hours
}

export default function AvailabilityPage() {
  const { toast } = useToast()
  const [availability, setAvailability] = useState(initialAvailability)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [addLocationDialogOpen, setAddLocationDialogOpen] = useState(false)
  const [newLocation, setNewLocation] = useState({ name: "", radius: 15 })
  const [addServiceDialogOpen, setAddServiceDialogOpen] = useState(false)
  const [newService, setNewService] = useState({ name: "", duration: 30, price: 0 })
  const [addSpecialDateDialogOpen, setAddSpecialDateDialogOpen] = useState(false)
  const [specialDate, setSpecialDate] = useState<Date | undefined>(new Date())
  const [specialDateAvailable, setSpecialDateAvailable] = useState(false)
  const [specialDateReason, setSpecialDateReason] = useState("")

  const toggleAvailability = () => {
    setAvailability({
      ...availability,
      isAvailable: !availability.isAvailable,
    })

    toast({
      title: availability.isAvailable ? "You are now unavailable" : "You are now available",
      description: availability.isAvailable
        ? "Farmers will not be able to book new appointments with you."
        : "Farmers can now book appointments with you.",
    })
  }

  const updateWorkingHours = (index: number, field: "start" | "end" | "available", value: string | boolean) => {
    const updatedHours = [...availability.workingHours]
    updatedHours[index] = { ...updatedHours[index], [field]: value }

    setAvailability({
      ...availability,
      workingHours: updatedHours,
    })
  }

  const saveSettings = () => {
    // In a real app, this would send the data to an API
    toast({
      title: "Settings saved",
      description: "Your availability settings have been updated successfully.",
    })
  }

  const addLocation = () => {
    if (!newLocation.name.trim()) {
      toast({
        title: "Location name required",
        description: "Please enter a name for the location.",
        variant: "destructive",
      })
      return
    }

    const newLocationWithId = {
      id: Math.max(0, ...availability.locations.map((l) => l.id)) + 1,
      name: newLocation.name,
      radius: newLocation.radius,
      isDefault: availability.locations.length === 0,
    }

    setAvailability({
      ...availability,
      locations: [...availability.locations, newLocationWithId],
    })

    setAddLocationDialogOpen(false)
    setNewLocation({ name: "", radius: 15 })

    toast({
      title: "Location added",
      description: `${newLocation.name} has been added to your service locations.`,
    })
  }

  const removeLocation = (id: number) => {
    // Check if it's the last location
    if (availability.locations.length === 1) {
      toast({
        title: "Cannot remove location",
        description: "You must have at least one service location.",
        variant: "destructive",
      })
      return
    }

    // Check if it's the default location
    const isDefault = availability.locations.find((l) => l.id === id)?.isDefault
    let updatedLocations = availability.locations.filter((l) => l.id !== id)

    // If removing the default location, set a new default
    if (isDefault && updatedLocations.length > 0) {
      updatedLocations = updatedLocations.map((location, index) =>
        index === 0 ? { ...location, isDefault: true } : location,
      )
    }

    setAvailability({
      ...availability,
      locations: updatedLocations,
    })

    toast({
      title: "Location removed",
      description: "The location has been removed from your service locations.",
    })
  }

  const setDefaultLocation = (id: number) => {
    const updatedLocations = availability.locations.map((location) => ({
      ...location,
      isDefault: location.id === id,
    }))

    setAvailability({
      ...availability,
      locations: updatedLocations,
    })

    toast({
      title: "Default location updated",
      description: "Your default service location has been updated.",
    })
  }

  const addService = () => {
    if (!newService.name.trim()) {
      toast({
        title: "Service name required",
        description: "Please enter a name for the service.",
        variant: "destructive",
      })
      return
    }

    if (newService.duration <= 0) {
      toast({
        title: "Invalid duration",
        description: "Please enter a valid duration for the service.",
        variant: "destructive",
      })
      return
    }

    if (newService.price <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price for the service.",
        variant: "destructive",
      })
      return
    }

    const newServiceWithId = {
      id: Math.max(0, ...availability.services.map((s) => s.id)) + 1,
      name: newService.name,
      duration: newService.duration,
      price: newService.price,
    }

    setAvailability({
      ...availability,
      services: [...availability.services, newServiceWithId],
    })

    setAddServiceDialogOpen(false)
    setNewService({ name: "", duration: 30, price: 0 })

    toast({
      title: "Service added",
      description: `${newService.name} has been added to your services.`,
    })
  }

  const removeService = (id: number) => {
    setAvailability({
      ...availability,
      services: availability.services.filter((s) => s.id !== id),
    })

    toast({
      title: "Service removed",
      description: "The service has been removed from your offerings.",
    })
  }

  const addSpecialDate = () => {
    if (!specialDate) {
      toast({
        title: "Date required",
        description: "Please select a date.",
        variant: "destructive",
      })
      return
    }

    if (!specialDateReason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for this special date.",
        variant: "destructive",
      })
      return
    }

    // Check if date already exists
    const dateExists = availability.specialDates.some((d) => d.date.toDateString() === specialDate.toDateString())

    if (dateExists) {
      toast({
        title: "Date already exists",
        description: "This date is already in your special dates list.",
        variant: "destructive",
      })
      return
    }

    setAvailability({
      ...availability,
      specialDates: [
        ...availability.specialDates,
        {
          date: specialDate,
          available: specialDateAvailable,
          reason: specialDateReason,
        },
      ],
    })

    setAddSpecialDateDialogOpen(false)
    setSpecialDate(new Date())
    setSpecialDateAvailable(false)
    setSpecialDateReason("")

    toast({
      title: "Special date added",
      description: `${specialDate.toDateString()} has been added to your calendar.`,
    })
  }

  const removeSpecialDate = (date: Date) => {
    setAvailability({
      ...availability,
      specialDates: availability.specialDates.filter((d) => d.date.toDateString() !== date.toDateString()),
    })

    toast({
      title: "Special date removed",
      description: "The date has been removed from your special dates.",
    })
  }

  const updateBufferTime = (value: string) => {
    const bufferTime = Number.parseInt(value)
    if (isNaN(bufferTime) || bufferTime < 0) return

    setAvailability({
      ...availability,
      bufferTime,
    })
  }

  const updateMaxAppointments = (value: string) => {
    const maxAppointments = Number.parseInt(value)
    if (isNaN(maxAppointments) || maxAppointments < 1) return

    setAvailability({
      ...availability,
      maxAppointmentsPerDay: maxAppointments,
    })
  }

  const updateNoticeRequired = (value: string) => {
    const notice = Number.parseInt(value)
    if (isNaN(notice) || notice < 0) return

    setAvailability({
      ...availability,
      noticeRequired: notice,
    })
  }

  // Helper function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Helper function to check if a date is a special date
  const isSpecialDate = (date: Date) => {
    return availability.specialDates.some((d) => d.date.toDateString() === date.toDateString())
  }

  // Helper function to get special date info
  const getSpecialDateInfo = (date: Date) => {
    return availability.specialDates.find((d) => d.date.toDateString() === date.toDateString())
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Availability</h2>
        <p className="text-muted-foreground">Manage your availability, working hours, and service locations.</p>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Availability Status</CardTitle>
                  <CardDescription>Control your overall availability for appointments.</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="availability" checked={availability.isAvailable} onCheckedChange={toggleAvailability} />
                  <Label htmlFor="availability" className="font-medium">
                    {availability.isAvailable ? "Available" : "Unavailable"}
                  </Label>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Working Hours</CardTitle>
                <CardDescription>Set your regular working hours for each day of the week.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availability.workingHours.map((day, index) => (
                    <div key={day.day} className="flex items-center justify-between">
                      <div className="w-24">
                        <Label>{day.day}</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={day.start}
                          onValueChange={(value) => updateWorkingHours(index, "start", value)}
                          disabled={!day.available}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Start" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }).map((_, hour) => (
                              <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                                {hour === 0
                                  ? "12 AM"
                                  : hour === 12
                                    ? "12 PM"
                                    : hour < 12
                                      ? `${hour} AM`
                                      : `${hour - 12} PM`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span>to</span>
                        <Select
                          value={day.end}
                          onValueChange={(value) => updateWorkingHours(index, "end", value)}
                          disabled={!day.available}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="End" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }).map((_, hour) => (
                              <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                                {hour === 0
                                  ? "12 AM"
                                  : hour === 12
                                    ? "12 PM"
                                    : hour < 12
                                      ? `${hour} AM`
                                      : `${hour - 12} PM`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`available-${day.day}`}
                            checked={day.available}
                            onCheckedChange={(checked) => updateWorkingHours(index, "available", checked)}
                          />
                          <Label htmlFor={`available-${day.day}`} className="sr-only">
                            Available
                          </Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveSettings} className="bg-green-600 hover:bg-green-700">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Special Dates</CardTitle>
                    <CardDescription>Mark specific dates as unavailable or with special hours.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setAddSpecialDateDialogOpen(true)}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add Date
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    modifiers={{
                      specialDate: (date) => isSpecialDate(date),
                    }}
                    modifiersClassNames={{
                      specialDate: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
                    }}
                  />

                  {date && isSpecialDate(date) && (
                    <div className="p-4 border rounded-md">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{date.toDateString()}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeSpecialDate(date)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm">
                          <span className="font-medium">Status:</span>{" "}
                          {getSpecialDateInfo(date)?.available ? (
                            <Badge className="bg-green-100 text-green-800">Available</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">Unavailable</Badge>
                          )}
                        </p>
                        <p className="text-sm mt-1">
                          <span className="font-medium">Reason:</span> {getSpecialDateInfo(date)?.reason}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Service Locations</CardTitle>
                  <CardDescription>Manage the areas where you provide veterinary services.</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setAddLocationDialogOpen(true)}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add Location
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {availability.locations.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No service locations added yet.</p>
                  <Button
                    className="mt-4 bg-green-600 hover:bg-green-700"
                    onClick={() => setAddLocationDialogOpen(true)}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Your First Location
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {availability.locations.map((location) => (
                    <div key={location.id} className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{location.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">{location.radius} km radius</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {location.isDefault ? (
                            <Badge className="bg-green-100 text-green-800">Default</Badge>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => setDefaultLocation(location.id)}>
                              Set as Default
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeLocation(location.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Services Offered</CardTitle>
                  <CardDescription>Manage the veterinary services you offer to farmers.</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setAddServiceDialogOpen(true)}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add Service
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {availability.services.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No services added yet.</p>
                  <Button
                    className="mt-4 bg-green-600 hover:bg-green-700"
                    onClick={() => setAddServiceDialogOpen(true)}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Your First Service
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {availability.services.map((service) => (
                    <div key={service.id} className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{service.name}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-500">{service.duration} minutes</span>
                            </div>
                            <div className="text-sm text-gray-500">{formatPrice(service.price)}</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeService(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Settings</CardTitle>
              <CardDescription>Configure general settings for your appointments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="buffer-time">Buffer Time Between Appointments (minutes)</Label>
                    <Input
                      id="buffer-time"
                      type="number"
                      min="0"
                      value={availability.bufferTime}
                      onChange={(e) => updateBufferTime(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Time between appointments for travel or preparation.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-appointments">Maximum Appointments Per Day</Label>
                    <Input
                      id="max-appointments"
                      type="number"
                      min="1"
                      value={availability.maxAppointmentsPerDay}
                      onChange={(e) => updateMaxAppointments(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Limit the number of appointments you can have in a day.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notice-required">Advance Notice Required (hours)</Label>
                  <Input
                    id="notice-required"
                    type="number"
                    min="0"
                    value={availability.noticeRequired}
                    onChange={(e) => updateNoticeRequired(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Minimum time in advance that farmers must book appointments.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={saveSettings} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Location Dialog */}
      <Dialog open={addLocationDialogOpen} onOpenChange={setAddLocationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Service Location</DialogTitle>
            <DialogDescription>Add a new location where you provide veterinary services.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="location-name">Location Name</Label>
              <Input
                id="location-name"
                placeholder="e.g., Kampala Central"
                value={newLocation.name}
                onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-radius">Service Radius (km)</Label>
              <Input
                id="service-radius"
                type="number"
                min="1"
                value={newLocation.radius}
                onChange={(e) => setNewLocation({ ...newLocation, radius: Number.parseInt(e.target.value) || 15 })}
              />
              <p className="text-sm text-muted-foreground">
                The maximum distance you're willing to travel from this location.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddLocationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addLocation} className="bg-green-600 hover:bg-green-700">
              Add Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Service Dialog */}
      <Dialog open={addServiceDialogOpen} onOpenChange={setAddServiceDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Service</DialogTitle>
            <DialogDescription>Add a new veterinary service that you offer to farmers.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Service Name</Label>
              <Input
                id="service-name"
                placeholder="e.g., Vaccination"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-duration">Duration (minutes)</Label>
              <Input
                id="service-duration"
                type="number"
                min="5"
                value={newService.duration}
                onChange={(e) => setNewService({ ...newService, duration: Number.parseInt(e.target.value) || 30 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-price">Price (UGX)</Label>
              <Input
                id="service-price"
                type="number"
                min="0"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddServiceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addService} className="bg-green-600 hover:bg-green-700">
              Add Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Special Date Dialog */}
      <Dialog open={addSpecialDateDialogOpen} onOpenChange={setAddSpecialDateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Special Date</DialogTitle>
            <DialogDescription>Mark a specific date as available or unavailable with a reason.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="special-date">Date</Label>
              <div className="border rounded-md p-4">
                <Calendar mode="single" selected={specialDate} onSelect={setSpecialDate} className="mx-auto" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="date-available" checked={specialDateAvailable} onCheckedChange={setSpecialDateAvailable} />
              <Label htmlFor="date-available">{specialDateAvailable ? "Available" : "Unavailable"}</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-reason">Reason</Label>
              <Textarea
                id="date-reason"
                placeholder="e.g., Public Holiday, Special Event, etc."
                value={specialDateReason}
                onChange={(e) => setSpecialDateReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSpecialDateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addSpecialDate} className="bg-green-600 hover:bg-green-700">
              Add Special Date
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

