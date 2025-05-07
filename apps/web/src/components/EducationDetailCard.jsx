import React, { useState } from 'react';
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from './ui/input';
import { Button } from "./ui/button";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { DatePicker } from "./DatePicker";
import { Eye, EyeOff } from 'lucide-react';
import { useEffect } from 'react';
import { 
  getUserEducationDetails,
  addNewEducationDetails,
  updateEducationDetail,
  toggleEducationDetailVisibility,
  deleteEducationDetail
} from '../services/operations/educationDetailsAPIS';
import { Toaster, toast } from 'sonner';

const EducationCard = () => {
  const [educationList, setEducationList] = useState([]);
  const [formData, setFormData] = useState(initialFormData());
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function initialFormData() {
    return {
      degree: '',
      grade: '',
      school: '',
      university: '',
      link: '',
      country: '',
      city: '',
      startDate: null,
      endDate: null,
      description: '',
      hide: false,
    };
  }

  function normalizeEducationData(data) {
    return {
      degree: data.degree ?? '',
      grade: data.grade ?? '',
      school: data.school ?? '',
      university: data.university ?? '',
      link: data.link ?? '',
      country: data.country ?? '',
      city: data.city ?? '',
      startDate: data.startDate ?? '',
      endDate: data.endDate ?? '',
      description: data.description ?? '',
      hide: data.hide ?? false, 
      _id: data._id, // keep id if present for editing
    };
  }
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (date, field) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
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
    if (!formData.degree.trim()) {
      toast.warning("Please fill in required fields: Degree.");
      return;
    }

    if (isEditing) {
      const original = educationList[editIndex];
      const updatedFields = getChangedFields(formData, original);
  
      if (Object.keys(updatedFields).length > 0) {
        await updateEducationDetail(updatedFields, original._id);
      }
  
      const updatedList = [...educationList];
      updatedList[editIndex] = { ...original, ...updatedFields };
      setEducationList(updatedList);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      const filledData = getFilledFields(formData);
      await addNewEducationDetails(filledData);
      const data = await getUserEducationDetails();
      if (data) setEducationList(data);
    }
  
    setFormData(initialFormData());
    setDialogOpen(false);
  };
  
  const handleDelete = async (index) => {
    const id = educationList[index]._id;
    await deleteEducationDetail(id);
    setEducationList(prevList => prevList.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    const rawData = educationList[index];
    const normalized = normalizeEducationData(rawData);
    setFormData(normalized);
    setEditIndex(index);
    setIsEditing(true);
    setDialogOpen(true);
  };
  

  const toggleVisibility = async (index) => {
    const id = educationList[index]._id;
    await toggleEducationDetailVisibility(id);
    const updated = [...educationList];
    updated[index].hide = !updated[index].hide;
    setEducationList(updated);
  };
  
  useEffect(() => {
    async function fetchEducation() {
      const data = await getUserEducationDetails();
      if (data) {
        const normalizedList = data.map(normalizeEducationData);
        setEducationList(normalizedList);
      }
    }
    fetchEducation();
  }, []);
  
  
  return (
    <Card className="w-full max-w-xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-sm">
      <Toaster />
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Educational Details</h1>

      {educationList.map((edu, index) => (
        <Card key={index} className="mb-4 p-4 rounded-lg relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => handleEdit(index)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => handleDelete(index)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => toggleVisibility(index)}>
              {edu.hide ? (
                <EyeOff className="w-4 h-4 text-gray-500" />
              ) : (
                <Eye className="w-4 h-4 text-green-600" />
              )}
            </Button>
          </div>

          {!edu.hide ? (
            <div className="space-y-1">
              <p><span className="font-semibold">Title:</span> {edu.degree}</p>
            </div>
          ) : (
            <p className="italic text-gray-500">Hidden</p>
          )}
        </Card>
      ))}

      <div className="flex justify-center mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFormData(initialFormData());
            setIsEditing(false);
            setDialogOpen(true);
          }}
        >
          Add <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent aria-describedby="" className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isEditing ? "Edit Education Details" : "Add Education Details"}
            </DialogTitle>
          </DialogHeader>
          <form>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  id="degree"
                  placeholder="Degree/Qualification"
                  value={formData.degree}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="text"
                  id="grade"
                  placeholder="Grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                />
                <Input
                  type="text"
                  id="school"
                  placeholder="School/College"
                  className="sm:col-span-2"
                  value={formData.school}
                  onChange={handleInputChange}
                />
                <Input
                  type="text"
                  id="university"
                  placeholder="University"
                  className="sm:col-span-2"
                  value={formData.university}
                  onChange={handleInputChange}
                />
                <Input
                  type="url"
                  id="link"
                  placeholder="Link"
                  className="sm:col-span-2"
                  value={formData.link}
                  onChange={handleInputChange}
                />
                <Input
                  type="text"
                  id="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
                <Input
                  type="text"
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                <DatePicker
                  span="Start Date"
                  selected={formData.startDate}
                  onChange={(date) => handleDateChange(date, 'startDate')}
                />
                <DatePicker
                  span="End Date"
                  selected={formData.endDate}
                  onChange={(date) => handleDateChange(date, 'endDate')}
                />
              </div>
              <Textarea
                id="description"
                placeholder="Enter Education Description"
                value={formData.description}
                onChange={handleInputChange}
                className="min-h-[100px]"
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

export default EducationCard;
