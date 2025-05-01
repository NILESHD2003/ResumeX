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
      startDate: undefined,
      endDate: undefined,
      description: '',
      hide: false,
    };
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (date, field) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  const handleSave = () => {
    if (isEditing) {
      const updatedList = [...educationList];
      updatedList[editIndex] = formData;
      setEducationList(updatedList);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setEducationList((prevList) => [...prevList, formData]);
    }

    setFormData(initialFormData());
    setDialogOpen(false);
  };

  const handleDelete = (index) => {
    setEducationList((prevList) => prevList.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setFormData(educationList[index]);
    setEditIndex(index);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const toggleVisibility = (index) => {
    const updated = [...educationList];
    updated[index].hide = !updated[index].hide;
    setEducationList(updated);
  };

  return (
    <Card className="max-w-xl mx-auto p-6 bg-white rounded-3xl shadow-sm">
      <h1 className="text-3xl font-bold text-center mb-4">Educational Details</h1>
      
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
              <p><span className="font-semibold">Title:</span> {edu.title}</p>
            </div>
          ) : (
            <p className="text-center italic text-gray-500">This Eduacation is hidden.</p>
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
              {isEditing ? "Edit Education Details" : "Add Education Details"}
            </DialogTitle>
          </DialogHeader>
          <form>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  type="text"
                  id="degree"
                  placeholder="Degree/Qualification"
                  className="col-span-3"
                  value={formData.degree}
                  onChange={handleInputChange}
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
                className='col-span-4'
                placeholder="School/College"
                value={formData.school}
                onChange={handleInputChange}
              />
              <Input
                type="text"
                id="university"
                className='col-span-4'
                placeholder="University"
                value={formData.university}
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
              <Textarea
                id="description"
                placeholder="Enter Education Description"
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

export default EducationCard;
