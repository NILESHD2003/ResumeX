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
import { DatePicker } from "./DatePicker";
import { Textarea } from "@/components/ui/textarea";
import { 
  getUserPublicationsDetails,
  addNewPublicationDetail,
  updatePublicationDetail,
  togglePublicationDetailVisibility,
  deletePublicationDetail 
} from "../services/operations/publicationDetailsAPIS";

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
    hide: false,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      link: "",
      publisher: "",
      date: "",
      description: "",
      citation: "",
      hide: false,
    });
  };

  function normalizePublicationsData(data) {
    return {
      title: data.title ?? '',
      link: data.link ?? '',
      publisher: data.publisher ?? '',
      citation: data.citation ?? '',
      date: data.date ?? '',
      description: data.description ?? '',
      hide: Boolean(data.hide),
      _id: data._id, // keep id if present for editing
    };
  }

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
      if (!formData.title.trim()) {
        toast.warning("Publication title is required.");
        return;
      }
  
      if (isEditing) {
        const original = publications[editingIndex];
        const updatedFields = getChangedFields(formData, original);
  
        if (Object.keys(updatedFields).length > 0) {
          await updatePublicationDetail(updatedFields, original._id);
          const updatedPublications = [...publications];
          updatedPublications[editingIndex] = { ...original, ...updatedFields };
          setPublications(updatedPublications);
        }
      } else {
        const filledData = getFilledFields(formData);
        const response = await addNewPublicationDetail(filledData);
        if (response && response._id) {
          setPublications((prev) => [...prev, { ...filledData, _id: response._id }]);
        }
      }
  
      resetForm();
      setOpenDialog(false);
      setIsEditing(false);
      setEditingIndex(null);
    } catch (error) {
      console.error("Error saving publication detail:", error);
      toast.error("Failed to save publication.");
    }
  };

  const handleEdit = (index) => {
    const rawData = publications[index];
    const normalized = normalizePublicationsData(rawData);
    setFormData(normalized);
    setIsEditing(true);
    setEditingIndex(index);
    setOpenDialog(true);
  };

  const handleDelete = async (index) => {
    const id = publications[index]._id;
    try {
      await deletePublicationDetail(id);
      setPublications((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting publication:", error);
      toast.error("Failed to delete publication.");
    }
  };

  const toggleVisibility = async (index) => {
    const id = publications[index]._id;
    try {
      await togglePublicationDetailVisibility(id);
      const updated = [...publications];
      updated[index].hide = !updated[index].hide;
      setPublications(updated);
    } catch (error) {
      console.error("Error toggling publication visibility:", error);
      toast.error("Failed to toggle visibility.");
    }
  }; 

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserPublicationsDetails();
      if (data) {
        const normalizedList = data.map(normalizePublicationsData)
        setPublications(normalizedList);
      }
    };
    fetchData();
  }, []);

  return (
    <Card className="max-w-xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm">
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
          {!pub.hide ? (
            <div className="space-y-1">
                <p><span className="font-semibold">Title:</span> {pub.title}</p>
            </div>
          ) : (
            <p className="text-center italic text-gray-500">This Publication is hide.</p>
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
                  selected={formData.date}
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
