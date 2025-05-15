import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Label } from './ui/label';
import DatePicker from 'rsuite/DatePicker';
import 'rsuite/DatePicker/styles/index.css';
import { Toaster, toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { 
  getUserCoursesDetails,
  addNewCourseDetail,
  updateCourseDetail,
  deleteCourseDetail
} from "../services/operations/courseDetailsAPIS";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from 'date-fns';

const CourseDetailCard = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    issuer: "",
    license: "",
    date: "",
    expirationDate: "",
    additionalInfo: "",
    hide: false,
  });
  const [editIndex, setEditIndex] = useState(null);
  const [addData, setAddData] = useState(false);
  const navigate = useNavigate();

  const resetForm = () => {
    setFormData({
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
      date: data.date ? new Date(data.date) : '',
      expirationDate: data.expirationDate ? new Date(data.expirationDate) : '',
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

  const isDateDisabled = (date) => {
    return formData.expirationDate && date > formData.expirationDate;
  };

  const isExpirationDateDisabled = (date) => {
    return formData.date && date < formData.date;
  };

  function getChangedFields(newData, originalData) {
    return Object.fromEntries(
      Object.entries(newData).filter(([key, value]) => {
        if (key === 'date' || key === 'expirationDate') {
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
          toast.warning("Course title is required.");
          return;
        }
    
        if (editIndex !== null) {
          const original = courses[editIndex];
          const updatedFields = getChangedFields(formData, original);

          if (Object.keys(updatedFields).length > 0) {
            await updateCourseDetail(updatedFields, original._id);
            const updatedCourses = [...courses];
            updatedCourses[editIndex] = { ...original, ...updatedFields };
            setCourses(updatedCourses);
          }
        } else {
          const filledData = getFilledFields(formData);
          const response = await addNewCourseDetail(filledData);
          if (response && response._id) {
            setCourses((prev) => [...prev, { ...filledData, _id: response._id }]);
          }
        }
        setAddData(false);
        setEditIndex(null);
        resetForm();
      } catch (error) {
        console.error("Error saving course detail:", error);
        toast.error("Failed to save course.");
      }
    };  

  const handleEdit = (index) => {
    setEditIndex(index);
    const rawData = courses[index];
    const normalized = normalizeCoursesData(rawData);
    setFormData(normalized);
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
    <div className='flex flex-col w-full'>
      <Card className="max-w-xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm">
        <Toaster />
        {(courses.length === 0 || editIndex !== null || addData) && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {editIndex !== null ? 'Update Course' : 'Add Course'}
            </h2>
            <FormInputs
              formData={formData}
              onChange={handleInputChange}
              onDateChange={handleDateChange}
              onSubmit={handleSave}
              isDateDisabled={isDateDisabled}
              isExpirationDateDisabled={isExpirationDateDisabled}
              submitLabel={editIndex !== null ? "Update" : "Save"}
            />
          </div>
        )}
        
        {courses.length > 0 && editIndex === null && addData === false && (
          <div className="justify-center">
            <Accordion type="multiple" className="w-full space-y-2 pt-2">
              {courses.map((course, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="p-2">
                  <div className="flex justify-center items-center pr-2">
                    <AccordionTrigger className="w-full flex justify-between items-center">
                      <p className="text-center text-2xl font-semibold">
                        {course.title || "Untitled Course"}
                      </p>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent>
                      <div className="text-center pt-2 space-y-1 text-muted-foreground text-lg">
                        <p><strong>Issuer:</strong> {course.issuer}</p>
                        <p><strong>License:</strong> {course.license}</p>
                        <p><strong>Duration:</strong> {course.date ? format(new Date(course.date), 'MMM yyyy') : ''} - {course.expirationDate ? format(new Date(course.expirationDate), 'MMM yyyy') : ''}</p>
                        <p><strong>Description:</strong> {course.additionalInfo}</p>
                        {course.link && (
                          <p>
                            <strong>Link:</strong>{" "}                     
                              {course.link}                  
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
          <Button variant="outline" onClick={() => navigate('/onboarding/awards-section')} className='font-semibold py-2 px-6 rounded'>
              Back
          </Button>
          <Button onClick={() => navigate('/onboarding/organizations-section')} className='font-semibold py-2 px-6 rounded'>
              {courses.length === 0 ? 'Skip' : 'Continue'}
          </Button>
      </div>
    </div>
  );
};

const FormInputs = ({ formData, onChange, onDateChange, onSubmit, isExpirationDateDisabled, isDateDisabled, submitLabel = "Save" }) => (
  <div className='space-y-4'>
    <div className="grid grid-cols-4 items-center gap-4">
        <div className="col-span-4">
            <Label htmlFor="title" className="px-1 pb-1">Course Title</Label>
            <Input
                type="text"
                id="title"
                placeholder="Course Title"
                className="col-span-4"
                value={formData.title}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4">
            <Label htmlFor="link" className="px-1 pb-1">Course Link</Label>
            <Input
                type="text"
                id="link"
                placeholder="Course Link"
                className="col-span-4"
                value={formData.link}
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
                value={formData.issuer}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4 sm:col-span-2">
            <Label htmlFor="license" className="px-1 pb-1">License</Label>
            <Input
                type="text"
                id="license"
                placeholder="License"
                className="col-span-4 sm:col-span-2"
                value={formData.license}
                onChange={onChange}
            />
        </div>
        <div className="col-span-4 sm:col-span-2">
            <Label htmlFor="date" className="px-1 pb-1">Issue Date</Label>
            <DatePicker
                id="date"
                style={{ width: '100%' }}
                value={formData.date}
                shouldDisableDate={isDateDisabled}
                onChange={(date) =>
                onDateChange(date, 'date')}
            />
        </div>
        <div className="col-span-4 sm:col-span-2">
            <Label htmlFor="expirationDate" className="px-1 pb-1">Expiration Date</Label>
            <DatePicker
                id="expirationDate"
                style={{ width: '100%' }}
                value={formData.expirationDate}
                shouldDisableDate={isExpirationDateDisabled}
                onChange={(date) =>
                onDateChange(date, 'expirationDate')}
            />
        </div>
        <div className='col-span-4'>
            <Label htmlFor="additionalInfo" className="px-1 pb-1">Additional Info</Label>
            <Textarea
                id="additionalInfo"
                placeholder="Enter Course Additional Info"
                value={formData.additionalInfo}
                onChange={onChange}
            />
        </div>
    </div>
    <div className="text-right">
        <Button onClick={onSubmit}>{submitLabel}</Button>
    </div>
  </div>
)

export default CourseDetailCard;