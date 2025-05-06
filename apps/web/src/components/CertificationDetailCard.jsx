import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { DatePicker } from "./DatePicker";
import { 
  getUserCertificatesDetails,
  addNewCertificateDetail,
  updateCertificateDetail,
  toggleCertificateDetailVisibility,
  deleteCertificateDetail 
} from "../services/operations/certificateDetailsAPIS";
import { Toaster, toast } from "sonner";

const CertificationDetailCard = () => {
  const [certifications, setCertifications] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    issuer: "",
    license: "",
    additionalInfo: "",
    date: "",
    expirationDate: "",
    hide: false,
  });

  function normalizeCertificationsData(data) {
    return {
      title: data.title ?? "",
      link: data.link ?? "",
      additionalInfo: data.additionalInfo ?? "",
      license: data.license ?? "",
      issuer: data.issuer ?? "",
      date: data.date ?? "",
      expirationDate: data.expirationDate ?? "",
      hide: Boolean(data.hide),
      _id: data._id, // keep id if present for editing
    };
  }

  const handleDateChange = (date, field) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

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
        toast.warning("Certification title is required.");
        return;
      }
  
      if (isEditing) {
        const original = certifications[editIndex];
        const updatedFields = getChangedFields(formData, original);
  
        if (Object.keys(updatedFields).length > 0) {
          await updateCertificateDetail(updatedFields, original._id);
          const updatedCertifications = [...certifications];
          updatedCertifications[editIndex] = { ...original, ...updatedFields };
          setCertifications(updatedCertifications);
        }
      } else {
        const filledData = getFilledFields(formData);
        const response = await addNewCertificateDetail(filledData);
        if (response && response._id) {
          setCertifications((prev) => [...prev, { ...filledData, _id: response._id }]);
        }
      }
  
      resetForm();
      setDialogOpen(false);
      setIsEditing(false);
      setEditIndex(null);
    } catch (error) {
      console.error("Error saving certifications detail:", error);
      toast.error("Failed to save certifications.");
    }
  };

  const handleEdit = (index) => {
    const rawData = certifications[index];
    const normalized = normalizeCertificationsData(rawData);
    setFormData(normalized);
    setIsEditing(true);
    setEditIndex(index);
    setDialogOpen(true);
  };

  const handleDelete = async (index) => {
      const id = certifications[index]._id;
      try {
        await deleteCertificateDetail(id);
    
        // Remove the item locally
        const updatedList = certifications.filter((_, i) => i !== index);
        setCertifications(updatedList);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    };

  const toggleVisibility = async (index) => {
      const id = certifications[index]._id;
      try {
        await toggleCertificateDetailVisibility(id);
    
        // Toggle the isVisible field locally
        const updatedList = [...certifications];
        updatedList[index] = {
          ...updatedList[index],
          hide: !updatedList[index].hide,
        };
        setCertifications(updatedList);
      } catch (error) {
        console.error("Error toggling visibility:", error);
      }
    };

  useEffect(() => {
      const fetchData = async () => {
        const data = await getUserCertificatesDetails();
        if (data) {
          const normalizedList = data.map(normalizeCertificationsData)
          setCertifications(normalizedList);
        }
      };
      fetchData();
    }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      link: "",
      additionalInfo: "",
      issuer: "",
      license: "",
      date: "",
      expirationDate: "",
      hide: false,
    });
  };

  return (
    <Card className="max-w-xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm">
      <h1 className="text-3xl font-bold text-center mb-4">Certification Details</h1>
      <Toaster />
      {certifications.map((cert, index) => (
        <Card key={index} className="mb-4 p-4 rounded-xl relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => handleEdit(index)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => handleDelete(index)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => toggleVisibility(index)}>
              {cert.hide ? (
                <EyeOff className="w-4 h-4 text-gray-500" />
              ) : (
                <Eye className="w-4 h-4 text-green-600" />
              )}
            </Button>
          </div>

          {!cert.hide ? (
            <div className="space-y-1">
              <p><span className="font-semibold">Title:</span> {cert.title}</p>
            </div>
          ) : (
            <p className="italic text-gray-500">Hidden</p>
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
              {isEditing ? "Edit Certification" : "Add Certification Details"}
            </DialogTitle>
          </DialogHeader>
          <form>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                type="text"
                id="title"
                placeholder="Certification Title"
                className="col-span-4"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <Input
                type="text"
                id="link"
                placeholder="Certification Link"
                className="col-span-4"
                value={formData.link}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <Input
                type="text"
                id="issuer"
                placeholder="Issuer"
                className="col-span-2"
                value={formData.issuer}
                onChange={handleInputChange}
              />
              <Input
                type="text"
                id="license"
                placeholder="License"
                className="col-span-2"
                value={formData.license}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <div className="col-span-2">
                <DatePicker
                  span={"Issue Date"}
                  selected={formData.date}
                  onChange={(date) => handleDateChange(date, 'date')}
                />
              </div>
              <div className="col-span-2">
                <DatePicker
                  span={"Exp Date"}
                  selected={formData.expirationDate}
                  onChange={(date) => handleDateChange(date, 'expirationDate')}
                />
              </div>
              <div className='col-span-4'>
              <Textarea
                id="additionalInfo"
                placeholder="Enter Professional Description"
                value={formData.additionalInfo}
                onChange={handleInputChange}
              />
            </div>
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

export default CertificationDetailCard;
