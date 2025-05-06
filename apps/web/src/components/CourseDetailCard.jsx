import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
import { Toaster, toast } from "sonner";
import { 
  getUserCoursesDetails,
  addNewCourseDetail,
  updateCourseDetail,
  toggleCourseDetailVisibility,
  deleteCourseDetail
} from "../services/operations/courseDetailsAPIS";

const CourseDetailCard = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    link: "",
    issuer: "",
    license: "",
    date: "",
    expirationDate: "",
    additionalInfo: "",
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
      date: "",
      expirationDate: "",
      additionalInfo: "",
      hide: false,
    });
  };

  function normalizeCoursesData(data) {
    return {
      title: data.title ?? '',
      link: data.link ?? '',
      additionalInfo: data.additionalInfo ?? '',
      license: data.license ?? '',
      issuer: data.issuer ?? '',
      date: data.date ?? '',
      expirationDate: data.expirationDate ?? '',
      hide: Boolean(data.hide),
      _id: data._id, // keep id if present for editing
    };
  }

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
        if (!form.title.trim()) {
          toast.warning("Course title is required.");
          return;
        }
    
        if (isEditing) {
          const original = courses[editingIndex];
          const updatedFields = getChangedFields(form, original);
    
          if (Object.keys(updatedFields).length > 0) {
            await updateCourseDetail(updatedFields, original._id);
            const updatedCourses = [...courses];
            updatedCourses[editingIndex] = { ...original, ...updatedFields };
            setCourses(updatedCourses);
          }
        } else {
          const filledData = getFilledFields(form);
          const response = await addNewCourseDetail(filledData);
          if (response && response._id) {
            setCourses((prev) => [...prev, { ...filledData, _id: response._id }]);
          }
        }
    
        resetForm();
        setOpenDialog(false);
        setIsEditing(false);
        setEditingIndex(null);
      } catch (error) {
        console.error("Error saving course detail:", error);
        toast.error("Failed to save course.");
      }
    };  

  const handleEdit = (index) => {
    const rawData = courses[index];
    const normalized = normalizeCoursesData(rawData);
    setForm(normalized);
    setEditingIndex(index);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (index) => {
      const id = courses[index]._id;
      try {
        await deleteCourseDetail(id);
    
        // Remove the item locally
        const updatedList = courses.filter((_, i) => i !== index);
        setCourses(updatedList);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    };

  const toggleVisibility = async (index) => {
      const id = courses[index]._id;
      try {
        await toggleCourseDetailVisibility(id);
    
        // Toggle the isVisible field locally
        const updatedList = [...courses];
        updatedList[index] = {
          ...updatedList[index],
          hide: !updatedList[index].hide,
        };
        setCourses(updatedList);
      } catch (error) {
        console.error("Error toggling visibility:", error);
      }
    };

  useEffect(() => {
      const fetchData = async () => {
        const data = await getUserCoursesDetails();
        if (data) {
          const normalizedList = data.map(normalizeCoursesData)
          setCourses(normalizedList);
        }
      };
      fetchData();
    }, []);

  return (
    <Card className="max-w-xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm">
      <h1 className="text-3xl font-bold text-center mb-4">Course Details</h1>
      <Toaster />
      {courses.map((course, index) => (
        <Card key={index} className="mb-4 border p-4 rounded-xl relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <Button variant="ghost" onClick={() => handleEdit(index)}>
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
        <DialogContent aria-describedby="">
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
                  selected={form.date}
                  onChange={(val) => handleChange("date", val)}
                />
              </div>
              <div className="col-span-2">
                <DatePicker
                  span="End Date"
                  selected={form.expirationDate}
                  onChange={(val) => handleChange("expirationDate", val)}
                />
              </div>
              <div className='col-span-4'>
              <Textarea
                id="additionalInfo"
                placeholder="Enter Course Additional Info"
                value={form.additionalInfo}
                onChange={(e) => handleChange("additionalInfo", e.target.value)}
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
