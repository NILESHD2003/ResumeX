import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { 
  getUserLanguagesDetails,
  addNewLanguageDetail,
  updateLanguageDetail,
  toggleLanguageDetailVisibility,
  deleteLanguageDetail
} from "../services/operations/languageDetailAPIS";
import { Toaster, toast } from "sonner";

const LanguageDetailsCard = () => {
  const [languages, setLanguages] = useState([]);
  const [formData, setFormData] = useState({ name: "", level: "", additionalInfo: "", hide:false });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function normalizeLanguagesData(data) {
    return {
      name: data.name ?? '',
      additionalInfo: data.additionalInfo ?? '',
      level: data.level ?? '',
      hide: Boolean(data.hide),
      _id: data._id, // keep id if present for editing
    };
  }
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLevelChange = (value) => {
    setFormData((prev) => ({ ...prev, level: value }));
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
        toast.warning("Language name is required.");
        return;
      }
  
      if (isEditing) {
        const original = languages[editIndex];
        const updatedFields = getChangedFields(formData, original);
  
        if (Object.keys(updatedFields).length > 0) {
          await updateLanguageDetail(updatedFields, original._id);
          const updatedLanguages = [...languages];
          updatedLanguages[editIndex] = { ...original, ...updatedFields };
          setLanguages(updatedLanguages);
        }
      } else {
        const filledData = getFilledFields(formData);
        const response = await addNewLanguageDetail(filledData);
        if (response && response._id) {
          setLanguages((prev) => [...prev, { ...filledData, _id: response._id }]);
        }
      }
  
      resetForm();
      setDialogOpen(false);
      setIsEditing(false);
      setEditIndex(null);
    } catch (error) {
      console.error("Error saving language detail:", error);
      toast.error("Failed to save language.");
    }
  };  

  const handleEdit = (index) => {
    const rawData = languages[index];
    const normalized = normalizeLanguagesData(rawData);
    setFormData(normalized);
    setEditIndex(index);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: "", level: "", additionalInfo: "", hide:false })
  }
  
  const handleDelete = async (index) => {
    const id = languages[index]._id;
    try {
      await deleteLanguageDetail(id);
      setLanguages((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting language:", error);
      toast.error("Failed to delete language.");
    }
  };

  const toggleVisibility = async (index) => {
    const id = languages[index]._id;
    try {
      await toggleLanguageDetailVisibility(id);
      const updated = [...languages];
      updated[index].hide = !updated[index].hide;
      setLanguages(updated);
    } catch (error) {
      console.error("Error toggling language visibility:", error);
      toast.error("Failed to toggle visibility.");
    }
  };

  useEffect(() => {
        const fetchData = async () => {
          const data = await getUserLanguagesDetails();
          if (data) {
            const normalizedList = data.map(normalizeLanguagesData)
            setLanguages(normalizedList);
          }
        };
        fetchData();
      }, []);

  return (
    <Card className="max-w-xl w-full mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-sm">
      <Toaster />
      <h1 className="text-3xl font-bold text-center mb-4">Language Details</h1>
      {languages.map((lang, index) => (
        <Card key={index} className="mb-4 p-4 rounded-lg relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => handleEdit(index)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => handleDelete(index)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => toggleVisibility(index)}>
              {lang.hide ? (
                <EyeOff className="w-4 h-4 text-gray-500" />
              ) : (
                <Eye className="w-4 h-4 text-green-600" />
              )}
            </Button>
          </div>
          {!lang.hide ? (
            <div className="space-y-1">
              <p><span className="font-semibold">Title:</span> {lang.name}</p>
            </div>
          ) : (
            <p className="italic text-gray-500">Hidden.</p>
          )}
        </Card>
      ))}
       

      <div className="flex justify-center mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            resetForm();
            setIsEditing(false);
            setDialogOpen(true);
          }}
        >
          Add <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent aria-describedby="">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isEditing ? "Edit Language Details" : "Add Language Details"}
            </DialogTitle>
          </DialogHeader>
          <form>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                type="text"
                id="name"
                placeholder="Language Name"
                className="col-span-2"
                value={formData.name}
                onChange={handleInputChange}
              />
              <Select value={formData.level} onValueChange={handleLevelChange}>
                <SelectTrigger className="w-full col-span-2">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BASIC">Basic</SelectItem>
                  <SelectItem value="CONVERSATIONAL">Conversational</SelectItem>
                  <SelectItem value="PROFICIENT">Proficient</SelectItem>
                  <SelectItem value="FLUENT">Fluent</SelectItem>
                  <SelectItem value="NATIVE">Native</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                id="additionalInfo"
                placeholder="Enter Additional Info"
                className="col-span-4"
                value={formData.additionalInfo}
                onChange={handleInputChange}
              />
            </div>
            
        
          </form>
          <DialogFooter>
            <Button type="button" onClick={handleSave}>
              {isEditing ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default LanguageDetailsCard;
