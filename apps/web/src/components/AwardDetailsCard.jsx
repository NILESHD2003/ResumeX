import React, { useState } from "react";
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

const AwardDetailsCard = () => {
  const [awards, setAwards] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [form, setForm] = useState({
    title: "",
    link: "",
    issuer: "",
    license: "",
    date: "",
    expDate: "",
    hide: false,
  });

  const resetForm = () => {
    setForm({
      title: "",
      link: "",
      issuer: "",
      license: "",
      date: "",
      expDate: "",
      hide: false,
    });
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (isEditing) {
      const updatedAwards = [...awards];
      updatedAwards[editingIndex] = form;
      setAwards(updatedAwards);
    } else {
      setAwards([...awards, form]);
    }

    resetForm();
    setOpenDialog(false);
  };

  const handleEdit = (award, index) => {
    setForm(award);
    setIsEditing(true);
    setEditingIndex(index);
    setOpenDialog(true);
  };

  const handleDelete = (index) => {
    const updatedAwards = [...awards];
    updatedAwards.splice(index, 1);
    setAwards(updatedAwards);
  };

  const toggleVisibility = (index) => {
    const updatedAwards = [...awards];
    updatedAwards[index].hide = !updatedAwards[index].hide;
    setAwards(updatedAwards);
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-sm">
      <h1 className="text-3xl font-bold text-center mb-4">Award Details</h1>

      {awards.map((award, index) => (
        <Card key={index} className="mb-4 border p-4 rounded-md relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => handleEdit(award, index)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => handleDelete(index)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => toggleVisibility(index)}>
              {award.hide ? (
                <EyeOff className="w-4 h-4 text-gray-500" />
              ) : (
                <Eye className="w-4 h-4 text-green-600" />
              )}
            </Button>
          </div>

          {!award.hide ? (
            <div className="space-y-1">
              <p><span className="font-semibold">Title:</span> {award.title}</p>
            </div>
          ) : (
            <p className="text-center italic text-gray-500">This award is hidden.</p>
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
              {isEditing ? "Edit" : "Add"} Award Details
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
                placeholder="Award Title"
                className="col-span-4"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <Input
                type="text"
                placeholder="Award Link"
                className="col-span-4"
                value={form.link}
                onChange={(e) => handleChange("link", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <Input
                type="text"
                placeholder="Issuer"
                className="col-span-2"
                value={form.issuer}
                onChange={(e) => handleChange("issuer", e.target.value)}
              />
              <Input
                type="text"
                placeholder="License"
                className="col-span-2"
                value={form.license}
                onChange={(e) => handleChange("license", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <div className="col-span-2">
                <DatePicker span="Date" value={form.date} onChange={(val) => handleChange("date", val)} />
              </div>
              <div className="col-span-2">
                <DatePicker span="Exp Date" value={form.expDate} onChange={(val) => handleChange("expDate", val)} />
              </div>
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

export default AwardDetailsCard;
