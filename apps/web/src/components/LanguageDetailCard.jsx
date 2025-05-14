import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from './ui/label';
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from 'react-router-dom';
import { 
  getUserLanguagesDetails,
  addNewLanguageDetail,
  updateLanguageDetail,
  deleteLanguageDetail
} from "../services/operations/languageDetailAPIS";
import { Toaster, toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LanguageDetailsCard = () => {
  const [languages, setLanguages] = useState([]);
  const [formData, setFormData] = useState({ name: "", level: "", additionalInfo: "", hide:false });
  const [editIndex, setEditIndex] = useState(null);
  const [addData, setAddData] = useState(false);
  const navigate = useNavigate();

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
  
      if (editIndex !== null) {
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
      setAddData(false);
      setEditIndex(null);
      resetForm();
    } catch (error) {
      console.error("Error saving language detail:", error);
      toast.error("Failed to save language.");
    }
  };  

  const handleEdit = (index) => {
    setEditIndex(index);
    const rawData = languages[index];
    const normalized = normalizeLanguagesData(rawData);
    setFormData(normalized);
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
    <div className='flex flex-col w-full'>
      <Card className="max-w-xl w-full mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-sm">
        <Toaster />

        {(languages.length === 0 || editIndex !== null || addData) && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {editIndex !== null ? 'Update Language' : 'Add Language'}
            </h2>
            <FormInputs
              formData={formData}
              onChange={handleInputChange}
              onSelectChange={handleLevelChange}
              onSubmit={handleSave}
              submitLabel={editIndex !== null ? "Update" : "Save"}
            />
          </div>
        )}
        
        {languages.length > 0 && editIndex === null && addData === false && (
          <div className="justify-center">
            <Accordion type="multiple" className="w-full space-y-2 pt-2">
              {languages.map((lan, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="p-2">
                  <div className="flex justify-center items-center pr-2">
                    <AccordionTrigger className="w-full flex justify-between items-center">
                      <p className="text-center text-2xl font-semibold">
                        {lan.name || "Untitled Language"}
                      </p>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent>                 
                      <div className="text-center pt-2 space-y-1 text-muted-foreground text-lg">
                        <p><strong>Level:</strong> {lan.level}</p>
                        <p><strong>Description:</strong> {lan.additionalInfo}</p>
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
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddData(true)}
              >
                Add <Plus className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
      <div className='w-full max-w-4xl px-4 mx-auto mt-10 mb-6 flex justify-between'>
            <Button variant="outline" onClick={() => navigate('/onboarding/skills-section')} className='font-semibold py-2 px-6 rounded'>
                Back
            </Button>
            <Button onClick={() => navigate('/onboarding/certificates-section')} className='font-semibold py-2 px-6 rounded'>
                {languages.length === 0 ? 'Skip' : 'Continue'}
            </Button>
        </div>
    </div>
  );  
};

const FormInputs = ({ formData, onChange, onSelectChange, onSubmit, submitLabel = "Save" }) => (
  <div className='space-y-4'>
    <div className="grid grid-cols-4 items-center gap-4">
        <div className="col-span-4 sm:col-span-2">
            <Label htmlFor="name" className="px-1 pb-1">Language Name</Label>
            <Input
                type="text"
                id="name"
                placeholder="Language Name"
                className="col-span-4 sm:col-span-2"
                value={formData.name}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4 sm:col-span-2">
            <Label htmlFor="level" className="px-1 pb-1">Level</Label>
            <Select value={formData.level} onValueChange={onSelectChange}>
                <SelectTrigger className="w-full">
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
        </div>
        <div className="col-span-4">
            <Label htmlFor="additionalInfo" className="px-1 pb-1">Additional Info</Label>
            <Textarea
                id="additionalInfo"
                placeholder="Enter Additional Info"
                className="col-span-4 resize-none"
                value={formData.additionalInfo}
                onChange={onChange}
            />
        </div>
    </div>
    <div className="text-right">
        <Button onClick={onSubmit}>{submitLabel}</Button>
    </div>
  </div>
)

export default LanguageDetailsCard;