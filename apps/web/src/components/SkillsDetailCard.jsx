import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from "lucide-react";
import { Toaster, toast } from "sonner";
import { 
  getUserSkillsDetails,
  addNewSkillDetail,
  updateSkillDetail,
  toggleSkillDetailVisibility,
  deleteSkillDetail 
} from "../services/operations/skillDetailsAPIS";

const SkillsDetailCard = () => {
  const [skills, setSkills] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", subSkills: [""], level: "", hide:false, });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id, val) => {
    setFormData((prev) => ({ ...prev, [id]: val}))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      subSkills: [""],
      level: "",
      hide: false,
    });
  };

  function normalizeSkillsData(data) {
    return {
      name: data.name ?? '',
      subSkills: data.subSkills ?? [''],
      level: data.level ?? '',
      hide: Boolean(data.hide),
      _id: data._id, // keep id if present for editing
    };
  }
  
  const toggleVisibility = async (index) => {
    const id = skills[index]._id;
    try {
      await toggleSkillDetailVisibility(id);
      const updated = [...skills];
      updated[index].hide = !updated[index].hide;
      setSkills(updated);
    } catch (error) {
      console.error("Error toggling skill visibility:", error);
      toast.error("Failed to toggle visibility.");
    }
  }; 

  const handleSubSkillChange = (index, value) => {
    const newSubSkills = [...formData.subSkills];
    newSubSkills[index] = value;
    setFormData((prev) => ({ ...prev, subSkills: newSubSkills }));
  };

  const addSubSkill = () => {
    setFormData((prev) => ({ ...prev, subSkills: [...prev.subSkills, ""] }));
  };

  const removeSubSkill = (index) => {
    const newSubSkills = formData.subSkills.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, subSkills: newSubSkills }));
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
        toast.warning("Skill name is required.");
        return;
      }
  
      if (isEditing) {
        const original = skills[editIndex];
        const updatedFields = getChangedFields(formData, original);
  
        if (Object.keys(updatedFields).length > 0) {
          await updateSkillDetail(updatedFields, original._id);
          const updatedSkills = [...skills];
          updatedSkills[editIndex] = { ...original, ...updatedFields };
          setSkills(updatedSkills);
        }
      } else {
        const filledData = getFilledFields(formData);
        const response = await addNewSkillDetail(filledData);
        if (response && response._id) {
          setSkills((prev) => [...prev, { ...filledData, _id: response._id }]);
        }
      }
  
      resetForm();
      setDialogOpen(false);
      setIsEditing(false);
      setEditIndex(null);
    } catch (error) {
      console.error("Error saving skill detail:", error);
      toast.error("Failed to save skill.");
    }
  };  

  const handleEdit = (index) => {
    const rawData = skills[index];
    const normalized = normalizeSkillsData(rawData);
    setFormData(normalized);
    setIsEditing(true);
    setEditIndex(index);
    setDialogOpen(true);
  };

  const handleDelete = async (index) => {
    const id = skills[index]._id;
    try {
      await deleteSkillDetail(id);
      setSkills((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Failed to delete skill.");
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserSkillsDetails();
      if (data) {
        const normalizedList = data.map(normalizeSkillsData)
        setSkills(normalizedList);
      }
    };
    fetchData();
  }, []);
  
  return (
    <Card className="max-w-xl w-full mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-sm">
      <h1 className="text-3xl font-bold text-center mb-4">Skills Details</h1>
      <Toaster />
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
              <p><span className="font-semibold">Skill:</span> {skill.name}</p>
            </div>
          ) : (
            <p className="italic text-gray-500">Hidden.</p>
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
        <DialogContent aria-describedby="">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isEditing ? "Edit Skill Details" : "Add Skill Details"}
            </DialogTitle>
          </DialogHeader>
          <form>
            <div className="grid grid-cols-4 items-center gap-4 py-4">
              <Input
                type="text"
                id="name"
                placeholder="Skill Name"
                className="col-span-2"
                value={formData.name}
                onChange={handleInputChange}
              />
              <Select value={formData.level} onValueChange={(val) => handleSelectChange('level', val)}>
                <SelectTrigger className='w-full col-span-2'>
                  <SelectValue placeholder="Skill Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINEER">Begineer</SelectItem>
                  <SelectItem value="AMATUER">Amatuer</SelectItem>
                  <SelectItem value="COMPETENT">Competent</SelectItem>
                  <SelectItem value="PROFICIENT">Proficient</SelectItem>
                  <SelectItem value="EXPERT">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.subSkills.map((subskill, index) => (
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
