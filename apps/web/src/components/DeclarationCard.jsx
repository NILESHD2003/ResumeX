import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "./DatePicker";

const DeclarationCard = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    text: "",
    signature: "",
    place: "",
    date: null,
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

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    // Submit logic here
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-sm">
      <h1 className="text-3xl font-bold text-center mb-4">Declaration</h1>
      <div className="grid grid-cols-4 items-center gap-4 py-2">
        <Input
          type="text"
          id="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="col-span-4"
        />
        <Input
          type="text"
          id="text"
          placeholder="Text"
          value={formData.text}
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
            value={formData.date}
            onChange={handleDateChange}
          />
        </div>
        <div className="col-span-4 text-center mt-4">
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </Card>
  );
};

export default DeclarationCard;
