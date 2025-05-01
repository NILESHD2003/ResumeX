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
import { Plus, Trash2, Eye, EyeOff, Pencil, Award } from "lucide-react";
import { DatePicker } from "./DatePicker";

const CourseDetailCard = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    link: "",
    issuer: "",
    license: "",
    startDate: "",
    endDate: "",
    hide: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const resetForm = () => {
    setForm({
      title: "",
      link: "",
      issuer: "",
      license: "",
      startDate: "",
      endDate: "",
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
      const updated = [...courses];
      updated[editingIndex] = form;
      setCourses(updated);
    } else {
      setCourses([...courses, form]);
    }
    resetForm();
    setOpenDialog(false);
  };

  const handleEdit = (course, index) => {
    setForm(course);
    setIsEditing(true);
    setEditingIndex(index);
    setOpenDialog(true);
  };

  const handleDelete = (index) => {
    const updated = [...courses];
    updated.splice(index, 1);
    setCourses(updated);
  };

  const toggleVisibility = (index) => {
    const updated = [...courses];
    updated[index].hide = !updated[index].hide;
    setCourses(updated);
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-sm">
      <h1 className="text-3xl font-bold text-center mb-4">Course Details</h1>

      {courses.map((course, index) => (
        <Card key={index} className="mb-4 border p-4 rounded-xl relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <Button variant="ghost" onClick={() => handleEdit(course, index)}>
              <Pencil size={16} />
            </Button>
            <Button variant="ghost" onClick={() => handleDelete(index)}>
              <Trash2 size={16} />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => toggleVisibility(index)}>
                {course.hide ? (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                ) : (
                    <Eye className="w-4 h-4 text-green-600" />
                )}
            </Button>
          </div>
          {!course.hide ? (
            <div className="space-y-1">
                <p><span className="font-semibold">Title:</span> {course.title}</p>
            </div>
            ) : (
                <p className="text-center italic text-gray-500">This certification is hide.</p>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              {isEditing ? "Edit" : "Add"} Course Details
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
                placeholder="Course Title"
                className="col-span-4"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 py-2">
              <Input
                type="text"
                placeholder="Course Link"
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
                <DatePicker
                  span="Start Date"
                  value={form.startDate}
                  onChange={(val) => handleChange("startDate", val)}
                />
              </div>
              <div className="col-span-2">
                <DatePicker
                  span="End Date"
                  value={form.endDate}
                  onChange={(val) => handleChange("endDate", val)}
                />
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

export default CourseDetailCard;
