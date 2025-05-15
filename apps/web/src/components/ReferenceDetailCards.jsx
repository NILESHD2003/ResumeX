import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { 
  getUserReferencesDetails,
  addNewReferenceDetail,
  updateReferenceDetail,
  deleteReferenceDetail 
} from "../services/operations/referenceDetailsAPIS";
import { Label } from './ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ReferenceDetailCard = () => {
  const [references, setReferences] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [addData, setAddData] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    jobTitle: "",
    organization: "",
    email: "",
    phone: "",
    hide: false,
  });
  const navigate = useNavigate();

  function normalizeReferencesData(data) {
    return {
      name: data.name ?? '',
      link: data.link ?? '',
      jobTitle: data.jobTitle ?? '',
      organization: data.organization ?? '',
      email: data.email ?? '',
      phone: data.phone ?? '',
      hide: Boolean(data.hide),
      _id: data._id, // keep id if present for editing
    };
  }

  const resetForm = () => {
    setFormData({
      name: "",
      link: "",
      jobTitle: "",
      organization: "",
      email: "",
      phone: "",
      hide: false,
    });
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
        toast.warning("Reference name is required.");
        return;
      }
  
      if (editIndex !== null) {
        const original = references[editIndex];
        const updatedFields = getChangedFields(formData, original);
  
        if (Object.keys(updatedFields).length > 0) {
          await updateReferenceDetail(updatedFields, original._id);
          const updatedReferences = [...references];
          updatedReferences[editIndex] = { ...original, ...updatedFields };
          setReferences(updatedReferences);
        }
      } else {
        const filledData = getFilledFields(formData);
        const response = await addNewReferenceDetail(filledData);
        if (response && response._id) {
          setReferences((prev) => [...prev, { ...filledData, _id: response._id }]);
        }
      }
      setAddData(false);
      setEditIndex(null);
      resetForm();
    } catch (error) {
      console.error("Error saving reference detail:", error);
      toast.error("Failed to save reference.");
    }
  };  

  const handleEdit = (index) => {
    setEditIndex(index);
    const rawData = references[index];
    const normalized = normalizeReferencesData(rawData);
    setFormData(normalized);
  };

  const handleDelete = async (index) => {
    const id = references[index]._id;
    try {
      await deleteReferenceDetail(id);
      setReferences((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting references:", error);
      toast.error("Failed to delete references.");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

useEffect(() => {
  const fetchData = async () => {
    const data = await getUserReferencesDetails();
    if (data) {
      const normalizedList = data.map(normalizeReferencesData)
      setReferences(normalizedList);
    }
  };
  fetchData();
}, []);

  return (
    <div className='flex flex-col w-full'>
      <Card className="max-w-xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm">
        <Toaster />
        
        {(references.length === 0 || editIndex !== null || addData) && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {editIndex !== null ? 'Update Reference' : 'Add Reference'}
            </h2>
            <FormInputs
              formData={formData}
              onChange={handleInputChange}
              onSubmit={handleSave}
              submitLabel={editIndex !== null ? "Update" : "Save"}
            />
          </div>
        )}

        {references.length > 0 && editIndex === null && addData === false && (
          <div className="justify-center">
            <Accordion type="multiple" className="w-full space-y-2 pt-2">
              {references.map((reference, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="p-2">
                  <div className="flex justify-center items-center pr-2">
                    <AccordionTrigger className="w-full flex justify-between items-center">
                      <p className="text-center text-2xl font-semibold">
                        {reference.name || "Untitled Reference"}
                      </p>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent>           
                      <div className="text-center pt-2 space-y-1 text-muted-foreground text-lg">
                        <p><strong>Job Title:</strong> {reference.jobTitle}</p>
                        <p><strong>Organization:</strong> {reference.organization}</p>
                        <p><strong>Phone No:</strong> {reference.phone}</p>
                        <p><strong>Email:</strong> {reference.email}</p>
                        
                        {reference.link && (
                          <p>
                            <strong>Link:</strong>{" "}                     
                              {reference.link}                  
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
          <Button variant="outline" onClick={() => navigate('/onboarding/publications-section')} className='font-semibold py-2 px-6 rounded'>
              Back
          </Button>
          <Button onClick={() => navigate('/onboarding/declaration-section')} className='font-semibold py-2 px-6 rounded'>
              {references.length === 0 ? 'Skip' : 'Continue'}
          </Button>
      </div>
    </div>
  );
};

const FormInputs = ({ formData, onChange, onSubmit, submitLabel = "Save" }) => (
  <div className='space-y-4'>
    <div className="grid grid-cols-4 items-center gap-4 py-2">
        <div className="col-span-4">
            <Label htmlFor="name" className="px-1 pb-1">Reference Name</Label>
            <Input
                type="text"
                id="name"
                placeholder="Reference Name"
                className="col-span-4"
                value={formData.name}
                onChange={onChange}
            />
        </div>

        <div className="col-span-4">
            <Label htmlFor="link" className="px-1 pb-1">Reference Link</Label>
            <Input
                type="text"
                id="link"
                placeholder="Reference Link"
                className="col-span-4"
                value={formData.link}
                onChange={onChange}
            />
        </div>

        <div className="col-span-4 sm:col-span-2">
            <Label htmlFor="jobTitle" className="px-1 pb-1">Job Title</Label>
            <Input
                type="text"
                id="jobTitle"
                placeholder="Job Title"
                className="col-span-4 sm:col-span-2"
                value={formData.jobTitle}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4 sm:col-span-2">
            <Label htmlFor="organization" className="px-1 pb-1">Organization</Label>
            <Input
                type="text"
                id="organization"
                placeholder="Organization"
                className="col-span-4 sm:col-span-2"
                value={formData.organization}
                onChange={onChange}
            />
        </div>

        <div className="col-span-4">
            <Label htmlFor="email" className="px-1 pb-1">Email</Label>
            <Input
                type="email"
                id="email"
                placeholder="Email"
                className="col-span-4"
                value={formData.email}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4">
            <Label htmlFor="phone" className="px-1 pb-1">Phone no.</Label>
            <Input
                type="text"
                id="phone"
                placeholder="Phone no."
                className="col-span-4"
                value={formData.phone}
                onChange={onChange}
            />
        </div>
    </div>
    <div className="text-right">
        <Button onClick={onSubmit}>{submitLabel}</Button>
    </div>
  </div>
)

export default ReferenceDetailCard;