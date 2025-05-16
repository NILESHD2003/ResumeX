import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import DatePicker from 'rsuite/DatePicker';
import 'rsuite/DatePicker/styles/index.css';
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster, toast } from "sonner";
import { Label } from './ui/label';
import { useNavigate } from 'react-router-dom';
import { 
  getUserProjectsDetails,
  addNewProjectDetail,
  updateProjectDetail,
  deleteProjectDetail 
} from "../services/operations/projectDetailsAPIS";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from 'date-fns';

const ProjectDetailsCard = () => {
  const [projects, setProjects] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [addData, setAddData] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    startDate: '',
    endDate: '',
    links: [{ url: '', platform: '' }],
    hide: false,
  });

  function normalizeProjectsData(data) {
    return {
      title: data.title ?? '',
      subtitle: data.subtitle ?? '',
      description: data.description ?? '',
      startDate: data.startDate ? new Date(data.startDate) : '',
      endDate: data.endDate ? new Date(data.endDate) : '',
      links: data.links ?? [{ url: '', platform: '' }],
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

  const handleCancel = () => {
    resetForm();
    setAddData(false);
    setEditIndex(null);
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
        if (!formData.title.trim()) {
          toast.warning("Project title is required.");
          return;
        }
    
        if (editIndex !== null) {
          const original = projects[editIndex];
          const updatedFields = getChangedFields(formData, original);
    
          if (Object.keys(updatedFields).length > 0) {
            await updateProjectDetail(updatedFields, original._id);
            const updatedProjects = [...projects];
            updatedProjects[editIndex] = { ...original, ...updatedFields };
            setProjects(updatedProjects);
          }
        } else {
          const filledData = getFilledFields(formData);
          const response = await addNewProjectDetail(filledData);
          if (response && response._id) {
            setProjects((prev) => [...prev, { ...filledData, _id: response._id }]);
          }
        }
        setAddData(false);
        setEditIndex(null);
        resetForm();
      } catch (error) {
        console.error("Error saving project detail:", error);
        toast.error("Failed to save project.");
      }
    };    

  const handleEdit = (index) => {
    setEditIndex(index);
    const rawData = projects[index]
    const normalized = normalizeProjectsData(rawData)
    setFormData(normalized);
  };

  const handleDelete = async (index) => {
      const id = projects[index]._id;
      try {
        await deleteProjectDetail(id);
        setProjects((prev) => prev.filter((_, i) => i !== index));
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project.");
      }
    };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      startDate: '',
      endDate: '',
      links: [{ url: '', platform: '' }],
      hide: false,
    });
  };

  const addLinkField = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { url: '', platform: '' }],
    }));
  };

  const updateLink = (index, field, value) => {
    const updatedLinks = [...formData.links];
    updatedLinks[index][field] = value;
    setFormData((prev) => ({ ...prev, links: updatedLinks }));
  };

  const deleteLink = (index) => {
    const updatedLinks = formData.links.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, links: updatedLinks }));
  };

  useEffect(() => {
        const fetchData = async () => {
          const data = await getUserProjectsDetails();
          if (data) {
            const normalizedList = data.map(normalizeProjectsData)
            setProjects(normalizedList);
          }
        };
        fetchData();
      }, []);

  return (
    <div className='flex flex-col w-full'>
      <Card className="max-w-xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm">
        <Toaster />
        
        {(projects.length === 0 || editIndex !== null || addData) && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {editIndex !== null ? 'Update Project' : 'Add Project'}
            </h2>
            <FormInputs
              formData={formData}
              onChange={handleInputChange}
              onDateChange={handleDateChange}
              addLinkField={addLinkField}
              updateLink={updateLink}
              deleteLink={deleteLink}
              onSubmit={handleSave}
              isEndDateDisabled={isEndDateDisabled}
              isStartDateDisabled={isStartDateDisabled}
              cancel={editIndex === null ? addData : editIndex + 1}
              onCancel={handleCancel}
              submitLabel={editIndex !== null ? "Update" : "Save"}
            />
          </div>
        )}

        {projects.length > 0 && editIndex === null && addData === false && (
          <div className="justify-center">
            <Accordion type="multiple" className="w-full space-y-2 pt-2">
              {projects.map((project, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="p-2">
                  <div className="flex justify-center items-center pr-2">
                    <AccordionTrigger className="w-full flex justify-between items-center">
                      <p className="text-center text-2xl font-semibold">
                        {project.title || "Untitled Project"}
                      </p>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent>                
                      <div className="text-center pt-2 space-y-1 text-muted-foreground text-lg">
                        <p><strong>Subtitle:</strong> {project.subtitle}</p>
                        <p><strong>Duration:</strong> {project.startDate ? format(new Date(project.startDate), 'MMM yyyy') : ''} - {project.endDate ? format(new Date(project.endDate), 'MMM yyyy') : ''}</p>
                        <p><strong>Description:</strong> {project.description}</p>
                        <strong>Link:</strong>{" "}
                        <ul>
                          {project.links.map((link, index) => (
                            <li key={index}>{link.platform}: {link.url}</li>
                          ))}
                        </ul>                     
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
          <Button variant="outline" onClick={() => navigate('/onboarding/certificates-section')} className='font-semibold py-2 px-6 rounded'>
              Back
          </Button>
          <Button onClick={() => navigate('/onboarding/awards-section')} className='font-semibold py-2 px-6 rounded'>
              {projects.length === 0 ? 'Skip' : 'Continue'}
          </Button>
      </div>
    </div>
  );
};

const FormInputs = ({ formData, onChange, onDateChange, onSubmit, updateLink, addLinkField, deleteLink, isEndDateDisabled, isStartDateDisabled, cancel, onCancel, submitLabel = "Save" }) => (
  <div className='space-y-4'>
    <div className="grid grid-cols-4 items-center gap-4">
        <div className="col-span-4">
            <Label htmlFor="title" className="px-1 pb-1">Project Title</Label>
            <Input
                type="text"
                id="title"
                placeholder="Project Title"
                className="col-span-4"
                value={formData.title}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4">
            <Label htmlFor="subtitle" className="px-1 pb-1">Subtitle</Label>
            <Input
                type="text"
                id="subtitle"
                placeholder="Subtitle"
                className="col-span-4"
                value={formData.subtitle}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4">
            <Label htmlFor="description" className="px-1 pb-1">Description</Label>
            <Textarea
                id="description"
                className="col-span-4"
                placeholder="Enter Description"
                value={formData.description}
                onChange={onChange}
            />
        </div>
        <div className="col-span-2">
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
        <div className="col-span-2">
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
    </div>

    <div className="space-y-2">
        <Label className="px-1">Project Links</Label>
        {formData.links.map((link, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 items-center">
                <Input
                    placeholder="Link"
                    className="col-span-3"
                    value={link.url}
                    onChange={(e) => updateLink(index, "url", e.target.value)}
                />
                <Select
                    value={link.platform}
                    onValueChange={(val) => updateLink(index, "platform", val)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="GITHUB">GitHub</SelectItem>
                        <SelectItem value="WEBSITE">Website</SelectItem>
                        <SelectItem value="APP_STORE">App Store</SelectItem>
                        <SelectItem value="PLAY_STORE">Play Store</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full"
                    onClick={() => deleteLink(index)}
                    type="button"
                >
                    <Trash2 size={16} />
                </Button>
            </div>
        ))}
        <Button variant="ghost" className="w-full" type="button" onClick={addLinkField}>
            Add Another Link <Plus size={14} />
        </Button>
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

export default ProjectDetailsCard;