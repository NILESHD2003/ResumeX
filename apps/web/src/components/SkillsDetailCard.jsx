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
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from "lucide-react";

const SkillsDetailCard = () => {
  const [skills, setSkills] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", subskills: [""], hide:false, });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subskills: [""],
      hide: false,
    });
  };

  const toggleVisibility = (index) => {
    const updated = [...skills];
    updated[index].hide = !updated[index].hide;
    setSkills(updated);
  };

  const handleSubSkillChange = (index, value) => {
    const newSubskills = [...formData.subskills];
    newSubskills[index] = value;
    setFormData((prev) => ({ ...prev, subskills: newSubskills }));
  };

  const addSubSkill = () => {
    setFormData((prev) => ({ ...prev, subskills: [...prev.subskills, ""] }));
  };

  const removeSubSkill = (index) => {
    const newSubskills = formData.subskills.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, subskills: newSubskills }));
  };

  const handleSave = () => {
    if (isEditing) {
      const updatedSkills = [...skills];
      updatedSkills[editIndex] = formData;
      setSkills(updatedSkills);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setSkills((prev) => [...prev, formData]);
    }

    setFormData({ name: "", subskills: [""] });
    setDialogOpen(false);
  };

  const handleEdit = (index) => {
    setFormData(skills[index]);
    setEditIndex(index);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = (index) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-sm">
      <h1 className="text-3xl font-bold text-center mb-4">Skills Details</h1>

      {skills.map((skill, index) => (
        <Card key={index} className="mb-4 p-4 rounded-lg relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => handleEdit(index)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => handleDelete(index)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => toggleVisibility(index)}>
              {skill.hide ? (
                <EyeOff className="w-4 h-4 text-gray-500" />
              ) : (
                <Eye className="w-4 h-4 text-green-600" />
              )}
            </Button>
          </div>
          {!skill.hide ? (
            <div className="space-y-1">
              <p><span className="font-semibold">Skill:</span> {skill.title}</p>
            </div>
          ) : (
            <p className="text-center italic text-gray-500">This Skill is hidden.</p>
          )}
        </Card>
      ))}

      <div className="flex justify-center mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            resetForm();
            setIsEditing(false);
            setDialogOpen(true);
          }}
        >
          Add <Plus className="ml-2 w-4 h-4" />
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              {isEditing ? "Edit Skill Details" : "Add Skill Details"}
            </DialogTitle>
          </DialogHeader>
          <form>
            <div className="grid grid-cols-4 items-center gap-4 py-4">
              <Input
                type="text"
                id="title"
                placeholder="Skill Name"
                className="col-span-4"
                value={formData.title}
                onChange={handleInputChange}
              />
              
            </div>

            {formData.subskills.map((subskill, index) => (
              <div
                className="grid grid-cols-4 items-center gap-4 py-2"
                key={index}
              >
                <Input
                  type="text"
                  placeholder={`Sub-skill ${index + 1}`}
                  className="col-span-3"
                  value={subskill}
                  onChange={(e) => handleSubSkillChange(index, e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => removeSubSkill(index)}
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}

            <div className="flex justify-start">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={addSubSkill}
              >
                Add Sub-skill <Plus className="ml-2 w-4 h-4" />
              </Button>
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

export default SkillsDetailCard;
