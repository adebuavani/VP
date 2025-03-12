"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Plus, Save, Trash2, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

// Initial disease data
const initialDiseases = [
  {
    id: 1,
    name: "East Coast Fever",
    description: "A tick-borne disease affecting cattle in Uganda.",
    symptoms: "High fever, swollen lymph nodes, difficulty breathing, and nasal discharge.",
    treatment: "Early treatment with antiprotozoal drugs like buparvaquone. Consult a vet immediately upon suspicion.",
    prevention:
      "Regular tick control through dipping or spraying cattle with acaricides. Immunization is also available.",
  },
  {
    id: 2,
    name: "Foot and Mouth Disease",
    description: "A highly contagious viral disease affecting cloven-hoofed animals.",
    symptoms: "Fever, blisters on the mouth, tongue, feet, and teats. Excessive salivation and lameness.",
    treatment: "No specific treatment. Supportive care to prevent secondary infections.",
    prevention: "Regular vaccination. Strict biosecurity measures and movement control during outbreaks.",
  },
  {
    id: 3,
    name: "Brucellosis",
    description: "A bacterial infection that affects cattle, goats, and other livestock.",
    symptoms: "Abortions in females, swollen testicles in males, reduced milk production, and infertility.",
    treatment: "Antibiotics can be used, but infected animals are often culled to prevent spread.",
    prevention:
      "Vaccination of young animals. Testing and removal of infected animals. Proper disposal of aborted fetuses.",
  },
]

export function KnowledgeHub() {
  const { toast } = useToast()
  const [diseases, setDiseases] = useState(initialDiseases)
  const [editingDisease, setEditingDisease] = useState<number | null>(null)
  const [editedDisease, setEditedDisease] = useState<any>(null)
  const [addingDisease, setAddingDisease] = useState(false)
  const [newDisease, setNewDisease] = useState({
    name: "",
    description: "",
    symptoms: "",
    treatment: "",
    prevention: "",
  })

  const startEditing = (disease: any) => {
    setEditingDisease(disease.id)
    setEditedDisease({ ...disease })
  }

  const cancelEditing = () => {
    setEditingDisease(null)
    setEditedDisease(null)
  }

  const saveEdited = () => {
    if (!editedDisease.name.trim()) {
      toast({
        title: "Error",
        description: "Disease name cannot be empty",
        variant: "destructive",
      })
      return
    }

    setDiseases(diseases.map((disease) => (disease.id === editingDisease ? editedDisease : disease)))
    setEditingDisease(null)
    setEditedDisease(null)

    toast({
      title: "Disease information updated",
      description: "The disease information has been updated successfully.",
    })
  }

  const startAddingDisease = () => {
    setAddingDisease(true)
    setNewDisease({
      name: "",
      description: "",
      symptoms: "",
      treatment: "",
      prevention: "",
    })
  }

  const cancelAddingDisease = () => {
    setAddingDisease(false)
  }

  const addDisease = () => {
    if (!newDisease.name.trim()) {
      toast({
        title: "Error",
        description: "Disease name cannot be empty",
        variant: "destructive",
      })
      return
    }

    const newDiseaseWithId = {
      ...newDisease,
      id: Date.now(),
    }

    setDiseases([...diseases, newDiseaseWithId])
    setAddingDisease(false)

    toast({
      title: "Disease added",
      description: "The new disease has been added to the knowledge hub.",
    })
  }

  const deleteDisease = (id: number) => {
    setDiseases(diseases.filter((disease) => disease.id !== id))

    toast({
      title: "Disease removed",
      description: "The disease has been removed from the knowledge hub.",
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Knowledge Hub</CardTitle>
          <CardDescription>Common livestock diseases in Uganda and how to manage them.</CardDescription>
        </div>
        <Button onClick={startAddingDisease} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-1 h-4 w-4" />
          Add Disease
        </Button>
      </CardHeader>
      <CardContent>
        {addingDisease ? (
          <div className="space-y-4 border rounded-md p-4">
            <h3 className="font-medium">Add New Disease</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newDisease.name}
                onChange={(e) => setNewDisease({ ...newDisease, name: e.target.value })}
                placeholder="Disease name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newDisease.description}
                onChange={(e) => setNewDisease({ ...newDisease, description: e.target.value })}
                placeholder="Brief description of the disease"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Symptoms</label>
              <Textarea
                value={newDisease.symptoms}
                onChange={(e) => setNewDisease({ ...newDisease, symptoms: e.target.value })}
                placeholder="Common symptoms"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Treatment</label>
              <Textarea
                value={newDisease.treatment}
                onChange={(e) => setNewDisease({ ...newDisease, treatment: e.target.value })}
                placeholder="Treatment options"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Prevention</label>
              <Textarea
                value={newDisease.prevention}
                onChange={(e) => setNewDisease({ ...newDisease, prevention: e.target.value })}
                placeholder="Prevention measures"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelAddingDisease}>
                Cancel
              </Button>
              <Button onClick={addDisease} className="bg-green-600 hover:bg-green-700">
                Add Disease
              </Button>
            </div>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {diseases.map((disease) => (
              <AccordionItem key={disease.id} value={`disease-${disease.id}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span>{disease.name}</span>
                    {editingDisease !== disease.id && (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditing(disease)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          onClick={() => deleteDisease(disease.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {editingDisease === disease.id ? (
                    <div className="space-y-4 border rounded-md p-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          value={editedDisease.name}
                          onChange={(e) => setEditedDisease({ ...editedDisease, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={editedDisease.description}
                          onChange={(e) => setEditedDisease({ ...editedDisease, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Symptoms</label>
                        <Textarea
                          value={editedDisease.symptoms}
                          onChange={(e) => setEditedDisease({ ...editedDisease, symptoms: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Treatment</label>
                        <Textarea
                          value={editedDisease.treatment}
                          onChange={(e) => setEditedDisease({ ...editedDisease, treatment: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Prevention</label>
                        <Textarea
                          value={editedDisease.prevention}
                          onChange={(e) => setEditedDisease({ ...editedDisease, prevention: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={cancelEditing}>
                          <X className="mr-1 h-4 w-4" />
                          Cancel
                        </Button>
                        <Button onClick={saveEdited} className="bg-green-600 hover:bg-green-700">
                          <Save className="mr-1 h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium">Description</h4>
                        <p className="text-sm">{disease.description}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Symptoms</h4>
                        <p className="text-sm">{disease.symptoms}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Treatment</h4>
                        <p className="text-sm">{disease.treatment}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Prevention</h4>
                        <p className="text-sm">{disease.prevention}</p>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}

