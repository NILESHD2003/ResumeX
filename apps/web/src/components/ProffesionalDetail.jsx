import React, { useState } from 'react';
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

const ProffesionalCard = () => {
  const [proffesionalList, setProffesionalList] = useState([]);
  const [formData, setFormData] = useState(initialFormData());
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function initialFormData() {
    return {
      jobTitle: '',
      employer: '',
      link: '',
      country: '',
      city: '',
      startDate: undefined,
      endDate: undefined,
      description: '',
    };
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const key = id === "jobtitle" ? "jobTitle" : id;
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const handleSave = () => {
    if (isEditing) {
      const updatedList = [...proffesionalList];
      updatedList[editIndex] = formData;
      setProffesionalList(updatedList);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setProffesionalList(prevList => [...prevList, formData]);
    }

    setFormData(initialFormData());
    setDialogOpen(false);
  };

  const handleEdit = (index) => {
    setFormData(proffesionalList[index]);
    setIsEditing(true);
    setEditIndex(index);
    setDialogOpen(true);
  };

  const toggleVisibility = (index) => {
    const updated = [...proffesionalList];
    updated[index].hide = !updated[index].hide;
    setProffesionalList(updated);
  };

  const handleDelete = (index) => {
    setProffesionalList(prevList => prevList.filter((_, i) => i !== index));
  };

  return (
    <Card className="max-w-xl mx-auto p-6 bg-white rounded-3xl shadow-sm">
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
            <p className="text-center italic text-gray-500">This Proffesion is hidden.</p>
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
                id="jobtitle"
                className='col-span-4'
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={handleInputChange}
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
