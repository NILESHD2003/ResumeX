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
import { Toaster, toast } from "sonner";
import { 
  getUserAwardsDetails,
  addNewAwardDetail,
  updateAwardDetail,
  toggleAwardDetailVisibility,
  deleteAwardDetail 
} from "../services/operations/awardDetailsAPIS";

const AwardDetailsCard = () => {
  const [awards, setAwards] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({
    title: "",
    link: "",
    issuer: "",
    date: "",
    hide: false,
  });

  const resetForm = () => {
    setForm({
      title: "",
      link: "",
      issuer: "",
      date: "",
      hide: false,
    });
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  function normalizeAwardsData(data) {
    return {
      title: data.title ?? '',
      link: data.link ?? '',
      issuer: data.issuer ?? '',
      date: data.date ?? '',
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
        if (!form.title.trim()) {
          toast.warning("Award title is required.");
          return;
        }
    
        if (isEditing) {
          const original = awards[editingIndex];
          const updatedFields = getChangedFields(form, original);
    
          if (Object.keys(updatedFields).length > 0) {
            await updateAwardDetail(updatedFields, original._id);
            const updatedAwards = [...awards];
            updatedAwards[editingIndex] = { ...original, ...updatedFields };
            setAwards(updatedAwards);
          }
        } else {
          const filledData = getFilledFields(form);
          const response = await addNewAwardDetail(filledData);
          if (response && response._id) {
            setAwards((prev) => [...prev, { ...filledData, _id: response._id }]);
          }
        }
    
        resetForm();
        setOpenDialog(false);
        setIsEditing(false);
        setEditingIndex(null);
      } catch (error) {
        console.error("Error saving award detail:", error);
        toast.error("Failed to save award.");
      }
    };  

  const handleEdit = (index) => {
    const rawData = awards[index];
    const normalized = normalizeAwardsData(rawData);
    setForm(normalized);
    setIsEditing(true);
    setEditingIndex(index);
    setOpenDialog(true);
  };

  const handleDelete = async (index) => {
      const id = awards[index]._id;
      try {
        await deleteAwardDetail(id);
        setAwards((prev) => prev.filter((_, i) => i !== index));
      } catch (error) {
        console.error("Error deleting award:", error);
        toast.error("Failed to delete award.");
      }
    };

  const toggleVisibility = async (index) => {
      const id = awards[index]._id;
      try {
        await toggleAwardDetailVisibility(id);
        const updated = [...awards];
        updated[index].hide = !updated[index].hide;
        setAwards(updated);
      } catch (error) {
        console.error("Error toggling Award visibility:", error);
        toast.error("Failed to toggle visibility.");
      }
    };

  useEffect(() => {
        const fetchData = async () => {
          const data = await getUserAwardsDetails();
          if (data) {
            const normalizedList = data.map(normalizeAwardsData)
            setAwards(normalizedList);
          }
        };
        fetchData();
      }, []);

  return (
    <Card className="max-w-xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm">
      <h1 className="text-3xl font-bold text-center mb-4">Award Details</h1>
      <Toaster />
      {awards.map((award, index) => (
        <Card key={index} className="mb-4 border p-4 rounded-md relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => handleEdit(index)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => handleDelete(index)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => toggleVisibility(index)}>
              {award.hide ? (
                <EyeOff className="w-4 h-4 text-gray-500" />
              ) : (
                <Eye className="w-4 h-4 text-green-600" />
              )}
            </Button>
          </div>

          {!award.hide ? (
            <div className="space-y-1">
              <p><span className="font-semibold">Title:</span> {award.title}</p>
            </div>
          ) : (
            <p className="text-center italic text-gray-500">This award is hidden.</p>
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
              {isEditing ? "Edit" : "Add"} Award Details
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
                placeholder="Award Title"
                className="col-span-4"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <Input
                type="text"
                placeholder="Award Link"
                className="col-span-4"
                value={form.link}
                onChange={(e) => handleChange("link", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <Input
                type="text"
                placeholder="Issuer"
                className="col-span-2"
                value={form.issuer}
                onChange={(e) => handleChange("issuer", e.target.value)}
              />
              <div className="col-span-2">
                <DatePicker span="Date" selected={form.date} onChange={(val) => handleChange("date", val)} />
              </div>
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

export default AwardDetailsCard;
