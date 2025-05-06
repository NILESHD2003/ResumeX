import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "./DatePicker";
import { Textarea } from "@/components/ui/textarea";
import { 
  getUserDeclarationsDetails,
  updateDeclarationDetail,
  toggleDeclarationDetailVisibility 
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

  function getFilledFields(data) {
    return Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== '' && value !== null && value !== undefined
      )
    );
  }

  const handleSubmit = async () => {
    if (!formData.text) {
      toast.warning("Please fill in required fields: Text.");
      return;
    }
  
    const changedFields = getChangedFields(formData, originalData || {});
    const payload = getFilledFields(changedFields);
  
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
  
  const handleToggleVisibility = async () => {
    try {
      const newVisibility = !formData.hide;
      const success = await toggleDeclarationDetailVisibility();
  
      if (success) {
        setFormData((prev) => ({ ...prev, hide: newVisibility }));
        setOriginalData((prev) => ({ ...prev, hide: newVisibility }));
        toast.success(`Visibility set to ${newVisibility ? "hidden" : "visible"}.`);
      } else {
        toast.error("Failed to update visibility.");
      }
    } catch (error) {
      toast.error("Error toggling visibility.");
      console.error(error);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserDeclarationsDetails();
        if (data) {
          setFormData(data);
          setOriginalData(data); // Keep a copy for comparison
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
      <h1 className="text-3xl font-bold text-center mb-4">Declaration</h1>
        {!formData.hide && (
        <div className="grid grid-cols-4 items-center gap-4 py-2">
          <Textarea
          type="text"
          id="text"
          placeholder="Text"
          value={formData.text}
          onChange={handleChange}
          className="col-span-4 resize-none"
        />
        <Input
          type="text"
          id="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="col-span-2"
        />
        <Input
          type="text"
          id="signature"
          placeholder="Signature"
          value={formData.signature}
          onChange={handleChange}
          className="col-span-2"
        />
        <Input
          type="text"
          id="place"
          placeholder="Place"
          value={formData.place}
          onChange={handleChange}
          className="col-span-2"
        />
        <div className="col-span-2">
          <DatePicker
            span="Date"
            selected={formData.date}
            onChange={handleDateChange}
          />
        </div>
      </div>
      )}
        <div className="col-span-4 text-center mt-4">
          <Button onClick={handleSubmit}>Submit</Button>
          <Button
            variant="outline"
            onClick={handleToggleVisibility}
            className="ml-4"
          >
            {formData.hide ? "Unhide" : "Hide"}
          </Button>
        </div>
    </Card>
  );
};

export default DeclarationCard;
