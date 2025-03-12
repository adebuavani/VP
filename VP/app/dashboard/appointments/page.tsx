"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, MoreHorizontal, Edit, Check, X } from "lucide-react"
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

// Sample data for appointments
const initialAppointments = {
  upcoming: [
    {
      id: 1,
      vet: {
        name: "Dr. Joseph Mukasa",
        specialty: "Large Animal Specialist",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "Tomorrow",
      time: "10:00 AM",
      location: "Your Farm",
      status: "confirmed",
      notes: "Routine check-up for cattle and vaccination.",
    },
  ],
  past: [
    {
      id: 2,
      vet: {
        name: "Dr. David Okello",
        specialty: "General Veterinarian",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "Feb 28, 2023",
      time: "11:00 AM",
      location: "Your Farm",
      status: "completed",
      notes: "Treatment for cow with mastitis. Follow-up in 2 weeks.",
    },
  ],
}

export default function AppointmentsPage() {
  const { toast } = useToast()
  const [appointments, setAppointments] = useState(initialAppointments)
  const [editingNotes, setEditingNotes] = useState<number | null>(null)
  const [editedNotes, setEditedNotes] = useState("")
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false)
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<any>(null)
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")

  const handleCancelAppointment = (id: number) => {
    // Remove the appointment from upcoming
    setAppointments({
      ...appointments,
      upcoming: appointments.upcoming.filter((app) => app.id !== id),
    })

    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled successfully.",
    })
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
        title: "Missing information",
        description: "Please select both a date and time for rescheduling.",
        variant: "destructive",
      })
      return
    }

    // Update the appointment
    setAppointments({
      ...appointments,
      upcoming: appointments.upcoming.map((app) =>
        app.id === appointmentToReschedule.id ? { ...app, date: formatDate(newDate), time: newTime } : app,
      ),
    })

    toast({
      title: "Appointment Rescheduled",
      description: `Your appointment has been rescheduled to ${formatDate(newDate)} at ${newTime}.`,
    })

    setRescheduleDialogOpen(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
  }

  const startEditingNotes = (id: number, notes: string) => {
    setEditingNotes(id)
    setEditedNotes(notes)
  }

  const saveNotes = (id: number) => {
    // Update the notes for the appointment
    setAppointments({
      ...appointments,
      upcoming: appointments.upcoming.map((app) => (app.id === id ? { ...app, notes: editedNotes } : app)),
      past: appointments.past.map((app) => (app.id === id ? { ...app, notes: editedNotes } : app)),
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
        <p className="text-muted-foreground">Manage your scheduled appointments with veterinarians.</p>
      </div>

      <div className="flex justify-end">
        <Link href="/dashboard/vets">
          <Button className="bg-green-600 hover:bg-green-700">Book New Appointment</Button>
        </Link>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {appointments.upcoming.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">You have no upcoming appointments.</p>
                <Link href="/dashboard/vets">
                  <Button className="bg-green-600 hover:bg-green-700">Book an Appointment</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            appointments.upcoming.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={appointment.vet.avatar} alt={appointment.vet.name} />
                        <AvatarFallback>{appointment.vet.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{appointment.vet.name}</h3>
                        <p className="text-sm text-gray-500">{appointment.vet.specialty}</p>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{appointment.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{appointment.status}</Badge>
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
                          <DropdownMenuItem onClick={() => handleCancelAppointment(appointment.id)}>
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    {editingNotes === appointment.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editedNotes}
                          onChange={(e) => setEditedNotes(e.target.value)}
                          className="min-h-[80px]"
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
                        <p className="text-sm text-gray-500">{appointment.notes}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditingNotes(appointment.id, appointment.notes)}
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Edit Notes
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {appointments.past.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">You have no past appointments.</p>
              </CardContent>
            </Card>
          ) : (
            appointments.past.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={appointment.vet.avatar} alt={appointment.vet.name} />
                        <AvatarFallback>{appointment.vet.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{appointment.vet.name}</h3>
                        <p className="text-sm text-gray-500">{appointment.vet.specialty}</p>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{appointment.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-gray-100">
                        {appointment.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard/vets">Book Similar</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    {editingNotes === appointment.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editedNotes}
                          onChange={(e) => setEditedNotes(e.target.value)}
                          className="min-h-[80px]"
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
                        <p className="text-sm text-gray-500">{appointment.notes}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditingNotes(appointment.id, appointment.notes)}
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Edit Notes
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              {appointmentToReschedule && `Reschedule your appointment with ${appointmentToReschedule.vet.name}`}
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
                  <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                  <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                  <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                  <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                  <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                  <SelectItem value="3:00 PM">3:00 PM</SelectItem>
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

