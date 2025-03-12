"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Edit, FileText, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Initial health records data
const initialRecords = [
  {
    id: 1,
    animalId: "COW-001",
    animalType: "Dairy Cow",
    animalName: "Bessie",
    recordType: "Vaccination",
    date: "2023-12-15",
    description: "Annual vaccination against East Coast Fever",
    vet: "Dr. Joseph Mukasa",
    notes: "Animal responded well to vaccination. Next dose due in 12 months.",
  },
  {
    id: 2,
    animalId: "COW-002",
    animalType: "Dairy Cow",
    animalName: "Daisy",
    recordType: "Treatment",
    date: "2024-01-10",
    description: "Treatment for mastitis",
    vet: "Dr. Sarah Namuli",
    notes: "Administered antibiotics. Follow-up in 7 days to check progress.",
  },
]

// Initial animals data
const initialAnimals = [
  {
    id: "COW-001",
    name: "Bessie",
    type: "Dairy Cow",
    breed: "Holstein",
    birthDate: "2020-05-12",
    gender: "Female",
  },
  {
    id: "COW-002",
    name: "Daisy",
    type: "Dairy Cow",
    breed: "Jersey",
    birthDate: "2021-03-18",
    gender: "Female",
  },
  {
    id: "GOAT-001",
    name: "Billy",
    type: "Goat",
    breed: "Boer",
    birthDate: "2022-01-05",
    gender: "Male",
  },
]

