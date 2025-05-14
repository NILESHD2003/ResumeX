import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DatePicker from 'rsuite/DatePicker';
import 'rsuite/DatePicker/styles/index.css';
import { Textarea } from "@/components/ui/textarea";
import { Label } from './ui/label';
import { 
  getUserDeclarationsDetails,
  updateDeclarationDetail,
} from "../services/operations/declarationDetailsAPIS";
import { Toaster, toast } from "sonner";

const DeclarationCard = () => {
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    text: "",
    signature: "",
    place: "",
    date: "",
    hide: false,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date: date,
    }));
  };

  function getChangedFields(newData, originalData) {
    return Object.fromEntries(
      Object.entries(newData).filter(([key, value]) => originalData[key] !== value)
    );
  }

  const handleSubmit = async () => {
    if (!formData.text) {
      toast.warning("Please fill in required fields: Text.");
      return;
    }
  
    const changedFields = getChangedFields(formData, originalData || {});
    const payload = {}
  
    for (const key in changedFields) {
      if (changedFields.hasOwnProperty(key)) {
        payload[key] = changedFields[key];
      }
    }

    if (Object.keys(payload).length === 0) {
      toast.info("No changes to update.");
      return;
    }
  
    try {
      const success = await updateDeclarationDetail(payload);
      if (success) {
        toast.success("Declaration updated successfully.");
        setOriginalData(formData); // Update originalData after successful update
      } else {
        toast.error("Update failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during update.");
    }
  }; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserDeclarationsDetails();
        if (data) {
          const date = data.date ? new Date(data.date) : '';
          setFormData({
          fullName: data.fullName || "", // Use empty string as fallback
          text: data.text || "",
          signature: data.signature || "",
          place: data.place || "",
          date: date,
          hide: data.hide || false,
        });
        setOriginalData({
          fullName: data.fullName || "",
          text: data.text || "",
          signature: data.signature || "",
          place: data.place || "",
          date: date,
          hide: data.hide || false,
        }); // Keep a copy for comparison
        } else {
        // If data is null, you might want to keep the initial empty state
        setOriginalData({ ...formData }); // Initialize originalData with the default empty state
      }
      } catch (error) {
        toast.error("Failed to load declaration details.");
        console.error(error);
      }
    };
    fetchData();
  }, []);
  

  return (
    <Card className="max-w-xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm">
    <Toaster />
        <div className="grid grid-cols-4 items-center gap-4 py-2">
            <div className="col-span-4">
                <Label htmlFor="text" className="px-1 pb-1">Text</Label>
                <Textarea
                    id="text"
                    placeholder="Text"
                    value={formData.text}
                    onChange={handleChange}
                    className="resize-none"
                />
            </div>
            <div className="col-span-4 sm:col-span-2">
                <Label htmlFor="fullName" className="px-1 pb-1">Full Name</Label>
                <Input
                    type="text"
                    id="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                />
            </div>
            <div className="col-span-4 sm:col-span-2">
                <Label htmlFor="signature" className="px-1 pb-1">Signature</Label>
                <Input
                    type="text"
                    id="signature"
                    placeholder="Signature"
                    value={formData.signature}
                    onChange={handleChange}
                />
            </div>
            <div className="col-span-4 sm:col-span-2">
                <Label htmlFor="place" className="px-1 pb-1">Place</Label>
                <Input
                    type="text"
                    id="place"
                    placeholder="Place"
                    value={formData.place}
                    onChange={handleChange}
                />
            </div>
            <div className="col-span-4 sm:col-span-2">
                <Label htmlFor="date" className="px-1 pb-1">Date</Label>
                <DatePicker
                    id="date"
                    style={{ width: '100%' }}
                    value={formData.date}
                    onChange={handleDateChange}
                />
            </div>
        </div>
        <div className="col-span-4 text-center mt-4">
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    </Card>
  );
};

export default DeclarationCard;
