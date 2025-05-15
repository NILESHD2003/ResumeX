import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Pencil } from "lucide-react";
import DatePicker from 'rsuite/DatePicker';
import 'rsuite/DatePicker/styles/index.css';
import { Textarea } from "@/components/ui/textarea";
import { Label } from './ui/label';
import { Toaster, toast } from "sonner";
import { 
  getUserOrganizationsDetails,
  addNewOrganizationDetail,
  updateOrganizationDetail,
  deleteOrganizationDetail 
} from "../services/operations/organizationDetailsAPIS";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from 'date-fns';

const OrganizationDetailCard = () => {
  const [organizations, setOrganizations] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [addData, setAddData] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    city: "",
    country: "",
    startDate: "",
    endDate: "",
    description: "",
    hide: false,
  });
  const navigate = useNavigate();

  const resetForm = () => {
    setFormData({
      name: "",
      link: "",
      city: "",
      country: "",
      startDate: "",
      endDate: "",
      description: "",
      hide: false,
    });
  };

  function normalizeOrganizationsData(data) {
    return {
      name: data.name ?? '',
      link: data.link ?? '',
      city: data.city ?? '',
      country: data.country ?? '',
      startDate: data.startDate ? new Date(data.startDate) : '',
      endDate: data.endDate ? new Date(data.endDate) : '',
      description: data.description ?? '',
      hide: Boolean(data.hide),
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
      if (!formData.name.trim()) {
        toast.warning("Organization name is required.");
        return;
      }
  
      if (editIndex !== null) {
        const original = organizations[editIndex];
        const updatedFields = getChangedFields(formData, original);
  
        if (Object.keys(updatedFields).length > 0) {
          await updateOrganizationDetail(updatedFields, original._id);
          const updatedOrganizations = [...organizations];
          updatedOrganizations[editIndex] = { ...original, ...updatedFields };
          setOrganizations(updatedOrganizations);
        }
      } else {
        const filledData = getFilledFields(formData);
        const response = await addNewOrganizationDetail(filledData);
        if (response && response._id) {
          setOrganizations((prev) => [...prev, { ...filledData, _id: response._id }]);
        }
      }
      setAddData(false);
      setEditIndex(null);
      resetForm();
    } catch (error) {
      console.error("Error saving organization detail:", error);
      toast.error("Failed to save organization.");
    }
  };  

  const handleEdit = (index) => {
    setEditIndex(index);
    const rawData = organizations[index];
    const normalized = normalizeOrganizationsData(rawData);
    setFormData(normalized);
  };

  const handleDelete = async (index) => {
    const id = organizations[index]._id;
    try {
      await deleteOrganizationDetail(id);
      setOrganizations((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting organization:", error);
      toast.error("Failed to delete organization.");
    }
  };

  useEffect(() => {
      const fetchData = async () => {
        const data = await getUserOrganizationsDetails();
        if (data) {
          const normalizedList = data.map(normalizeOrganizationsData)
          setOrganizations(normalizedList);
        }
      };
      fetchData();
    }, []);

  return (
    <div className='flex flex-col w-full'>
      <Card className="max-w-xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm">
        <Toaster />
        {(organizations.length === 0 || editIndex !== null || addData) && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {editIndex !== null ? 'Update Organization' : 'Add Organization'}
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

        {organizations.length > 0 && editIndex === null && addData === false && (
          <div className="justify-center">
            <Accordion type="multiple" className="w-full space-y-2 pt-2">
              {organizations.map((organization, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="p-2">
                  <div className="flex justify-center items-center pr-2">
                    <AccordionTrigger className="w-full flex justify-between items-center">
                      <p className="text-center text-2xl font-semibold">
                        {organization.name || "Untitled Organization" }
                      </p>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent>         
                      <div className="text-center pt-2 space-y-1 text-muted-foreground text-lg">
                        <p><strong>Location:</strong> {organization.city}, {organization.country}</p>
                        <p><strong>Duration:</strong> {organization.startDate ? format(new Date(organization.startDate), 'MMM yyyy') : ''} - {organization.endDate ? format(new Date(organization.endDate), 'MMM yyyy') : ''}</p>
                        <p><strong>Description:</strong> {organization.description}</p>
                        {organization.link && (
                          <p>
                            <strong>Link:</strong>{" "}                     
                              {organization.link}                  
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
          <Button variant="outline" onClick={() => navigate('/onboarding/courses-section')} className='font-semibold py-2 px-6 rounded'>
              Back
          </Button>
          <Button onClick={() => navigate('/onboarding/publications-section')} className='font-semibold py-2 px-6 rounded'>
              {organizations.length === 0 ? 'Skip' : 'Continue'}
          </Button>
      </div>
    </div>
  );
};

const FormInputs = ({ formData, onChange, onDateChange, onSubmit, isEndDateDisabled, isStartDateDisabled, submitLabel = "Save" }) => (
  <div className='space-y-4'>
    <div className="grid grid-cols-4 items-center gap-4">
        <div className="col-span-4">
            <Label htmlFor="name" className="px-1 pb-1">Organization Name</Label>
            <Input
                type="text"
                id="name"
                placeholder="Organization Name"
                className="col-span-4"
                value={formData.name}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4">
            <Label htmlFor="link" className="px-1 pb-1">Organization Link</Label>
            <Input
                type="text"
                id="link"
                placeholder="Organization Link"
                className="col-span-4"
                value={formData.link}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4 sm:col-span-2">
            <Label htmlFor="city" className="px-1 pb-1">City</Label>
            <Input
                type="text"
                id="city"
                placeholder="City"
                className="col-span-4 sm:col-span-2"
                value={formData.city}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4 sm:col-span-2">
            <Label htmlFor="country" className="px-1 pb-1">Country</Label>
            <Input
                type="text"
                id="country"
                placeholder="Country"
                className="col-span-4 sm:col-span-2"
                value={formData.country}
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
            <Label htmlFor="description" className="px-1 pb-1">Description</Label>
            <Textarea
                className="col-span-4"
                id="description"
                placeholder="Enter Description"
                value={formData.description}
                onChange={onChange}
            />
        </div>
    </div>
    <div className="text-right">
        <Button onClick={onSubmit}>{submitLabel}</Button>
    </div>
  </div>
)

export default OrganizationDetailCard;