export default function HealthRecordsPage() {
  const { toast } = useToast()
  const [records, setRecords] = useState(initialRecords)
  const [animals, setAnimals] = useState(initialAnimals)
  const [addRecordDialogOpen, setAddRecordDialogOpen] = useState(false)
  const [addAnimalDialogOpen, setAddAnimalDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<number | null>(null)
  const [editingAnimal, setEditingAnimal] = useState<string | null>(null)
  const [newRecord, setNewRecord] = useState({
    animalId: "",
    recordType: "",
    date: "",
    description: "",
    vet: "",
    notes: "",
  })
  const [newAnimal, setNewAnimal] = useState({
    id: "",
    name: "",
    type: "",
    breed: "",
    birthDate: "",
    gender: "",
  })
  const [editedRecord, setEditedRecord] = useState<any>(null)
  const [editedAnimal, setEditedAnimal] = useState<any>(null)
  const [viewRecordDetails, setViewRecordDetails] = useState<any>(null)
  const [recordDetailsOpen, setRecordDetailsOpen] = useState(false)

  // Record functions
  const openAddRecordDialog = () => {
    setNewRecord({
      animalId: animals.length > 0 ? animals[0].id : "",
      recordType: "Vaccination",
      date: new Date().toISOString().split("T")[0],
      description: "",
      vet: "",
      notes: "",
    })
    setAddRecordDialogOpen(true)
  }

  const addRecord = () => {
    if (!newRecord.animalId || !newRecord.recordType || !newRecord.date || !newRecord.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const animal = animals.find((a) => a.id === newRecord.animalId)

    const recordToAdd = {
      id: Date.now(),
      ...newRecord,
      animalName: animal ? animal.name : "",
      animalType: animal ? animal.type : "",
    }

    setRecords([...records, recordToAdd])
    setAddRecordDialogOpen(false)

    toast({
      title: "Record added",
      description: "The health record has been added successfully.",
    })
  }

  const startEditingRecord = (record: any) => {
    setEditingRecord(record.id)
    setEditedRecord({ ...record })
  }

  const cancelEditingRecord = () => {
    setEditingRecord(null)
    setEditedRecord(null)
  }

  const saveEditedRecord = () => {
    if (!editedRecord.animalId || !editedRecord.recordType || !editedRecord.date || !editedRecord.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const animal = animals.find((a) => a.id === editedRecord.animalId)

    const updatedRecord = {
      ...editedRecord,
      animalName: animal ? animal.name : "",
      animalType: animal ? animal.type : "",
    }

    setRecords(records.map((record) => (record.id === editingRecord ? updatedRecord : record)))

    setEditingRecord(null)
    setEditedRecord(null)

    toast({
      title: "Record updated",
      description: "The health record has been updated successfully.",
    })
  }

  const deleteRecord = (id: number) => {
    setRecords(records.filter((record) => record.id !== id))

    toast({
      title: "Record deleted",
      description: "The health record has been deleted successfully.",
    })
  }

  const viewRecord = (record: any) => {
    setViewRecordDetails(record)
    setRecordDetailsOpen(true)
  }

  // Animal functions
  const openAddAnimalDialog = () => {
    setNewAnimal({
      id: `ANIMAL-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      name: "",
      type: "",
      breed: "",
      birthDate: "",
      gender: "",
    })
    setAddAnimalDialogOpen(true)
  }

  const addAnimal = () => {
    if (!newAnimal.id || !newAnimal.name || !newAnimal.type) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (animals.some((animal) => animal.id === newAnimal.id)) {
      toast({
        title: "Duplicate ID",
        description: "An animal with this ID already exists.",
        variant: "destructive",
      })
      return
    }

    setAnimals([...animals, newAnimal])
    setAddAnimalDialogOpen(false)

    toast({
      title: "Animal added",
      description: "The animal has been added successfully.",
    })
  }

  const startEditingAnimal = (animal: any) => {
    setEditingAnimal(animal.id)
    setEditedAnimal({ ...animal })
  }

  const cancelEditingAnimal = () => {
    setEditingAnimal(null)
    setEditedAnimal(null)
  }

  const saveEditedAnimal = () => {
    if (!editedAnimal.id || !editedAnimal.name || !editedAnimal.type) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Update animal in animals list
    setAnimals(animals.map((animal) => (animal.id === editingAnimal ? editedAnimal : animal)))

    // Update animal info in records
    setRecords(
      records.map((record) =>
        record.animalId === editingAnimal
          ? {
              ...record,
              animalName: editedAnimal.name,
              animalType: editedAnimal.type,
            }
          : record,
      ),
    )

    setEditingAnimal(null)
    setEditedAnimal(null)

    toast({
      title: "Animal updated",
      description: "The animal information has been updated successfully.",
    })
  }

  const deleteAnimal = (id: string) => {
    // Check if there are records for this animal
    if (records.some((record) => record.animalId === id)) {
      toast({
        title: "Cannot delete",
        description: "This animal has health records. Delete the records first.",
        variant: "destructive",
      })
      return
    }

    setAnimals(animals.filter((animal) => animal.id !== id))

    toast({
      title: "Animal deleted",
      description: "The animal has been deleted successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Health Records</h2>
        <p className="text-muted-foreground">Manage health records for your livestock.</p>
      </div>

      <Tabs defaultValue="records" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="records">Health Records</TabsTrigger>
            <TabsTrigger value="animals">Animals</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button onClick={openAddRecordDialog} className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-1 h-4 w-4" />
              Add Record
            </Button>
            <Button onClick={openAddAnimalDialog} variant="outline">
              <Plus className="mr-1 h-4 w-4" />
              Add Animal
            </Button>
          </div>
        </div>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Records</CardTitle>
              <CardDescription>View and manage health records for your livestock.</CardDescription>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">No health records found.</p>
                  <Button onClick={openAddRecordDialog} className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Your First Record
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Animal</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Record Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {record.animalName} ({record.animalId})
                          </TableCell>
                          <TableCell>{record.animalType}</TableCell>
                          <TableCell>{record.recordType}</TableCell>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell className="max-w-xs truncate">{record.description}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => viewRecord(record)}>
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => startEditingRecord(record)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => deleteRecord(record.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="animals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Animals</CardTitle>
              <CardDescription>Manage your livestock inventory.</CardDescription>
            </CardHeader>
            <CardContent>
              {animals.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">No animals found.</p>
                  <Button onClick={openAddAnimalDialog} className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Your First Animal
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Breed</TableHead>
                        <TableHead>Birth Date</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {animals.map((animal) => (
                        <TableRow key={animal.id}>
                          <TableCell className="font-medium">{animal.id}</TableCell>
                          <TableCell>{animal.name}</TableCell>
                          <TableCell>{animal.type}</TableCell>
                          <TableCell>{animal.breed}</TableCell>
                          <TableCell>
                            {animal.birthDate ? new Date(animal.birthDate).toLocaleDateString() : "-"}
                          </TableCell>
                          <TableCell>{animal.gender}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => startEditingAnimal(animal)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => deleteAnimal(animal.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Record Dialog */}
      <Dialog open={addRecordDialogOpen} onOpenChange={setAddRecordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Health Record</DialogTitle>
            <DialogDescription>Add a new health record for your livestock.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="animal-id">Animal</Label>
              <Select
                value={newRecord.animalId}
                onValueChange={(value) => setNewRecord({ ...newRecord, animalId: value })}
              >
                <SelectTrigger id="animal-id">
                  <SelectValue placeholder="Select animal" />
                </SelectTrigger>
                <SelectContent>
                  {animals.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id}>
                      {animal.name} ({animal.id}) - {animal.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="record-type">Record Type</Label>
              <Select
                value={newRecord.recordType}
                onValueChange={(value) => setNewRecord({ ...newRecord, recordType: value })}
              >
                <SelectTrigger id="record-type">
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vaccination">Vaccination</SelectItem>
                  <SelectItem value="Treatment">Treatment</SelectItem>
                  <SelectItem value="Examination">Examination</SelectItem>
                  <SelectItem value="Surgery">Surgery</SelectItem>
                  <SelectItem value="Deworming">Deworming</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newRecord.date}
                onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the health record"
                value={newRecord.description}
                onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vet">Veterinarian</Label>
              <Input
                id="vet"
                placeholder="Name of the veterinarian"
                value={newRecord.vet}
                onChange={(e) => setNewRecord({ ...newRecord, vet: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes"
                value={newRecord.notes}
                onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRecordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addRecord} className="bg-green-600 hover:bg-green-700">
              Add Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Animal Dialog */}
      <Dialog open={addAnimalDialogOpen} onOpenChange={setAddAnimalDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Animal</DialogTitle>
            <DialogDescription>Add a new animal to your livestock inventory.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="animal-id">ID</Label>
              <Input
                id="animal-id"
                placeholder="Unique identifier"
                value={newAnimal.id}
                onChange={(e) => setNewAnimal({ ...newAnimal, id: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="animal-name">Name</Label>
              <Input
                id="animal-name"
                placeholder="Animal name"
                value={newAnimal.name}
                onChange={(e) => setNewAnimal({ ...newAnimal, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="animal-type">Type</Label>
              <Select value={newAnimal.type} onValueChange={(value) => setNewAnimal({ ...newAnimal, type: value })}>
                <SelectTrigger id="animal-type">
                  <SelectValue placeholder="Select animal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dairy Cow">Dairy Cow</SelectItem>
                  <SelectItem value="Beef Cattle">Beef Cattle</SelectItem>
                  <SelectItem value="Goat">Goat</SelectItem>
                  <SelectItem value="Sheep">Sheep</SelectItem>
                  <SelectItem value="Pig">Pig</SelectItem>
                  <SelectItem value="Chicken">Chicken</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="animal-breed">Breed</Label>
              <Input
                id="animal-breed"
                placeholder="Animal breed"
                value={newAnimal.breed}
                onChange={(e) => setNewAnimal({ ...newAnimal, breed: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth-date">Birth Date</Label>
              <Input
                id="birth-date"
                type="date"
                value={newAnimal.birthDate}
                onChange={(e) => setNewAnimal({ ...newAnimal, birthDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={newAnimal.gender} onValueChange={(value) => setNewAnimal({ ...newAnimal, gender: value })}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddAnimalDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addAnimal} className="bg-green-600 hover:bg-green-700">
              Add Animal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Record Dialog */}
      {editingRecord && (
        <Dialog open={editingRecord !== null} onOpenChange={(open) => !open && cancelEditingRecord()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Health Record</DialogTitle>
              <DialogDescription>Update the health record information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-animal-id">Animal</Label>
                <Select
                  value={editedRecord.animalId}
                  onValueChange={(value) => setEditedRecord({ ...editedRecord, animalId: value })}
                >
                  <SelectTrigger id="edit-animal-id">
                    <SelectValue placeholder="Select animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {animals.map((animal) => (
                      <SelectItem key={animal.id} value={animal.id}>
                        {animal.name} ({animal.id}) - {animal.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-record-type">Record Type</Label>
                <Select
                  value={editedRecord.recordType}
                  onValueChange={(value) => setEditedRecord({ ...editedRecord, recordType: value })}
                >
                  <SelectTrigger id="edit-record-type">
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vaccination">Vaccination</SelectItem>
                    <SelectItem value="Treatment">Treatment</SelectItem>
                    <SelectItem value="Examination">Examination</SelectItem>
                    <SelectItem value="Surgery">Surgery</SelectItem>
                    <SelectItem value="Deworming">Deworming</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editedRecord.date}
                  onChange={(e) => setEditedRecord({ ...editedRecord, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editedRecord.description}
                  onChange={(e) => setEditedRecord({ ...editedRecord, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-vet">Veterinarian</Label>
                <Input
                  id="edit-vet"
                  value={editedRecord.vet}
                  onChange={(e) => setEditedRecord({ ...editedRecord, vet: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editedRecord.notes}
                  onChange={(e) => setEditedRecord({ ...editedRecord, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={cancelEditingRecord}>
                Cancel
              </Button>
              <Button onClick={saveEditedRecord} className="bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Animal Dialog */}
      {editingAnimal && (
        <Dialog open={editingAnimal !== null} onOpenChange={(open) => !open && cancelEditingAnimal()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Animal</DialogTitle>
              <DialogDescription>Update the animal information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-animal-id">ID</Label>
                <Input id="edit-animal-id" value={editedAnimal.id} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-animal-name">Name</Label>
                <Input
                  id="edit-animal-name"
                  value={editedAnimal.name}
                  onChange={(e) => setEditedAnimal({ ...editedAnimal, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-animal-type">Type</Label>
                <Select
                  value={editedAnimal.type}
                  onValueChange={(value) => setEditedAnimal({ ...editedAnimal, type: value })}
                >
                  <SelectTrigger id="edit-animal-type">
                    <SelectValue placeholder="Select animal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dairy Cow">Dairy Cow</SelectItem>
                    <SelectItem value="Beef Cattle">Beef Cattle</SelectItem>
                    <SelectItem value="Goat">Goat</SelectItem>
                    <SelectItem value="Sheep">Sheep</SelectItem>
                    <SelectItem value="Pig">Pig</SelectItem>
                    <SelectItem value="Chicken">Chicken</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-animal-breed">Breed</Label>
                <Input
                  id="edit-animal-breed"
                  value={editedAnimal.breed}
                  onChange={(e) => setEditedAnimal({ ...editedAnimal, breed: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-birth-date">Birth Date</Label>
                <Input
                  id="edit-birth-date"
                  type="date"
                  value={editedAnimal.birthDate}
                  onChange={(e) => setEditedAnimal({ ...editedAnimal, birthDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-gender">Gender</Label>
                <Select
                  value={editedAnimal.gender}
                  onValueChange={(value) => setEditedAnimal({ ...editedAnimal, gender: value })}
                >
                  <SelectTrigger id="edit-gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={cancelEditingAnimal}>
                Cancel
              </Button>
              <Button onClick={saveEditedAnimal} className="bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* View Record Details Dialog */}
      <Dialog open={recordDetailsOpen} onOpenChange={setRecordDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Health Record Details</DialogTitle>
            <DialogDescription>
              {viewRecordDetails && `Record for ${viewRecordDetails.animalName} (${viewRecordDetails.animalId})`}
            </DialogDescription>
          </DialogHeader>
          {viewRecordDetails && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Animal</h4>
                  <p className="text-sm">
                    {viewRecordDetails.animalName} ({viewRecordDetails.animalId})
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Animal Type</h4>
                  <p className="text-sm">{viewRecordDetails.animalType}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Record Type</h4>
                  <p className="text-sm">{viewRecordDetails.recordType}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Date</h4>
                  <p className="text-sm">{new Date(viewRecordDetails.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm">{viewRecordDetails.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Veterinarian</h4>
                <p className="text-sm">{viewRecordDetails.vet || "Not specified"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Notes</h4>
                <p className="text-sm">{viewRecordDetails.notes || "No notes"}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setRecordDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

