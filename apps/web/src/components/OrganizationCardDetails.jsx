import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye, EyeOff, Pencil } from "lucide-react";
import { DatePicker } from "./DatePicker";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";
import { 
  getUserOrganizationsDetails,
  addNewOrganizationDetail,
  updateOrganizationDetail,
  toggleOrganizationDetailVisibility,
  deleteOrganizationDetail 
} from "../services/operations/organizationDetailsAPIS";

const OrganizationDetailCard = () => {
  const [organizations, setOrganizations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
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
      startDate: data.startDate ?? '',
      endDate: data.endDate ?? '',
      description: data.description ?? '',
      hide: Boolean(data.hide),
      _id: data._id, // keep id if present for editing
    };
  }

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
        toast.warning("Organization name is required.");
        return;
      }
  
      if (isEditing) {
        const original = organizations[editingIndex];
        const updatedFields = getChangedFields(formData, original);
  
        if (Object.keys(updatedFields).length > 0) {
          await updateOrganizationDetail(updatedFields, original._id);
          const updatedOrganizations = [...organizations];
          updatedOrganizations[editingIndex] = { ...original, ...updatedFields };
          setOrganizations(updatedOrganizations);
        }
      } else {
        const filledData = getFilledFields(formData);
        const response = await addNewOrganizationDetail(filledData);
        if (response && response._id) {
          setOrganizations((prev) => [...prev, { ...filledData, _id: response._id }]);
        }
      }
  
      resetForm();
      setOpenDialog(false);
      setIsEditing(false);
      setEditingIndex(null);
    } catch (error) {
      console.error("Error saving organization detail:", error);
      toast.error("Failed to save organization.");
    }
  };  

  const handleEdit = (index) => {
    const rawData = organizations[index];
    const normalized = normalizeOrganizationsData(rawData);
    setFormData(normalized);
    setIsEditing(true);
    setEditingIndex(index);
    setOpenDialog(true);
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

  const toggleVisibility = async (index) => {
    const id = organizations[index]._id;
    try {
      await toggleOrganizationDetailVisibility(id);
      const updated = [...organizations];
      updated[index].hide = !updated[index].hide;
      setOrganizations(updated);
    } catch (error) {
      console.error("Error toggling Organizations visibility:", error);
      toast.error("Failed to toggle visibility.");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    <Card className="max-w-xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm">
      <h1 className="text-3xl font-bold text-center mb-4">Organization Details</h1>
      <Toaster />
      {organizations.map((org, index) => (
        <Card key={index} className="mb-4 border p-4 rounded-md relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <Button variant="ghost" onClick={() => handleEdit(index)}>
              <Pencil size={16} />
            </Button>
            <Button variant="ghost" onClick={() => handleDelete(index)}>
              <Trash2 size={16} />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => toggleVisibility(index)}>
                {org.hide ? (
                <EyeOff className="w-4 h-4 text-gray-500" />
                ) : (
                <Eye className="w-4 h-4 text-green-600" />
                )}
            </Button>
          </div>
          {!org.hide ? (
            <div className="space-y-1">
                <p><span className="font-semibold">Title:</span> {org.name}</p>
            </div>
          ) : (
            <p className="text-center italic text-gray-500">This Organization is hidden.</p>
          )}
        </Card>
      ))}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <div className="flex justify-center">
            <Button variant="outline" size="sm" onClick={resetForm}>
              Add <Plus />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent aria-describedby="">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isEditing ? "Edit" : "Add"} Organization Details
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
                placeholder="Organization Name"
                className="col-span-4"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <Input
                type="text"
                placeholder="Organization Link"
                className="col-span-4"
                value={formData.link}
                onChange={(e) => handleChange("link", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <Input
                type="text"
                placeholder="City"
                className="col-span-2"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
              <Input
                type="text"
                placeholder="Country"
                className="col-span-2"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <div className="col-span-2">
                <DatePicker
                  span="Start Date"
                  selected={formData.startDate}
                  onChange={(value) => handleChange("startDate", value)}
                />
              </div>
              <div className="col-span-2">
                <DatePicker
                  span="End Date"
                  selected={formData.endDate}
                  onChange={(value) => handleChange("endDate", value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <Textarea
                className="col-span-4"
                placeholder="Enter Description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
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

export default OrganizationDetailCard;
