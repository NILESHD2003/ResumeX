import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye, EyeOff, Pencil } from "lucide-react";
import { Toaster, toast } from "sonner";
import { 
  getUserReferencesDetails,
  addNewReferenceDetail,
  updateReferenceDetail,
  toggleReferenceDetailVisibility,
  deleteReferenceDetail 
} from "../services/operations/referenceDetailsAPIS";

const ReferenceDetailCard = () => {
  const [references, setReferences] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    jobTitle: "",
    organization: "",
    email: "",
    phone: "",
    hide: false,
  });

  function normalizeReferencesData(data) {
    return {
      name: data.name ?? '',
      link: data.link ?? '',
      jobTitle: data.jobTitle ?? '',
      organization: data.organization ?? '',
      email: data.email ?? '',
      phone: data.phone ?? '',
      hide: Boolean(data.hide),
      _id: data._id, // keep id if present for editing
    };
  }

  const resetForm = () => {
    setFormData({
      name: "",
      link: "",
      jobTitle: "",
      organization: "",
      email: "",
      phone: "",
      hide: false,
    });
  };

  function getChangedFields(newData, originalData) {
    return Object.fromEntries(
      Object.entries(newData).filter(([key, value]) => originalData[key] !== value)
    );
  }
  
  function getFilledFields(data) {
    return Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== '' && value !== null && value !== undefined
      )
    );
  }

  const handleSave = async () => {
    try {
      if (!formData.name.trim()) {
        toast.warning("Reference name is required.");
        return;
      }
  
      if (isEditing) {
        const original = references[editingIndex];
        const updatedFields = getChangedFields(formData, original);
  
        if (Object.keys(updatedFields).length > 0) {
          await updateReferenceDetail(updatedFields, original._id);
          const updatedReferences = [...references];
          updatedReferences[editingIndex] = { ...original, ...updatedFields };
          setReferences(updatedReferences);
        }
      } else {
        const filledData = getFilledFields(formData);
        const response = await addNewReferenceDetail(filledData);
        if (response && response._id) {
          setReferences((prev) => [...prev, { ...filledData, _id: response._id }]);
        }
      }
  
      resetForm();
      setOpenDialog(false);
      setIsEditing(false);
      setEditingIndex(null);
    } catch (error) {
      console.error("Error saving reference detail:", error);
      toast.error("Failed to save reference.");
    }
  };  

  const handleEdit = (index) => {
    const rawData = references[index];
    const normalized = normalizeReferencesData(rawData);
    setFormData(normalized);
    setIsEditing(true);
    setEditingIndex(index);
    setOpenDialog(true);
  };

  const handleDelete = async (index) => {
    const id = references[index]._id;
    try {
      await deleteReferenceDetail(id);
      setReferences((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting references:", error);
      toast.error("Failed to delete references.");
    }
  };

  const toggleVisibility = async (index) => {
    const id = references[index]._id;
    try {
      await toggleReferenceDetailVisibility(id);
      const updated = [...references];
      updated[index].hide = !updated[index].hide;
      setReferences(updated);
    } catch (error) {
      console.error("Error toggling references visibility:", error);
      toast.error("Failed to toggle visibility.");
    }
  }; 

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

useEffect(() => {
  const fetchData = async () => {
    const data = await getUserReferencesDetails();
    if (data) {
      const normalizedList = data.map(normalizeReferencesData)
      setReferences(normalizedList);
    }
  };
  fetchData();
}, []);

  return (
    <Card className="max-w-xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm">
      <h1 className="text-3xl font-bold text-center mb-4">Reference Details</h1>

      {references.map((ref, index) => (
        <div key={index} className="mb-4 border p-4 rounded-md relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <Button variant="ghost" onClick={() => handleEdit(index)}>
              <Pencil size={16} />
            </Button>
            <Button variant="ghost" onClick={() => handleDelete(index)}>
              <Trash2 size={16} />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => toggleVisibility(index)}>
                {ref.hide ? (
                <EyeOff className="w-4 h-4 text-gray-500" />
                ) : (
                <Eye className="w-4 h-4 text-green-600" />
                )}
            </Button>
          </div>
          {!ref.hide ? (
            <div className="space-y-1">
                <p><span className="font-semibold">Title:</span> {ref.name}</p>
            </div>
          ) : (
            <p className="text-center italic text-gray-500">This reference is hidden.</p>
          )}
        </div>
      ))}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <div className="flex justify-center">
            <Button variant="outline" size="sm" onClick={resetForm}>
              Add <Plus />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent aria-describedby="">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isEditing ? "Edit" : "Add"} Reference Details
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <Input
                type="text"
                placeholder="Reference Name"
                className="col-span-4"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
           
              <Input
                type="text"
                placeholder="Reference Link"
                className="col-span-4"
                value={formData.link}
                onChange={(e) => handleChange("link", e.target.value)}
              />
            
              <Input
                type="text"
                placeholder="Job Title"
                className="col-span-2"
                value={formData.jobTitle}
                onChange={(e) => handleChange("jobTitle", e.target.value)}
              />
              <Input
                type="text"
                placeholder="Organization"
                className="col-span-2"
                value={formData.organization}
                onChange={(e) => handleChange("organization", e.target.value)}
              />
            
              <Input
                type="email"
                placeholder="Email"
                className="col-span-4"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              <Input
                type="text"
                placeholder="Phone no."
                className="col-span-4"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="submit">{isEditing ? "Update" : "Save"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ReferenceDetailCard;
