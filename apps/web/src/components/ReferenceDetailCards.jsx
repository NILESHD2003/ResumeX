import React, { useState } from "react";
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
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleSave = () => {
    if (isEditing) {
      setReferences((prev) =>
        prev.map((ref, idx) => (idx === editingIndex ? formData : ref))
      );
    } else {
      setReferences((prev) => [...prev, formData]);
    }
    resetForm();
    setOpenDialog(false);
  };

  const handleEdit = (index) => {
    setFormData(references[index]);
    setIsEditing(true);
    setEditingIndex(index);
    setOpenDialog(true);
  };

  const handleDelete = (index) => {
    setReferences((prev) => prev.filter((_, idx) => idx !== index));
  };

  const toggleVisibility = (index) => {
    setReferences((prev) =>
      prev.map((ref, idx) =>
        idx === index ? { ...ref, hide: !ref.hide } : ref
      )
    );
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-sm">
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
        <DialogContent>
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
