import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from './ui/label';
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Toaster, toast } from "sonner";
import { 
  getUserSkillsDetails,
  addNewSkillDetail,
  updateSkillDetail,
  deleteSkillDetail 
} from "../services/operations/skillDetailsAPIS";
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SkillsDetailCard = () => {
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({ name: "", subSkills: [], level: "", hide:false, });
  const [editIndex, setEditIndex] = useState(null);
  const [addData, setAddData] = useState(false);
  const navigate = useNavigate();

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
      subSkills: [],
      level: "",
      hide: false,
    });
  };

  function normalizeSkillsData(data) {
    return {
      name: data.name ?? '',
      subSkills: data.subSkills ?? [],
      level: data.level ?? '',
      hide: Boolean(data.hide),
      _id: data._id, // keep id if present for editing
    };
  }

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

  const handleCancel = () => {
    resetForm();
    setAddData(false);
    setEditIndex(null);
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
  
      if (editIndex !== null) {
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
      setAddData(false);
      setEditIndex(null);
      resetForm();
    } catch (error) {
      console.error("Error saving skill detail:", error);
      toast.error("Failed to save skill.");
    }
  };  

  const handleEdit = (index) => {
    setEditIndex(index);
    const rawData = skills[index];
    const normalized = normalizeSkillsData(rawData);
    setFormData(normalized);
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
    <div className='flex flex-col w-full'>
      <Card className="max-w-xl w-full mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-sm">
        <Toaster />

        {(skills.length === 0 || editIndex !== null || addData) && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {editIndex !== null ? 'Update Skills' : 'Add Skills'}
            </h2>
            <FormInputs
              formData={formData}
              onChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onSubmit={handleSave}
              handleSubSkillChange={handleSubSkillChange}
              addSubSkill={addSubSkill}
              removeSubSkill={removeSubSkill}
              cancel={editIndex === null ? addData : editIndex + 1}
              onCancel={handleCancel}
              submitLabel={editIndex !== null ? "Update" : "Save"}
            />
          </div>
        )}

        {skills.length > 0 && editIndex === null && addData === false && (
          <div className="justify-center">
            <Accordion type="multiple" className="w-full space-y-2 pt-2">
              {skills.map((skill, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="p-2">
                  <div className="flex justify-center items-center pr-2">
                    <AccordionTrigger className="w-full flex justify-between items-center">
                      <p className="text-center text-2xl font-semibold">
                        {skill.name || "Untitled Skill"}
                      </p>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent>                 
                      <div className="text-center pt-2 space-y-1 text-muted-foreground text-lg">
                        <p><strong>Level:</strong> {skill.level}</p>
                        <p><strong>Subskills:</strong></p>
                        <ul>
                          {skill.subSkills.map((sub, index) => (
                            <li key={index}>{sub}</li>
                          ))}
                        </ul>
                      </div>
                    
                    <div className="flex justify-end gap-2 pr-4">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(index)} title="Edit">
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(index)} title="Delete">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="flex justify-center mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAddData(true)
                }}
              >
                Add <Plus className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
      <div className='w-full max-w-4xl px-4 mx-auto mt-10 mb-6 flex justify-between'>
          <Button variant="outline" onClick={() => navigate('/onboarding/professional-section')} className=' font-semibold py-2 px-6 rounded'>
              Back
          </Button>
          <Button onClick={() => navigate('/onboarding/languages-section')} className='font-semibold py-2 px-6 rounded'>
              {skills.length === 0 ? 'Skip' : 'Continue'}
          </Button>
      </div>
    </div>
  );
};

const FormInputs = ({ formData, onChange, onSelectChange, onSubmit, handleSubSkillChange, addSubSkill, removeSubSkill, cancel, onCancel, submitLabel = "Save" }) => (
  <div className='space-y-4'>
    <div className="grid grid-cols-4 items-center gap-4">
        <div className="col-span-2">
            <Label htmlFor="name" className="px-1 pb-1">Skill Name</Label>
            <Input
                type="text"
                id="name"
                placeholder="Skill Name"
                className="col-span-2"
                value={formData.name}
                onChange={onChange}
            />
        </div>
        <div className="col-span-2">
            <Label htmlFor="level" className="px-1 pb-1">Skill Level</Label>
            <Select value={formData.level} onValueChange={(val) => onSelectChange('level', val)}>
                <SelectTrigger className='w-full'>
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
    </div>

    <div className="space-y-2">
        <Label className="px-1">Sub-skills</Label>
        {formData.subSkills.map((subskill, index) => (
            <div
                className="grid grid-cols-4 items-center gap-4"
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
        <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={addSubSkill}
        >
            Add Sub-skill <Plus className="ml-2 w-4 h-4" />
        </Button>
    </div>
    <div className="flex justify-end">
      {cancel && (
        <div className="text-right mx-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      )}
      <div className="text-right mx-2">
          <Button onClick={onSubmit}>{submitLabel}</Button>
      </div>
    </div>
  </div>
)

export default SkillsDetailCard;
