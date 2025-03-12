"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MessageSquare, Users, Plus, Edit, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { KnowledgeHub } from "@/components/knowledge-hub"

export default function DashboardPage() {
  const { toast } = useToast()
  const [editingWelcome, setEditingWelcome] = useState(false)
  const [welcomeMessage, setWelcomeMessage] = useState("Welcome dear Farmer, here to serve you at your will")
  const [notes, setNotes] = useState<Array<{ id: number; text: string; date: string }>>([
    { id: 1, text: "Check on the cattle vaccination schedule", date: "Today" },
  ])
  const [newNote, setNewNote] = useState("")
  const [editingNote, setEditingNote] = useState<number | null>(null)
  const [editedNoteText, setEditedNoteText] = useState("")

  const saveWelcomeMessage = () => {
    setEditingWelcome(false)
    toast({
      title: "Welcome message updated",
      description: "Your custom welcome message has been saved.",
    })
  }

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { id: Date.now(), text: newNote, date: "Today" }])
      setNewNote("")
      toast({
        title: "Note added",
        description: "Your note has been added to the dashboard.",
      })
    }
  }

  const startEditingNote = (id: number, text: string) => {
    setEditingNote(id)
    setEditedNoteText(text)
  }

  const saveEditedNote = (id: number) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, text: editedNoteText } : note)))
    setEditingNote(null)
    toast({
      title: "Note updated",
      description: "Your note has been updated successfully.",
    })
  }

  const deleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id))
    toast({
      title: "Note deleted",
      description: "Your note has been removed from the dashboard.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your veterinary care.</p>

          {editingWelcome ? (
            <div className="mt-2 flex items-center gap-2">
              <Input
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                className="text-green-600 font-medium"
              />
              <Button size="sm" onClick={saveWelcomeMessage}>
                Save
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-green-600 font-medium mt-1">{welcomeMessage}</p>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingWelcome(true)}>
                <Edit className="h-3 w-3" />
                <span className="sr-only">Edit welcome message</span>
              </Button>
            </div>
          )}
        </div>
        <Link href="/dashboard/vets">
          <Button className="bg-green-600 hover:bg-green-700">Find a Vet</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Next: Tomorrow at 10:00 AM</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/appointments" className="text-xs text-blue-600 hover:underline">
              View all appointments
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">From Dr. Joseph Mukasa</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/messages" className="text-xs text-blue-600 hover:underline">
              View all messages
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vets Near You</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Within 25 km of your location</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/vets" className="text-xs text-blue-600 hover:underline">
              Find a vet
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 hrs</div>
            <p className="text-xs text-muted-foreground">-30 min from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader className="flex justify-between items-start">
            <div>
              <CardTitle>Upcoming Appointment</CardTitle>
              <CardDescription>Your next scheduled appointment.</CardDescription>
            </div>
            <Link href="/dashboard/appointments">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="flex-1">
                <div className="font-medium">Dr. Joseph Mukasa</div>
                <div className="text-sm text-gray-500">Large Animal Specialist</div>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <Calendar className="mr-1 h-4 w-4" />
                  Tomorrow, 10:00 AM
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/dashboard/appointments/1">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
                <Link href="/dashboard/messages/1">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Message
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="flex justify-between items-start">
            <div>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Add personal notes and reminders.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="flex items-start gap-2 p-3 rounded-md border">
                  {editingNote === note.id ? (
                    <div className="flex-1 space-y-2">
                      <Textarea
                        value={editedNoteText}
                        onChange={(e) => setEditedNoteText(e.target.value)}
                        className="min-h-[60px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingNote(null)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => saveEditedNote(note.id)}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p className="text-sm">{note.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{note.date}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => startEditingNote(note.id, note.text)}
                        >
                          <Edit className="h-3 w-3" />
                          <span className="sr-only">Edit note</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-600"
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="sr-only">Delete note</span>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              <div className="flex gap-2">
                <Input
                  placeholder="Add a new note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addNote()}
                />
                <Button onClick={addNote}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Hub */}
      <KnowledgeHub />
    </div>
  )
}

