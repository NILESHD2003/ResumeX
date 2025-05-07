import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { DatePicker } from "./DatePicker";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster, toast } from "sonner";
import { 
  getUserProjectsDetails,
  addNewProjectDetail,
  updateProjectDetail,
  toggleProjectDetailVisibility,
  deleteProjectDetail 
} from "../services/operations/projectDetailsAPIS";

const ProjectDetailsCard = () => {
  const [projects, setProjects] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    startDate: '',
    endDate: '',
    links: [],
    hide: false,
  });

  function normalizeProjectsData(data) {
    return {
      title: data.title ?? '',
      subtitle: data.subtitle ?? '',
      description: data.description ?? '',
      startDate: data.startDate ?? '',
      endDate: data.endDate ?? '',
      links: data.links ?? [],
      hide: Boolean(data.hide),
      _id: data._id, // keep id if present for editing
    };
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
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
        if (!formData.title.trim()) {
          toast.warning("Project title is required.");
          return;
        }
    
        if (isEditing) {
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
    
        resetForm();
        setDialogOpen(false);
        setIsEditing(false);
        setEditIndex(null);
      } catch (error) {
        console.error("Error saving project detail:", error);
        toast.error("Failed to save project.");
      }
    };    

  const handleEdit = (index) => {
    const rawData = projects[index]
    const normalized = normalizeProjectsData(rawData)
    setFormData(normalized);
    setIsEditing(true);
    setEditIndex(index);
    setDialogOpen(true);
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

  const toggleVisibility = async (index) => {
      const id = projects[index]._id;
      try {
        await toggleProjectDetailVisibility(id);
        const updated = [...projects];
        updated[index].hide = !updated[index].hide;
        setProjects(updated);
      } catch (error) {
        console.error("Error toggling project visibility:", error);
        toast.error("Failed to toggle visibility.");
      }
    };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      startDate: '',
      endDate: '',
      links: [],
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
    <Card className="max-w-xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm">
      <h1 className="text-3xl font-bold text-center mb-4">Project Details</h1>
      <Toaster />
      {projects.map((project, index) => (
        <Card key={project.id || index} className="mb-4 border p-4 rounded-lg relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <Button variant="ghost" onClick={() => handleEdit(index)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="ghost" onClick={() => handleDelete(index)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => toggleVisibility(index)}>
                {project.hide ? (
                <EyeOff className="w-4 h-4 text-gray-500" />
                ) : (
                <Eye className="w-4 h-4 text-green-600" />
                )}
            </Button>
          </div>
          {!project.hide ? (
            <div className="space-y-1">
                <p><span className="font-semibold">Title:</span> {project.title}</p>
            </div>
          ) : (
            <p className="text-center italic text-gray-500">This certification is hidden.</p>
          )}
        </Card>
      ))}

      <div className="flex justify-center mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            resetForm();
            setIsEditing(false);
            setDialogOpen(true);
          }}
        >
          Add <Plus className="ml-2 w-4 h-4" />
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent aria-describedby="">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isEditing ? "Edit Project" : "Add Project Details"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                type="text"
                id="title"
                placeholder="Project Title"
                className="col-span-4"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <Input
                type="text"
                id="subtitle"
                placeholder="Subtitle"
                className="col-span-4"
                value={formData.subtitle}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <Textarea
                className="col-span-4"
                placeholder="Enter Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <div className="col-span-2">
                <DatePicker
                  span="Start Date"
                  selected={formData.startDate}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, startDate: date }))
                  }
                />
              </div>
              <div className="col-span-2">
                <DatePicker
                  span="End Date"
                  selected={formData.endDate}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, endDate: date }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2 py-2">
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

            <DialogFooter>
              <Button type="submit">{isEditing ? "Update" : "Save"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProjectDetailsCard;
