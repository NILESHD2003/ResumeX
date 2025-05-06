import React, { useState, useEffect } from 'react';
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from './ui/input';
import { Button } from "./ui/button";
import { Plus, Trash2, Pencil, Eye, EyeOff } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { DatePicker } from "./DatePicker";
import {
  getUserProfessionalExperiences,
  addNewProfessionalExperience,
  updateProfessionalExperience,
  toggleProfessionalExperienceVisibility,
  deleteProfessionalExperience 
} from '../services/operations/professionalDetailsAPIS';
import { Toaster, toast } from 'sonner';

const ProffesionalCard = () => {
  const [proffesionalList, setProffesionalList] = useState([]);
  const [formData, setFormData] = useState(initialFormData());
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function normalizeProfessionalData(data) {
    return {
      jobTitle: data.jobTitle ?? '',
      employer: data.employer ?? '',
      link: data.link ?? '',
      country: data.country ?? '',
      city: data.city ?? '',
      startDate: data.startDate ?? '',
      endDate: data.endDate ?? '',
      description: data.description ?? '',
      hide: Boolean(data.hide),
      _id: data._id, // keep id if present for editing
    };
  }

  function initialFormData() {
    return {
      jobTitle: '',
      employer: '',
      link: '',
      country: '',
      city: '',
      startDate: null,
      endDate: null,
      description: '',
      hide: false
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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const handleSave = async () => {
    if (!formData.jobTitle.trim()) {
      toast.warning("Please fill in required fields: Job Title.");
      return;
    }

    try {
      if (isEditing) {
        console.log("Is editing");
        const original = proffesionalList[editIndex];
        const updatedFields = getChangedFields(formData, original);

        if (Object.keys(updatedFields).length > 0) {
          await updateProfessionalExperience(updatedFields, original._id);
          console.log(updatedFields);
        }

        const updatedList = [...proffesionalList];
        updatedList[editIndex] = { ...original, ...updatedFields };
        setProffesionalList(updatedList);
      } else {
        const filledData = getFilledFields(formData);
        const response = await addNewProfessionalExperience(filledData);

        // Assuming response contains the newly created item (with `_id`)
        if (response && response._id) {
          const newItem = { ...filledData, _id: response._id };
          setProffesionalList((prevList) => [...prevList, newItem]);
        } else {
          console.warn("New item not returned properly:", response);
        }
      }
  
      setFormData(initialFormData());
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };
  

  const handleEdit = (index) => {
    const rawData = proffesionalList[index];
    const normalized = normalizeProfessionalData(rawData);
    setFormData(normalized);
    setEditIndex(index);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const toggleVisibility = async (index) => {
    const id = proffesionalList[index]._id;
    try {
      await toggleProfessionalExperienceVisibility(id);
  
      // Toggle the isVisible field locally
      const updatedList = [...proffesionalList];
      updatedList[index] = {
        ...updatedList[index],
        hide: !updatedList[index].hide,
      };
      setProffesionalList(updatedList);
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const handleDelete = async (index) => {
    const id = proffesionalList[index]._id;
    try {
      await deleteProfessionalExperience(id);
  
      // Remove the item locally
      const updatedList = proffesionalList.filter((_, i) => i !== index);
      setProffesionalList(updatedList);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserProfessionalExperiences();
      if (data) {
        const normalizedList = data.map(normalizeProfessionalData)
        setProffesionalList(normalizedList);
      }
    };
    fetchData();
  }, []);

  return (
    <Card className="w-full max-w-xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-sm">
      <Toaster />
      <h1 className="text-3xl font-bold text-center mb-4">Professional Details</h1>
      {proffesionalList.map((exp, index) => (
        <Card key={index} className="mb-4 p-4 rounded-lg relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => handleEdit(index)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => handleDelete(index)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => toggleVisibility(index)}>
              {exp.hide ? (
                <EyeOff className="w-4 h-4 text-gray-500" />
              ) : (
                <Eye className="w-4 h-4 text-green-600" />
              )}
            </Button>
          </div>
          {!exp.hide ? (
            <div className="space-y-1">
              <p><span className="font-semibold">Title:</span> {exp.title}</p>
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
            setFormData(initialFormData());
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
              {isEditing ? "Edit Professional Details" : "Add Professional Details"}
            </DialogTitle>
          </DialogHeader>
          <form>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                type="text"
                id="jobTitle"
                className='col-span-4'
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={handleInputChange}
                required
              />
              <Input
                type="text"
                id="employer"
                className='col-span-4'
                placeholder="Employer"
                value={formData.employer}
                onChange={handleInputChange}
              />
              <Input
                type="url"
                id="link"
                className='col-span-4'
                placeholder="Link"
                value={formData.link}
                onChange={handleInputChange}
              />
              <Input
                type="text"
                id="country"
                placeholder="Country"
                className="col-span-2"
                value={formData.country}
                onChange={handleInputChange}
              />
              <Input
                type="text"
                id="city"
                placeholder="City"
                className="col-span-2"
                value={formData.city}
                onChange={handleInputChange}
              />
              <div className="col-span-2">
                <DatePicker
                  span={"Start Date"}
                  selected={formData.startDate}
                  onChange={(date) => handleDateChange(date, 'startDate')}
                />
              </div>
              <div className="col-span-2">
                <DatePicker
                  span={"End Date"}
                  selected={formData.endDate}
                  onChange={(date) => handleDateChange(date, 'endDate')}
                />
              </div>
            </div>
            <div className='col-span-4 pt-3'>
              <Textarea
                id="description"
                placeholder="Enter Professional Description"
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

export default ProffesionalCard;
