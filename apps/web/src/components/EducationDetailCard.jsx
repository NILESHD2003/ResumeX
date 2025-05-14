import { useState, useEffect } from 'react';
import { Card } from "./ui/card";
import { Input } from './ui/input';
import { Button } from "./ui/button";
import { Label } from './ui/label';
import { Plus, Trash2, Pencil } from "lucide-react";
import { Textarea } from "./ui/textarea";
import DatePicker from 'rsuite/DatePicker';
import 'rsuite/DatePicker/styles/index.css';
import { 
  getUserEducationDetails,
  addNewEducationDetails,
  updateEducationDetail,
  deleteEducationDetail
} from '../services/operations/educationDetailsAPIS';
import { Toaster, toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const EducationCard = () => {
  const [educationList, setEducationList] = useState([]);
  const [formData, setFormData] = useState(initialFormData());
  const [editIndex, setEditIndex] = useState(null);
  const [addData, setAddData] = useState(false);
  const navigate = useNavigate();

  function initialFormData() {
    return {
      degree: '',
      grade: '',
      school: '',
      link: '',
      country: '',
      city: '',
      startDate: '',
      endDate: '',
      description: '',
      hide: false,
    };
  }

  function normalizeEducationData(data) {
    return {
      degree: data.degree ?? '',
      grade: data.grade ?? '',
      school: data.school ?? '',
      link: data.link ?? '',
      country: data.country ?? '',
      city: data.city ?? '',
      startDate: data.startDate ? new Date(data.startDate) : '',
      endDate: data.endDate ? new Date(data.endDate) : '',
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

  const isStartDateDisabled = (date) => {
    return formData.endDate && date > formData.endDate;
  };

  const isEndDateDisabled = (date) => {
    return formData.startDate && date < formData.startDate;
  };

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

  const handleSave = async () => {
    try {
      if (!formData.degree.trim()) {
        toast.warning("Please fill in required fields: Degree.");
        return;
      }

      if (editIndex !== null) {
        const original = educationList[editIndex];
        const updatedFields = getChangedFields(formData, original);
    
        if (Object.keys(updatedFields).length > 0) {
          await updateEducationDetail(updatedFields, original._id);
          console.log(updatedFields)
        }
    
        const updatedList = [...educationList];
        updatedList[editIndex] = { ...original, ...updatedFields };
        setEducationList(updatedList);
      } else {
        const filledData = getFilledFields(formData);
        const response = await addNewEducationDetails(filledData);
        if (response && response._id) {
          const newItem = { ...filledData, _id: response._id };
          setEducationList((prevList) => [...prevList, newItem]);
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
  
  const handleDelete = async (index) => {
    const id = educationList[index]._id;
    try {
      await deleteEducationDetail(id);
  
      // Remove the item locally
      const updatedList = educationList.filter((_, i) => i !== index);
      setEducationList(updatedList);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    const rawData = educationList[index];
    const normalized = normalizeEducationData(rawData);
    setFormData(normalized);
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
    <div className='flex flex-col w-full'>
      <Card className="w-full max-w-xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-sm">
        <Toaster />

        {(educationList.length === 0 || editIndex !== null || addData) && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {editIndex !== null ? 'Update Education' : 'Add Education'}
            </h2>
            <FormInputs
              formData={formData}
              onChange={handleInputChange}
              onDateChange={handleDateChange}
              onSubmit={handleSave}
              isEndDateDisabled={isEndDateDisabled}
              isStartDateDisabled={isStartDateDisabled}
              submitLabel={editIndex !== null ? "Update" : "Save"}
            />
          </div>
        )}

        {educationList.length > 0 && editIndex === null && addData === false && (
          <div className='justify-center'>
            <Accordion type="multiple" className="w-full space-y-2 pt-2">
              {educationList.map((edu, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="p-2">
                  <div className="flex justify-center items-center pr-2">
                    <AccordionTrigger className="w-full flex justify-between items-center">
                      <p className="text-center text-2xl font-semibold">
                        {edu.degree || "Untitled Degree"} at {edu.school || "Unknown"}
                      </p>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent>           
                      <div className="text-center pt-2 space-y-1 text-muted-foreground text-lg">
                        <p><strong>Location:</strong> {edu.city}, {edu.country}</p>
                        <p><strong>Duration:</strong> {edu.startDate ? format(new Date(edu.startDate), 'MMM yyyy') : ''} - {edu.endDate ? format(new Date(edu.endDate), 'MMM yyyy') : ''}</p>
                        <p><strong>Description:</strong> {edu.description}</p>
                        {edu.link && (
                          <p>
                            <strong>Link:</strong>{" "}                     
                              {edu.link}                  
                          </p>
                        )}
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
          <Button variant="outline" onClick={() => navigate('/onboarding/profile-summary')} className='font-semibold py-2 px-6 rounded'>
              Back
          </Button>
          <Button onClick={() => navigate('/onboarding/professional-section')} className='font-semibold py-2 px-6 rounded'>
              {educationList.length === 0 ? 'Skip' : 'Continue'}
          </Button>
      </div>
    </div>
  );
};

const FormInputs = ({ formData, onChange, onDateChange, onSubmit, isEndDateDisabled, isStartDateDisabled, submitLabel = "Save" }) => (
  <div className='space-y-4'>
    <div className="grid gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="degree" className="px-1 pb-1">Degree</Label>
                <Input
                    type="text"
                    id="degree"
                    placeholder="Degree/Qualification"
                    value={formData.degree}
                    onChange={onChange}
                    required
                />
            </div>
            <div>
                <Label htmlFor="grade" className="px-1 pb-1">Grade/Percentage/CGPA</Label>
                <Input
                    type="text"
                    id="grade"
                    placeholder="Grade"
                    value={formData.grade}
                    onChange={onChange}
                />
            </div>
            <div className="sm:col-span-2">
                <Label htmlFor="school" className="px-1 pb-1">Institution Name</Label>
                <Input
                    type="text"
                    id="school"
                    placeholder="School/College"
                    className="sm:col-span-2"
                    value={formData.school}
                    onChange={onChange}
                />
            </div>
            <div className="sm:col-span-2">
                <Label htmlFor="link" className="px-1 pb-1">Relevant Link (e.g., Program Page)</Label>
                <Input
                    type="url"
                    id="link"
                    placeholder="Link"
                    className="sm:col-span-2"
                    value={formData.link}
                    onChange={onChange}
                />
            </div>
            <div>
                <Label htmlFor="country" className="px-1 pb-1">Country</Label>
                <Input
                    type="text"
                    id="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={onChange}
                />
            </div>
            <div>
                <Label htmlFor="city" className="px-1 pb-1">City</Label>
                <Input
                    type="text"
                    id="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={onChange}
                />
            </div>
            <div>
                <Label htmlFor="startDate" className="px-1 pb-1">Start Date</Label>
                <DatePicker
                    id="startDate"
                    style={{ width: '100%' }}
                    value={formData.startDate}
                    onChange={(date) =>
                    onDateChange(date, 'startDate')}
                    shouldDisableDate={isStartDateDisabled}
                />
            </div>
            <div>
                <Label htmlFor="endDate" className="px-1 pb-1">End Date</Label>
                <DatePicker
                    id="endDate"
                    style={{ width: '100%' }}
                    value={formData.endDate}
                    onChange={(date) =>
                    onDateChange(date, 'endDate')}
                    shouldDisableDate={isEndDateDisabled}
                />
            </div>
        </div>
        <div>
            <Label htmlFor="description" className="px-1 pb-1">Description</Label>
            <Textarea
                id="description"
                placeholder="Enter Education Description"
                value={formData.description}
                onChange={onChange}
                className="min-h-[100px] resize-none"
            />
        </div>
    </div>
    <div className="text-right">
        <Button onClick={onSubmit}>{submitLabel}</Button>
    </div>
  </div>
)

export default EducationCard;
