"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MessageSquare, Users, Edit, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// This would be replaced with API calls in a real implementation
const initialAppointments = [
  {
    id: 1,
    farmer: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Kampala, Uganda",
    },
    date: "Today",
    time: "2:00 PM",
    status: "pending",
    animalType: "Dairy Cow",
    issue: "Vaccination for East Coast Fever",
    notes: "",
  },
  {
    id: 2,
    farmer: {
      name: "Sarah Namuli",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Entebbe, Uganda",
    },
    date: "Today",
    time: "4:30 PM",
    status: "pending",
    animalType: "Goats (5)",
    issue: "Routine health check and deworming",
    notes: "",
  },
  {
    id: 3,
    farmer: {
      name: "David Okello",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Jinja, Uganda",
    },
    date: "Tomorrow",
    time: "10:00 AM",
    status: "confirmed",
    animalType: "Poultry (200)",
    issue: "Suspected Newcastle disease outbreak",
    notes: "Bring necessary vaccines and equipment for treatment",
  },
]

export default function VetDashboardPage() {
  const { toast } = useToast()
  const [isAvailable, setIsAvailable] = useState(true)
  const [appointments, setAppointments] = useState(initialAppointments)
  const [statusCounts, setStatusCounts] = useState({
    pending: 2,
    confirmed: 1,
    completed: 5,
    cancelled: 1,
  })
  const [editingNote, setEditingNote] = useState<number | null>(null)
  const [noteText, setNoteText] = useState("")

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable)

    toast({
      title: isAvailable ? "You are now unavailable" : "You are now available",
      description: isAvailable
        ? "Farmers will not be able to book new appointments with you."
        : "Farmers can now book appointments with you.",
    })
  }

  const updateAppointmentStatus = (id: number, status: "confirmed" | "cancelled") => {
    setAppointments(
      appointments.map((appointment) => (appointment.id === id ? { ...appointment, status } : appointment)),
    )

    // Update status counts
    if (status === "confirmed") {
      setStatusCounts({
        ...statusCounts,
        pending: statusCounts.pending - 1,
        confirmed: statusCounts.confirmed + 1,
      })
    } else if (status === "cancelled") {
      setStatusCounts({
        ...statusCounts,
        pending: statusCounts.pending - 1,
        cancelled: statusCounts.cancelled + 1,
      })
    }

    toast({
      title: `Appointment ${status}`,
      description: `The appointment has been ${status}.`,
    })
  }

  const startEditingNote = (id: number, currentNote: string) => {
    setEditingNote(id)
    setNoteText(currentNote)
  }

  const saveNote = (id: number) => {
    setAppointments(
      appointments.map((appointment) => (appointment.id === id ? { ...appointment, notes: noteText } : appointment)),
    )
    setEditingNote(null)

    toast({
      title: "Note saved",
      description: "Your note has been saved successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vet Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, Dr. Mukasa! Here's an overview of your practice.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="availability" checked={isAvailable} onCheckedChange={toggleAvailability} />
            <Label htmlFor="availability" className="font-medium">
              {isAvailable ? "Available" : "Unavailable"}
            </Label>
          </div>
          <Link href="/vet-dashboard/availability">
            <Button variant="outline">Manage Schedule</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Next: 2:00 PM with John Doe</p>
          </CardContent>
          <CardFooter>
            <Link href="/vet-dashboard/appointments" className="text-xs text-blue-600 hover:underline">
              View all appointments
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
            <p className="text-xs text-muted-foreground">Requires your confirmation</p>
          </CardContent>
          <CardFooter>
            <Link href="/vet-dashboard/appointments?filter=pending" className="text-xs text-blue-600 hover:underline">
              Review pending requests
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">From 2 different farmers</p>
          </CardContent>
          <CardFooter>
            <Link href="/vet-dashboard/messages" className="text-xs text-blue-600 hover:underline">
              View all messages
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Across 8 farms</p>
          </CardContent>
          <CardFooter>
            <Link href="/vet-dashboard/patients" className="text-xs text-blue-600 hover:underline">
              View all patients
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Requests</CardTitle>
            <CardDescription>Review and manage pending appointment requests.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.filter((a) => a.status === "pending").length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No pending appointment requests.</p>
            ) : (
              appointments
                .filter((a) => a.status === "pending")
                .map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={appointment.farmer.avatar} alt={appointment.farmer.name} />
                        <AvatarFallback>{appointment.farmer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{appointment.farmer.name}</h4>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                            Pending
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{appointment.farmer.location}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>
                              {appointment.date}, {appointment.time}
                            </span>
                          </div>
                          <p className="text-sm">
                            <span className="font-medium">Animal:</span> {appointment.animalType}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Issue:</span> {appointment.issue}
                          </p>
                        </div>
                      </div>
                    </div>

                    {editingNote === appointment.id ? (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Add notes about this appointment..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingNote(null)}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={() => saveNote(appointment.id)}>
                            Save Note
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditingNote(appointment.id, appointment.notes)}
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Add Note
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Accept
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
            )}
          </CardContent>
          <CardFooter>
            <Link href="/vet-dashboard/appointments">
              <Button variant="outline" className="w-full">
                View All Appointments
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription>Your confirmed appointments for today and tomorrow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.filter((a) => a.status === "confirmed").length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No confirmed appointments.</p>
            ) : (
              appointments
                .filter((a) => a.status === "confirmed")
                .map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={appointment.farmer.avatar} alt={appointment.farmer.name} />
                        <AvatarFallback>{appointment.farmer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{appointment.farmer.name}</h4>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Confirmed
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{appointment.farmer.location}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>
                              {appointment.date}, {appointment.time}
                            </span>
                          </div>
                          <p className="text-sm">
                            <span className="font-medium">Animal:</span> {appointment.animalType}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Issue:</span> {appointment.issue}
                          </p>
                          {appointment.notes && (
                            <p className="text-sm mt-2 italic">
                              <span className="font-medium">Notes:</span> {appointment.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4 gap-2">
                      <Link
                        href={`/vet-dashboard/messages?farmer=${appointment.farmer.name.toLowerCase().replace(" ", "-")}`}
                      >
                        <Button variant="outline" size="sm">
                          <MessageSquare className="mr-1 h-4 w-4" />
                          Message
                        </Button>
                      </Link>
                      <Link href={`/vet-dashboard/appointments/${appointment.id}`}>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
            )}
          </CardContent>
          <CardFooter>
            <Link href="/vet-dashboard/availability">
              <Button variant="outline" className="w-full">
                Manage Availability
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Summary of your veterinary practice activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.confirmed}</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.completed}</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</p>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-medium mb-2">Recent Activity</h4>
              <ul className="space-y-2">
                <li className="text-sm flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span>You confirmed an appointment with David Okello for tomorrow at 10:00 AM.</span>
                </li>
                <li className="text-sm flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  <span>You completed a vaccination appointment with Mary Auma.</span>
                </li>
                <li className="text-sm flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                  <span>You received 2 new appointment requests.</span>
                </li>
                <li className="text-sm flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  <span>You declined an appointment due to schedule conflict.</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

