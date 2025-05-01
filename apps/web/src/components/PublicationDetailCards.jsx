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
import { DatePicker } from "./DatePicker";
import { Textarea } from "@/components/ui/textarea";

const PublicationDetailCard = () => {
  const [publications, setPublications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    link: "",
    publisher: "",
    date: "",
    description: "",
    citation: "",
    hidden: false,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      link: "",
      publisher: "",
      date: "",
      description: "",
      citation: "",
      hidden: false,
    });
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleSave = () => {
    if (isEditing) {
      setPublications((prev) =>
        prev.map((pub, idx) => (idx === editingIndex ? formData : pub))
      );
    } else {
      setPublications((prev) => [...prev, formData]);
    }

    resetForm();
    setOpenDialog(false);
  };

  const handleEdit = (index) => {
    const pub = publications[index];
    setFormData(pub);
    setIsEditing(true);
    setEditingIndex(index);
    setOpenDialog(true);
  };

  const handleDelete = (index) => {
    setPublications((prev) => prev.filter((_, idx) => idx !== index));
  };

  const toggleVisibility = (index) => {
    setPublications((prev) =>
      prev.map((pub, idx) =>
        idx === index ? { ...pub, hidden: !pub.hidden } : pub
      )
    );
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-sm">
      <h1 className="text-3xl font-bold text-center mb-4">Publication Details</h1>

      {publications.map((pub, index) => (
        <Card key={index} className="mb-4 border p-4 rounded-md relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <Button variant="ghost" onClick={() => handleEdit(index)}>
              <Pencil size={16} />
            </Button>
            <Button variant="ghost" onClick={() => handleDelete(index)}>
              <Trash2 size={16} />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => toggleVisibility(index)}>
                {pub.hide ? (
                <EyeOff className="w-4 h-4 text-gray-500" />
                ) : (
                <Eye className="w-4 h-4 text-green-600" />
                )}
            </Button>
          </div>
          {!pub.hidden ? (
            <div className="space-y-1">
                <p><span className="font-semibold">Title:</span> {pub.title}</p>
            </div>
          ) : (
            <p className="text-center italic text-gray-500">This Publication is hidden.</p>
          )}
        </Card>
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
              {isEditing ? "Edit" : "Add"} Publication Details
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                type="text"
                placeholder="Publication Title"
                className="col-span-4"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <Input
                type="text"
                placeholder="Publication Link"
                className="col-span-4"
                value={formData.link}
                onChange={(e) => handleChange("link", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <Input
                type="text"
                placeholder="Publisher"
                className="col-span-2"
                value={formData.publisher}
                onChange={(e) => handleChange("publisher", e.target.value)}
              />
              <div className="col-span-2">
                <DatePicker
                  span="Date"
                  value={formData.date}
                  onChange={(value) => handleChange("date", value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <Textarea
                className="col-span-4"
                placeholder="Enter Description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <Textarea
                className="col-span-4"
                placeholder="Enter Citation"
                value={formData.citation}
                onChange={(e) => handleChange("citation", e.target.value)}
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

export default PublicationDetailCard;
