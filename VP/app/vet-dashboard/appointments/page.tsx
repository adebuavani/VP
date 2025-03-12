"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  MapPin,
  MoreHorizontal,
  Edit,
  Check,
  X,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for appointments - in a real app, this would come from an API
const initialAppointments = {
  pending: [
    {
      id: 1,
      farmer: {
        id: "farmer-001",
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
        location: "Kampala, Uganda",
        phone: "+256 700 123 456",
      },
      date: "2023-12-15",
      time: "14:00",
      location: "Farmer's Location",
      status: "pending",
      animalType: "Dairy Cow",
      animalId: "COW-001",
      issue: "Vaccination for East Coast Fever",
      notes: "",
    },
    {
      id: 2,
      farmer: {
        id: "farmer-002",
        name: "Sarah Namuli",
        avatar: "/placeholder.svg?height=40&width=40",
        location: "Entebbe, Uganda",
        phone: "+256 701 234 567",
      },
      date: "2023-12-15",
      time: "16:30",
      location: "Farmer's Location",
      status: "pending",
      animalType: "Goats (5)",
      animalId: "GOAT-HERD-002",
      issue: "Routine health check and deworming",
      notes: "",
    },
  ],
  confirmed: [
    {
      id: 3,
      farmer: {
        id: "farmer-003",
        name: "David Okello",
        avatar: "/placeholder.svg?height=40&width=40",
        location: "Jinja, Uganda",
        phone: "+256 702 345 678",
      },
      date: "2023-12-16",
      time: "10:00",
      location: "Farmer's Location",
      status: "confirmed",
      animalType: "Poultry (200)",
      animalId: "POULTRY-FLOCK-003",
      issue: "Suspected Newcastle disease outbreak",
      notes: "Bring necessary vaccines and equipment for treatment",
    },
  ],
  completed: [
    {
      id: 4,
      farmer: {
        id: "farmer-004",
        name: "Mary Auma",
        avatar: "/placeholder.svg?height=40&width=40",
        location: "Mbale, Uganda",
        phone: "+256 703 456 789",
      },
      date: "2023-12-10",
      time: "09:00",
      location: "Farmer's Location",
      status: "completed",
      animalType: "Dairy Cow",
      animalId: "COW-004",
      issue: "Mastitis treatment",
      notes: "Follow-up in 7 days to check progress",
      diagnosis: "Acute mastitis in right rear quarter",
      treatment: "Administered intramammary antibiotics and anti-inflammatory medication",
    },
  ],
  cancelled: [
    {
      id: 5,
      farmer: {
        id: "farmer-005",
        name: "Peter Ochieng",
        avatar: "/placeholder.svg?height=40&width=40",
        location: "Gulu, Uganda",
        phone: "+256 704 567 890",
      },
      date: "2023-12-08",
      time: "14:00",
      location: "Farmer's Location",
      status: "cancelled",
      animalType: "Pig",
      animalId: "PIG-005",
      issue: "Suspected African Swine Fever",
      notes: "Cancelled due to scheduling conflict",
      cancellationReason: "Scheduling conflict - referred to Dr. Namuli",
    },
  ],
}

