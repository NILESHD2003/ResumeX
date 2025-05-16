import { useState, useEffect } from 'react';
import { Card } from "./ui/card";
import { Input } from './ui/input';
import { Button } from "./ui/button";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Textarea } from "./ui/textarea";
import DatePicker from 'rsuite/DatePicker';
import { Label } from './ui/label';
import 'rsuite/DatePicker/styles/index.css';
import {
  getUserProfessionalExperiences,
  addNewProfessionalExperience,
  updateProfessionalExperience,
  deleteProfessionalExperience 
} from '../services/operations/professionalDetailsAPIS';
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from 'date-fns';

const ProfessionalCard = () => {
  const [professionalList, setProfessionalList] = useState([]);
  const [formData, setFormData] = useState(initialFormData());
  const [editIndex, setEditIndex] = useState(null);
  const [addData, setAddData] = useState(false);
  const navigate = useNavigate();

  function normalizeProfessionalData(data) {
    return {
      jobTitle: data.jobTitle ?? '',
      employer: data.employer ?? '',
      link: data.link ?? '',
      country: data.country ?? '',
      city: data.city ?? '',
      startDate: data.startDate ? new Date(data.startDate) : '',
      endDate: data.endDate ? new Date(data.endDate) : '',
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
      startDate: '',
      endDate: '',
      description: '',
      hide: false
    };
  }

  function getChangedFields(newData, originalData) {
    return Object.fromEntries(
      Object.entries(newData).filter(([key, value]) => {
        if (key === 'startDate' || key === 'endDate') {
          const originalDate = originalData[key] ? new Date(originalData[key]).toISOString().split('T')[0] : '';
          const newDate = value ? new Date(value).toISOString().split('T')[0] : '';
          return originalDate !== newDate;
        }
        return originalData[key] !== value;
      })
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

  const isStartDateDisabled = (date) => {
    return formData.endDate && date > formData.endDate;
  };

  const isEndDateDisabled = (date) => {
    return formData.startDate && date < formData.startDate;
  };

  const handleCancel = () => {
    setFormData(initialFormData());
    setAddData(false);
    setEditIndex(null);
  };

  const handleSave = async () => {
    try {
      if (!formData.jobTitle.trim()) {
        toast.warning("Please fill in required fields: Job Title.");
        return;
      }

      if (editIndex !== null) {
        console.log("Is editing");
        const original = professionalList[editIndex];
        const updatedFields = getChangedFields(formData, original);

        if (Object.keys(updatedFields).length > 0) {
          await updateProfessionalExperience(updatedFields, original._id);
          console.log(updatedFields);
        }

        const updatedList = [...professionalList];
        updatedList[editIndex] = { ...original, ...updatedFields };
        setProfessionalList(updatedList);
      } else {
        const filledData = getFilledFields(formData);
        const response = await addNewProfessionalExperience(filledData);

        // Assuming response contains the newly created item (with `_id`)
        if (response && response._id) {
          const newItem = { ...filledData, _id: response._id };
          setProfessionalList((prevList) => [...prevList, newItem]);
        } else {
          console.warn("New item not returned properly:", response);
        }
      }
      setAddData(false);
      setEditIndex(null);
      setFormData(initialFormData());
    } catch (error) {
      console.error("Error saving:", error);
    }
  };
  

  const handleEdit = (index) => {
    setEditIndex(index);
    const rawData = professionalList[index];
    const normalized = normalizeProfessionalData(rawData);
    setFormData(normalized);
  };


  const handleDelete = async (index) => {
    const id = professionalList[index]._id;
    try {
      await deleteProfessionalExperience(id);
  
      // Remove the item locally
      const updatedList = professionalList.filter((_, i) => i !== index);
      setProfessionalList(updatedList);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserProfessionalExperiences();
      if (data) {
        const normalizedList = data.map(normalizeProfessionalData)
        setProfessionalList(normalizedList);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='flex flex-col w-full'>
      <Card className="w-full max-w-xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-sm">
        <Toaster />

        {/* Form: Add or Edit */}
        {(professionalList.length === 0 || editIndex !== null || addData) && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {editIndex !== null ? 'Update Experience' : 'Add Experience'}
            </h2>
            <FormInputs
              formData={formData}
              onChange={handleInputChange}
              onDateChange={handleDateChange}
              onSubmit={handleSave}
              isEndDateDisabled={isEndDateDisabled}
              isStartDateDisabled={isStartDateDisabled}
              cancel={editIndex === null ? addData : editIndex + 1}
              onCancel={handleCancel}
              submitLabel={editIndex !== null ? "Update" : "Save"}
            />
          </div>
        )}

        {/* Accordion: View Experience */}
        {professionalList.length > 0 && editIndex === null && addData === false && (
          <div className='justify-center'>
            <Accordion type="multiple" className="w-full space-y-2 pt-2">
              {professionalList.map((exp, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="p-4">
                  <div className="flex justify-center items-center pr-2">
                    <AccordionTrigger className="w-full flex justify-between items-center">
                      <p className="text-center text-2xl font-semibold">
                        {exp.jobTitle || "Untitled Role"} at {exp.employer || "Unknown"}
                      </p>
                    </AccordionTrigger>
                  </div>

                  <AccordionContent>
                    
                      <div className="text-center pt-2 space-y-1 text-muted-foreground text-lg">
                        <p><strong>Location:</strong> {exp.city}, {exp.country}</p>
                        <p><strong>Duration:</strong> {exp.startDate ? format(new Date(exp.startDate), 'MMM yyyy') : ''} - {exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : ''}</p>
                        <p><strong>Description:</strong> {exp.description}</p>
                        {exp.link && (
                          <p>
                            <strong>Link:</strong>{" "}                     
                              {exp.link}                  
                          </p>
                        )}
                      </div>
                    
                    <div className="flex justify-end pt-3 gap-2 pr-4">
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
            <div className='flex justify-center'>
              <Button onClick={() => setAddData(true)}>
                Add <Plus />
              </Button>
            </div>
          </div>
        )}
      </Card>
      <div className='w-full max-w-4xl px-4 mx-auto mt-10 mb-6 flex justify-between'>
          <Button variant="outline" onClick={() => navigate('/onboarding/education-section')} className='font-semibold py-2 px-6 rounded'>
              Back
          </Button>
          <Button onClick={() => navigate('/onboarding/skills-section')} className='font-semibold py-2 px-6 rounded'>
              {professionalList.length === 0 ? 'Skip' : 'Continue'}
          </Button>
      </div>
    </div>
  );
};

const FormInputs = ({ formData, onChange, onDateChange, onSubmit, isEndDateDisabled, isStartDateDisabled, cancel, onCancel, submitLabel = "Save" }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-4 items-center gap-4">
        <div className="col-span-4">
            <Label htmlFor="jobTitle" className="px-1 pb-1">Job Title</Label>
            <Input
                id="jobTitle"
                placeholder="Job Title"
                className="col-span-4"
                value={formData.jobTitle}
                onChange={onChange}
                required
            />
        </div>
        <div className="col-span-4">
            <Label htmlFor="employer" className="px-1 pb-1">Employer</Label>
            <Input
                id="employer"
                placeholder="Employer"
                className="col-span-4"
                value={formData.employer}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4">
            <Label htmlFor="link" className="px-1 pb-1">Link</Label>
            <Input
                id="link"
                placeholder="Link"
                className="col-span-4"
                value={formData.link}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4 sm:col-span-2">
            <Label htmlFor="country" className="px-1 pb-1">Country</Label>
            <Input
                id="country"
                placeholder="Country"
                className="col-span-4 sm:col-span-2"
                value={formData.country}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4 sm:col-span-2">
            <Label htmlFor="city" className="px-1 pb-1">City</Label>
            <Input
                id="city"
                placeholder="City"
                className="col-span-4 sm:col-span-2"
                value={formData.city}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4 sm:col-span-2">
            <Label htmlFor="startDate" className="px-1 pb-1">Start Date</Label>
            <DatePicker
                id="startDate"
                style={{ width: '100%' }}
                value={formData.startDate}
                shouldDisableDate={isStartDateDisabled}
                onChange={(date) =>
                onDateChange(date, 'startDate')}
            />
        </div>
        <div className="col-span-4 sm:col-span-2">
            <Label htmlFor="endDate" className="px-1 pb-1">End Date</Label>
            <DatePicker
                id="endDate"
                style={{ width: '100%' }}
                value={formData.endDate}
                shouldDisableDate={isEndDateDisabled}
                onChange={(date) =>
                onDateChange(date, 'endDate')}
            />
        </div>
        <div className="col-span-4">
            <Label htmlFor="description" className="px-1 pb-1">Professional Description</Label>
            <Textarea
                id="description"
                placeholder="Enter Professional Description"
                className="col-span-4"
                value={formData.description}
                onChange={onChange} />
        </div>
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
);


export default ProfessionalCard;