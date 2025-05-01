import React, { useState } from "react";
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
    startDate: null,
    endDate: null,
    hide: false,
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    if (isEditing) {
      const updated = [...certifications];
      updated[editIndex] = formData;
      setCertifications(updated);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setCertifications((prev) => [...prev, formData]);
    }

    resetForm();
    setDialogOpen(false);
  };

  const handleEdit = (index) => {
    setFormData(certifications[index]);
    setIsEditing(true);
    setEditIndex(index);
    setDialogOpen(true);
  };

  const handleDelete = (index) => {
    setCertifications((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleVisibility = (index) => {
    const updated = [...certifications];
    updated[index].hide = !updated[index].hide;
    setCertifications(updated);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      link: "",
      issuer: "",
      license: "",
      startDate: null,
      endDate: null,
      hide: false,
    });
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-sm">
      <h1 className="text-3xl font-bold text-center mb-4">Certification Details</h1>

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
        <DialogContent>
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
                  span={"Date"}
                  value={formData.startDate}
                  onChange={(date) => setFormData((prev) => ({ ...prev, startDate: date }))}
                />
              </div>
              <div className="col-span-2">
                <DatePicker
                  span={"End Date"}
                  value={formData.endDate}
                  onChange={(date) => setFormData((prev) => ({ ...prev, endDate: date }))}
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