export default function AppointmentsPage() {
  const { toast } = useToast()
  const [appointments, setAppointments] = useState(initialAppointments)
  const [editingNotes, setEditingNotes] = useState<number | null>(null)
  const [editedNotes, setEditedNotes] = useState("")
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [appointmentToComplete, setAppointmentToComplete] = useState<any>(null)
  const [diagnosis, setDiagnosis] = useState("")
  const [treatment, setTreatment] = useState("")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState<any>(null)
  const [cancellationReason, setCancellationReason] = useState("")
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false)
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<any>(null)
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")

  const handleAcceptAppointment = (id: number) => {
    // Find the appointment
    const appointment = appointments.pending.find((app) => app.id === id)
    if (!appointment) return

    // Remove from pending and add to confirmed
    setAppointments({
      ...appointments,
      pending: appointments.pending.filter((app) => app.id !== id),
      confirmed: [...appointments.confirmed, { ...appointment, status: "confirmed" }],
    })

    toast({
      title: "Appointment Accepted",
      description: `You have accepted the appointment with ${appointment.farmer.name}.`,
    })

    // In a real app, this would trigger a notification to the farmer
    // and update the database via an API call
  }

  const handleDeclineAppointment = (appointment: any) => {
    setAppointmentToCancel(appointment)
    setCancellationReason("")
    setCancelDialogOpen(true)
  }

  const confirmCancellation = () => {
    if (!cancellationReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for cancellation.",
        variant: "destructive",
      })
      return
    }

    // Find the appointment in either pending or confirmed
    const isPending = appointments.pending.some((app) => app.id === appointmentToCancel.id)
    const isConfirmed = appointments.confirmed.some((app) => app.id === appointmentToCancel.id)

    const updatedAppointment = {
      ...appointmentToCancel,
      status: "cancelled",
      cancellationReason,
    }

    if (isPending) {
      setAppointments({
        ...appointments,
        pending: appointments.pending.filter((app) => app.id !== appointmentToCancel.id),
        cancelled: [...appointments.cancelled, updatedAppointment],
      })
    } else if (isConfirmed) {
      setAppointments({
        ...appointments,
        confirmed: appointments.confirmed.filter((app) => app.id !== appointmentToCancel.id),
        cancelled: [...appointments.cancelled, updatedAppointment],
      })
    }

    setCancelDialogOpen(false)

    toast({
      title: "Appointment Cancelled",
      description: `The appointment with ${appointmentToCancel.farmer.name} has been cancelled.`,
    })

    // In a real app, this would trigger a notification to the farmer
    // and update the database via an API call
  }

  const handleCompleteAppointment = (appointment: any) => {
    setAppointmentToComplete(appointment)
    setDiagnosis("")
    setTreatment("")
    setCompleteDialogOpen(true)
  }

  const confirmCompletion = () => {
    if (!diagnosis.trim() || !treatment.trim()) {
      toast({
        title: "Information Required",
        description: "Please provide both diagnosis and treatment information.",
        variant: "destructive",
      })
      return
    }

    const updatedAppointment = {
      ...appointmentToComplete,
      status: "completed",
      diagnosis,
      treatment,
    }

    setAppointments({
      ...appointments,
      confirmed: appointments.confirmed.filter((app) => app.id !== appointmentToComplete.id),
      completed: [...appointments.completed, updatedAppointment],
    })

    setCompleteDialogOpen(false)

    toast({
      title: "Appointment Completed",
      description: `The appointment with ${appointmentToComplete.farmer.name} has been marked as completed.`,
    })

    // In a real app, this would update the medical records
    // and notify the farmer via an API call
  }

  const handleRescheduleAppointment = (appointment: any) => {
    setAppointmentToReschedule(appointment)
    setNewDate("")
    setNewTime("")
    setRescheduleDialogOpen(true)
  }

  const confirmReschedule = () => {
    if (!newDate || !newTime) {
      toast({
        title: "Information Required",
        description: "Please select both a date and time for rescheduling.",
        variant: "destructive",
      })
      return
    }

    // Find if the appointment is in pending or confirmed
    const isPending = appointments.pending.some((app) => app.id === appointmentToReschedule.id)

    const updatedAppointment = {
      ...appointmentToReschedule,
      date: newDate,
      time: newTime,
    }

    if (isPending) {
      setAppointments({
        ...appointments,
        pending: appointments.pending.map((app) => (app.id === appointmentToReschedule.id ? updatedAppointment : app)),
      })
    } else {
      setAppointments({
        ...appointments,
        confirmed: appointments.confirmed.map((app) =>
          app.id === appointmentToReschedule.id ? updatedAppointment : app,
        ),
      })
    }

    setRescheduleDialogOpen(false)

    toast({
      title: "Appointment Rescheduled",
      description: `The appointment with ${appointmentToReschedule.farmer.name} has been rescheduled.`,
    })

    // In a real app, this would notify the farmer
    // and update the database via an API call
  }

  const startEditingNotes = (id: number, notes: string) => {
    setEditingNotes(id)
    setEditedNotes(notes)
  }

  const saveNotes = (id: number) => {
    // Find which category the appointment is in
    let category: "pending" | "confirmed" | "completed" | "cancelled" | null = null

    for (const cat of ["pending", "confirmed", "completed", "cancelled"] as const) {
      if (appointments[cat].some((app) => app.id === id)) {
        category = cat
        break
      }
    }

    if (!category) return

    // Update the notes
    setAppointments({
      ...appointments,
      [category]: appointments[category].map((app) => (app.id === id ? { ...app, notes: editedNotes } : app)),
    })

    setEditingNotes(null)

    toast({
      title: "Notes Updated",
      description: "Your appointment notes have been updated successfully.",
    })
  }

  const cancelEditingNotes = () => {
    setEditingNotes(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? "PM" : "AM"}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
        <p className="text-muted-foreground">Manage your appointments with farmers.</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="pending">
            Pending
            {appointments.pending.length > 0 && (
              <Badge className="ml-2 bg-yellow-500">{appointments.pending.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed
            {appointments.confirmed.length > 0 && (
              <Badge className="ml-2 bg-green-500">{appointments.confirmed.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Appointments</CardTitle>
              <CardDescription>Review and respond to appointment requests from farmers.</CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.pending.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No pending appointment requests.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.pending.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={appointment.farmer.avatar} alt={appointment.farmer.name} />
                              <AvatarFallback>{appointment.farmer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{appointment.farmer.name}</h3>
                              <p className="text-sm text-gray-500">{appointment.farmer.phone}</p>
                              <p className="text-sm text-gray-500">{appointment.farmer.location}</p>
                            </div>
                          </div>

                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{formatDate(appointment.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{formatTime(appointment.time)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{appointment.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleRescheduleAppointment(appointment)}>
                                  Reschedule
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/vet-dashboard/messages?farmer=${appointment.farmer.id}`}>
                                    Message Farmer
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium">Animal Type</h4>
                              <p className="text-sm">{appointment.animalType}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Animal ID</h4>
                              <p className="text-sm">{appointment.animalId}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-sm font-medium">Issue</h4>
                            <p className="text-sm">{appointment.issue}</p>
                          </div>

                          {editingNotes === appointment.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editedNotes}
                                onChange={(e) => setEditedNotes(e.target.value)}
                                className="min-h-[80px]"
                                placeholder="Add notes about this appointment..."
                              />
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={cancelEditingNotes}>
                                  <X className="mr-1 h-3 w-3" />
                                  Cancel
                                </Button>
                                <Button size="sm" onClick={() => saveNotes(appointment.id)}>
                                  <Check className="mr-1 h-3 w-3" />
                                  Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-sm font-medium">Notes</h4>
                                <p className="text-sm text-gray-500">{appointment.notes || "No notes added yet."}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditingNotes(appointment.id, appointment.notes)}
                              >
                                <Edit className="mr-1 h-3 w-3" />
                                {appointment.notes ? "Edit Notes" : "Add Notes"}
                              </Button>
                            </div>
                          )}

                          <div className="flex justify-end mt-4 gap-2">
                            <Button
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeclineAppointment(appointment)}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Decline
                            </Button>
                            <Button
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleAcceptAppointment(appointment.id)}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Accept
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Confirmed Appointments</CardTitle>
              <CardDescription>Your upcoming scheduled appointments.</CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.confirmed.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No confirmed appointments.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.confirmed.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={appointment.farmer.avatar} alt={appointment.farmer.name} />
                              <AvatarFallback>{appointment.farmer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{appointment.farmer.name}</h3>
                              <p className="text-sm text-gray-500">{appointment.farmer.phone}</p>
                              <p className="text-sm text-gray-500">{appointment.farmer.location}</p>
                            </div>
                          </div>

                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{formatDate(appointment.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{formatTime(appointment.time)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{appointment.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleRescheduleAppointment(appointment)}>
                                  Reschedule
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeclineAppointment(appointment)}>
                                  Cancel
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/vet-dashboard/messages?farmer=${appointment.farmer.id}`}>
                                    Message Farmer
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium">Animal Type</h4>
                              <p className="text-sm">{appointment.animalType}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Animal ID</h4>
                              <p className="text-sm">{appointment.animalId}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-sm font-medium">Issue</h4>
                            <p className="text-sm">{appointment.issue}</p>
                          </div>

                          {editingNotes === appointment.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editedNotes}
                                onChange={(e) => setEditedNotes(e.target.value)}
                                className="min-h-[80px]"
                                placeholder="Add notes about this appointment..."
                              />
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={cancelEditingNotes}>
                                  <X className="mr-1 h-3 w-3" />
                                  Cancel
                                </Button>
                                <Button size="sm" onClick={() => saveNotes(appointment.id)}>
                                  <Check className="mr-1 h-3 w-3" />
                                  Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-sm font-medium">Notes</h4>
                                <p className="text-sm text-gray-500">{appointment.notes || "No notes added yet."}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditingNotes(appointment.id, appointment.notes)}
                              >
                                <Edit className="mr-1 h-3 w-3" />
                                {appointment.notes ? "Edit Notes" : "Add Notes"}
                              </Button>
                            </div>
                          )}

                          <div className="flex justify-end mt-4 gap-2">
                            <Link href={`/vet-dashboard/messages?farmer=${appointment.farmer.id}`}>
                              <Button variant="outline">
                                <MessageSquare className="mr-1 h-4 w-4" />
                                Message
                              </Button>
                            </Link>
                            <Button
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleCompleteAppointment(appointment)}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Complete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Appointments</CardTitle>
              <CardDescription>History of appointments you've completed.</CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.completed.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No completed appointments.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.completed.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={appointment.farmer.avatar} alt={appointment.farmer.name} />
                              <AvatarFallback>{appointment.farmer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{appointment.farmer.name}</h3>
                              <p className="text-sm text-gray-500">{appointment.farmer.location}</p>
                            </div>
                          </div>

                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{formatDate(appointment.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{formatTime(appointment.time)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{appointment.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium">Animal Type</h4>
                              <p className="text-sm">{appointment.animalType}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Animal ID</h4>
                              <p className="text-sm">{appointment.animalId}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-sm font-medium">Issue</h4>
                            <p className="text-sm">{appointment.issue}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium">Diagnosis</h4>
                              <p className="text-sm">{appointment.diagnosis}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Treatment</h4>
                              <p className="text-sm">{appointment.treatment}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium">Notes</h4>
                            <p className="text-sm text-gray-500">{appointment.notes || "No notes added."}</p>
                          </div>

                          <div className="flex justify-end mt-4 gap-2">
                            <Link href={`/vet-dashboard/medical-records?animal=${appointment.animalId}`}>
                              <Button variant="outline">View Medical Record</Button>
                            </Link>
                            <Link href={`/vet-dashboard/messages?farmer=${appointment.farmer.id}`}>
                              <Button className="bg-green-600 hover:bg-green-700">
                                <MessageSquare className="mr-1 h-4 w-4" />
                                Message Farmer
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cancelled Appointments</CardTitle>
              <CardDescription>Appointments that were cancelled.</CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.cancelled.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No cancelled appointments.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.cancelled.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={appointment.farmer.avatar} alt={appointment.farmer.name} />
                              <AvatarFallback>{appointment.farmer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{appointment.farmer.name}</h3>
                              <p className="text-sm text-gray-500">{appointment.farmer.location}</p>
                            </div>
                          </div>

                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{formatDate(appointment.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{formatTime(appointment.time)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{appointment.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium">Animal Type</h4>
                              <p className="text-sm">{appointment.animalType}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Animal ID</h4>
                              <p className="text-sm">{appointment.animalId}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-sm font-medium">Issue</h4>
                            <p className="text-sm">{appointment.issue}</p>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-sm font-medium">Cancellation Reason</h4>
                            <p className="text-sm text-red-600">{appointment.cancellationReason}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium">Notes</h4>
                            <p className="text-sm text-gray-500">{appointment.notes || "No notes added."}</p>
                          </div>

                          <div className="flex justify-end mt-4">
                            <Link href={`/vet-dashboard/messages?farmer=${appointment.farmer.id}`}>
                              <Button variant="outline">
                                <MessageSquare className="mr-1 h-4 w-4" />
                                Message Farmer
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Complete Appointment Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Appointment</DialogTitle>
            <DialogDescription>
              {appointmentToComplete &&
                `Record diagnosis and treatment for ${appointmentToComplete.farmer.name}'s ${appointmentToComplete.animalType}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea
                id="diagnosis"
                placeholder="Enter your diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment</Label>
              <Textarea
                id="treatment"
                placeholder="Enter the treatment provided"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmCompletion} className="bg-green-600 hover:bg-green-700">
              Complete Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Appointment Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              {appointmentToCancel &&
                `Please provide a reason for cancelling the appointment with ${appointmentToCancel.farmer.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancellation-reason">Cancellation Reason</Label>
              <Textarea
                id="cancellation-reason"
                placeholder="Enter reason for cancellation"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Back
            </Button>
            <Button variant="destructive" onClick={confirmCancellation}>
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Appointment Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              {appointmentToReschedule && `Reschedule appointment with ${appointmentToReschedule.farmer.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-date">New Date</Label>
              <Input
                id="new-date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-time">New Time</Label>
              <Select value={newTime} onValueChange={setNewTime}>
                <SelectTrigger id="new-time">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="13:00">1:00 PM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                  <SelectItem value="17:00">5:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmReschedule} className="bg-green-600 hover:bg-green-700">
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

