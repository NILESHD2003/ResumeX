import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil } from "lucide-react";
import DatePicker from 'rsuite/DatePicker';
import 'rsuite/DatePicker/styles/index.css';
import { Toaster, toast } from "sonner";
import { Label } from './ui/label';
import { useNavigate } from 'react-router-dom';
import { 
  getUserAwardsDetails,
  addNewAwardDetail,
  updateAwardDetail,
  deleteAwardDetail 
} from "../services/operations/awardDetailsAPIS";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from 'date-fns';

const AwardDetailsCard = () => {
  const [awards, setAwards] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [addData, setAddData] = useState(false);
  const [form, setForm] = useState({
    title: "",
    link: "",
    issuer: "",
    date: "",
    hide: false,
  });
  const navigate = useNavigate();

  const resetForm = () => {
    setForm({
      title: "",
      link: "",
      issuer: "",
      date: "",
      hide: false,
    });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (date, field) => {
    setForm((prev) => ({ ...prev, [field]: date }));
  };

  const handleCancel = () => {
    resetForm();
    setAddData(false);
    setEditIndex(null);
  };

  function normalizeAwardsData(data) {
    return {
      title: data.title ?? '',
      link: data.link ?? '',
      issuer: data.issuer ?? '',
      date: data.date ? new Date(data.date) : '',
      hide: Boolean(data.hide),
      _id: data._id, // keep id if present for editing
    };
  }

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
        if (!form.title.trim()) {
          toast.warning("Award title is required.");
          return;
        }
    
        if (editIndex !== null) {
          const original = awards[editIndex];
          const updatedFields = getChangedFields(form, original);
    
          if (Object.keys(updatedFields).length > 0) {
            await updateAwardDetail(updatedFields, original._id);
            const updatedAwards = [...awards];
            updatedAwards[editIndex] = { ...original, ...updatedFields };
            setAwards(updatedAwards);
          }
        } else {
          const filledData = getFilledFields(form);
          const response = await addNewAwardDetail(filledData);
          if (response && response._id) {
            setAwards((prev) => [...prev, { ...filledData, _id: response._id }]);
          }
        }
        setAddData(false);
        setEditIndex(null);
        resetForm();
      } catch (error) {
        console.error("Error saving award detail:", error);
        toast.error("Failed to save award.");
      }
    };  

  const handleEdit = (index) => {
    setEditIndex(index);
    const rawData = awards[index];
    const normalized = normalizeAwardsData(rawData);
    setForm(normalized);
  };

  const handleDelete = async (index) => {
      const id = awards[index]._id;
      try {
        await deleteAwardDetail(id);
        setAwards((prev) => prev.filter((_, i) => i !== index));
      } catch (error) {
        console.error("Error deleting award:", error);
        toast.error("Failed to delete award.");
      }
    };

  useEffect(() => {
        const fetchData = async () => {
          const data = await getUserAwardsDetails();
          if (data) {
            const normalizedList = data.map(normalizeAwardsData)
            setAwards(normalizedList);
          }
        };
        fetchData();
      }, []);

  return (
    <div className='flex flex-col w-full'>
      <Card className="max-w-xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm">
        <Toaster />
        {(awards.length === 0 || editIndex !== null || addData) && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {editIndex !== null ? 'Update Award' : 'Add Award'}
            </h2>
            <FormInputs
              form={form}
              onChange={handleInputChange}
              onDateChange={handleDateChange}
              onSubmit={handleSave}
              cancel={editIndex === null ? addData : editIndex + 1}
              onCancel={handleCancel}
              submitLabel={editIndex !== null ? "Update" : "Save"}
            />
          </div>
        )}

        {awards.length > 0 && editIndex === null && addData === false && (
          <div className="justify-center">
            <Accordion type="multiple" className="w-full space-y-2 pt-2">
              {awards.map((award, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="p-2">
                  <div className="flex justify-center items-center pr-2">
                    <AccordionTrigger className="w-full flex justify-between items-center">
                      <p className="text-center text-2xl font-semibold">
                        {award.title || "Untitled Award"}
                      </p>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent>
                      <div className="text-center pt-2 space-y-1 text-muted-foreground text-lg">
                        <p><strong>Issuer:</strong> {award.issuer}</p>
                        <p><strong>Date:</strong> {award.date ? format(new Date(award.date), 'MMM yyyy') : ''}</p>
                        {award.link && (
                          <p>
                            <strong>Link:</strong>{" "}                     
                              {award.link}                  
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
          <Button variant="outline" onClick={() => navigate('/onboarding/projects-section')} className='font-semibold py-2 px-6 rounded'>
              Back
          </Button>
          <Button onClick={() => navigate('/onboarding/courses-section')} className='font-semibold py-2 px-6 rounded'>
              {awards.length === 0 ? 'Skip' : 'Continue'}
          </Button>
      </div>
    </div>
  );
};

const FormInputs = ({ form, onChange, onDateChange, onSubmit, cancel, onCancel, submitLabel = "Save" }) => (
  <div className='space-y-4'>
    <div className="grid grid-cols-4 items-center gap-4">
        <div className="col-span-4">
            <Label htmlFor="title" className="px-1 pb-1">Award Title</Label>
            <Input
                type="text"
                id="title"
                placeholder="Award Title"
                className="col-span-4"
                value={form.title}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4">
            <Label htmlFor="link" className="px-1 pb-1">Award Link</Label>
            <Input
                type="text"
                id="link"
                placeholder="Award Link"
                className="col-span-4"
                value={form.link}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4 sm:col-span-2">
            <Label htmlFor="issuer" className="px-1 pb-1">Issuer</Label>
            <Input
                type="text"
                id="issuer"
                placeholder="Issuer"
                className="col-span-4 sm:col-span-2"
                value={form.issuer}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4 sm:col-span-2">
            <Label htmlFor="date" className="px-1 pb-1">Award Date</Label>
            <DatePicker
                id="date"
                style={{ width: '100%' }}
                value={form.date}
                onChange={(date) =>
                onDateChange(date, 'date')}
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

export default AwardDetailsCard;