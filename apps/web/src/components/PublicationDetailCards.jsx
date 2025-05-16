import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil } from "lucide-react";
import DatePicker from 'rsuite/DatePicker';
import 'rsuite/DatePicker/styles/index.css';
import { Textarea } from "@/components/ui/textarea";
import { Label } from './ui/label';
import { useNavigate } from 'react-router-dom';
import { 
  getUserPublicationsDetails,
  addNewPublicationDetail,
  updatePublicationDetail,
  deletePublicationDetail 
} from "../services/operations/publicationDetailsAPIS";
import { Toaster, toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from 'date-fns';

const PublicationDetailCard = () => {
  const [publications, setPublications] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [addData, setAddData] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    publisher: "",
    date: "",
    description: "",
    hide: false,
  });
  const navigate = useNavigate()

  const resetForm = () => {
    setFormData({
      title: "",
      link: "",
      publisher: "",
      date: "",
      description: "",
      hide: false,
    });
  };

  function normalizePublicationsData(data) {
    return {
      title: data.title ?? '',
      link: data.link ?? '',
      publisher: data.publisher ?? '',
      date: data.date ? new Date(data.date) : '',
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

  const handleCancel = () => {
    resetForm();
    setAddData(false);
    setEditIndex(null);
  };

  function getChangedFields(newData, originalData) {
    return Object.fromEntries(
      Object.entries(newData).filter(([key, value]) => {
        if (key === 'date') {
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
      if (!formData.title.trim()) {
        toast.warning("Publication title is required.");
        return;
      }
  
      if (editIndex !== null) {
        const original = publications[editIndex];
        const updatedFields = getChangedFields(formData, original);
  
        if (Object.keys(updatedFields).length > 0) {
          await updatePublicationDetail(updatedFields, original._id);
          const updatedPublications = [...publications];
          updatedPublications[editIndex] = { ...original, ...updatedFields };
          setPublications(updatedPublications);
        }
      } else {
        const filledData = getFilledFields(formData);
        const response = await addNewPublicationDetail(filledData);
        if (response && response._id) {
          setPublications((prev) => [...prev, { ...filledData, _id: response._id }]);
        }
      }
      setAddData(false);
      setEditIndex(null);
      resetForm();
    } catch (error) {
      console.error("Error saving publication detail:", error);
      toast.error("Failed to save publication.");
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    const rawData = publications[index];
    const normalized = normalizePublicationsData(rawData);
    setFormData(normalized);
  };

  const handleDelete = async (index) => {
    const id = publications[index]._id;
    try {
      await deletePublicationDetail(id);
      setPublications((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting publication:", error);
      toast.error("Failed to delete publication.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserPublicationsDetails();
      if (data) {
        const normalizedList = data.map(normalizePublicationsData)
        setPublications(normalizedList);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='flex flex-col w-full'>
      <Card className="max-w-xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm">
        <Toaster />    
        {(publications.length === 0 || editIndex !== null || addData) && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {editIndex !== null ? 'Update publication' : 'Add publication'}
            </h2>
            <FormInputs
              formData={formData}
              onChange={handleInputChange}
              onDateChange={handleDateChange}
              onSubmit={handleSave}
              cancel={editIndex === null ? addData : editIndex + 1}
              onCancel={handleCancel}
              submitLabel={editIndex !== null ? "Update" : "Save"}
            />
          </div>
        )}

        {publications.length > 0 && editIndex === null && addData === false && (
          <div className="justify-center">
            <Accordion type="multiple" className="w-full space-y-2 pt-2">
              {publications.map((publication, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="p-2">
                  <div className="flex justify-center items-center pr-2">
                    <AccordionTrigger className="w-full flex justify-between items-center">
                      <p className="text-center text-2xl font-semibold">
                        {publication.title || "Untitled Publication"}
                      </p>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent>           
                      <div className="text-center pt-2 space-y-1 text-muted-foreground text-lg">
                        <p><strong>Publisher:</strong> {publication.publisher}</p>
                        <p><strong>Publication Date:</strong> {publication.date ? format(new Date(publication.date), 'MMM yyyy') : ''}</p>
                        <p><strong>Description:</strong> {publication.description}</p>
                        {publication.link && (
                          <p>
                            <strong>Link:</strong>{" "}                     
                              {publication.link}                  
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
          <Button variant="outline" onClick={() => navigate('/onboarding/organizations-section')} className='font-semibold py-2 px-6 rounded'>
              Back
          </Button>
          <Button onClick={() => navigate('/onboarding/references-section')} className='font-semibold py-2 px-6 rounded'>
              {publications.length === 0 ? 'Skip' : 'Continue'}
          </Button>
      </div>
    </div>
  );
};

const FormInputs = ({ formData, onChange, onDateChange, onSubmit, cancel, onCancel, submitLabel = "Save" }) => (
<div className='space-y-4'>
    <div className="grid grid-cols-4 items-center gap-4">
        <div className="col-span-4">
            <Label htmlFor="title" className="px-1 pb-1">Publication Title</Label>
            <Input
                type="text"
                id="title"
                placeholder="Publication Title"
                className="col-span-4"
                value={formData.title}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4">
            <Label htmlFor="link" className="px-1 pb-1">Publication Link</Label>
            <Input
                type="text"
                id="link"
                placeholder="Publication Link"
                className="col-span-4"
                value={formData.link}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4 sm:col-span-2">
            <Label htmlFor="publisher" className="px-1 pb-1">Publisher</Label>
            <Input
                type="text"
                id="publisher"
                placeholder="Publisher"
                className="col-span-4 sm:col-span-2"
                value={formData.publisher}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4 sm:col-span-2">
            <Label htmlFor="date" className="px-1 pb-1">Publication Date</Label>
            <DatePicker
                id="date"
                style={{ width: '100%' }}
                value={formData.date}
                onChange={(date) =>
                onDateChange(date, 'date')}
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

export default PublicationDetailCard;