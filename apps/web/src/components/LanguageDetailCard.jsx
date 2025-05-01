import React, { useState } from "react";
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

const LanguageDetailsCard = () => {
  const [languages, setLanguages] = useState([]);
  const [formData, setFormData] = useState({ language: "", level: "", description: "", hide:false });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLevelChange = (value) => {
    setFormData((prev) => ({ ...prev, level: value }));
  };

  const handleSave = () => {
    if (isEditing) {
      const updatedList = [...languages];
      updatedList[editIndex] = formData;
      setLanguages(updatedList);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setLanguages((prev) => [...prev, formData]);
    }
    resetForm();
    setDialogOpen(false);
  };

  const handleEdit = (index) => {
    setFormData(languages[index]);
    setEditIndex(index);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ language: "", level: "", description: "", hide:false })
  }
  const handleDelete = (index) => {
    setLanguages((prev) => prev.filter((_, i) => i !== index));
  };
  const toggleVisibility = (index) => {
    const updated = [...languages];
    updated[index].hide = !updated[index].hide;
    setLanguages(updated);
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-sm">
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
              <p><span className="font-semibold">Title:</span> {lang.language}</p>
            </div>
          ) : (
            <p className="text-center italic text-gray-500">This language is hidden.</p>
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
                id="language"
                placeholder="Language Name"
                className="col-span-2"
                value={formData.language}
                onChange={handleInputChange}
              />
              <Select value={formData.level} onValueChange={handleLevelChange}>
                <SelectTrigger className="w-full col-span-2">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Conversational">Conversational</SelectItem>
                  <SelectItem value="Proficient">Proficient</SelectItem>
                  <SelectItem value="Fluent">Fluent</SelectItem>
                  <SelectItem value="Native">Native</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                id="description"
                placeholder="Enter Additional Info"
                className="col-span-4"
                value={formData.description}
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
