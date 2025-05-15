import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import DatePicker from 'rsuite/DatePicker';
import 'rsuite/DatePicker/styles/index.css';
import { getPersonalDetails, updatePersonalDetails } from '../services/operations/personalDetailsAPI';
import { toast, Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ProfileImageCard from '@/components/ProfileImageCard';

const PersonalDetailsForm = () => {
  const [form, setForm] = useState({
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    nationality: '',
    passport_govt_id: '',
    maritalStatus: '',
    militaryService: '',
    genderPronoun: '',
    drivingLicense: '',
    visa: '',
    socialLinks: []
  });
  const [originalData, setOriginalData] = useState({
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    nationality: '',
    passport_govt_id: '',
    maritalStatus: '',
    militaryService: '',
    genderPronoun: '',
    drivingLicense: '',
    visa: '',
    socialLinks: []
  });
  const navigate = useNavigate();
  
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleAddLink = (platform) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, {url: "", platform: platform }],
    }));
  };
  

  const handleLinkChange = (index, field, value) => {
    setForm((prevForm) => {
      const updatedLinks = [...(prevForm.socialLinks || [])];
      updatedLinks[index] = { ...updatedLinks[index], [field]: value };
      return { ...prevForm, socialLinks: updatedLinks };
    });
  };
  
  const handleRemoveLink = (indexToRemove) => {
    setForm((prevForm) => {
      const updatedLinks = (prevForm.socialLinks || []).filter(
        (_, index) => index !== indexToRemove
      );
      return { ...prevForm, socialLinks: updatedLinks };
    });
  };
  

  const fetchFilledDetails = async () => {
    try {
      const data = await getPersonalDetails();
      if (!data) return;

      const formattedLinks = (data.socialLinks || []).map((element) => ({
        platform: element.platform || '',
        url: element.url || '',
      }));
  
      const populatedForm = {
        fullName: data.fullName || '',
        jobTitle: data.jobTitle || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : '',
        nationality: data.nationality || '',
        passport_govt_id: data.passport_govt_id || '',
        maritalStatus: data.maritalStatus || '',
        militaryService: data.militaryService || '',
        genderPronoun: data.genderPronoun || '',
        drivingLicense: data.drivingLicense || '',
        visa: data.visa || '',
        socialLinks: formattedLinks.length > 0 ? formattedLinks : [],
      };
  
      setForm(populatedForm);
      setOriginalData(populatedForm);
    } catch (error) {
      console.error("Error fetching personal details:", error);
    }
  };  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const updatedPayload = {};

    const emptyFields = [];
    if (!form.fullName.trim()) {
      emptyFields.push("Full name");
    }
    if (!form.email.trim()) {
      emptyFields.push("Email");
    }
    if (!form.phone.trim()) {
      emptyFields.push("Phone no.");
    }

    if (emptyFields.length > 0) {
      toast.warning(`Following Fields need to be filled: ${emptyFields.join(', ')}`);
      return;
    }
  
    // Compare fields (excluding socialLinks and date separately)
    Object.keys(form).forEach((key) => {
      if (key === "socialLinks" || key === "dateOfBirth") return;
  
      if (form[key] !== originalData[key]) {
        updatedPayload[key] = form[key];
      }
    });
  
    // Handle dateOfBirth
    const originalDate = originalData.dateOfBirth
      ? new Date(originalData.dateOfBirth).toISOString().split("T")[0]
      : "";
    const currentDate = form.dateOfBirth
      ? new Date(form.dateOfBirth).toISOString().split("T")[0]
      : "";
  
    if (currentDate !== originalDate) {
      updatedPayload.dateOfBirth = currentDate;
    }
  
    // Handle socialLinks
    const formatLinks = (links) =>
      links
        .filter(
          (link) =>
            typeof link.url === "string" &&
            link.url.trim() !== "" &&
            typeof link.platform === "string" &&
            link.platform.trim() !== ""
        )
        .map(({ platform, url }) => ({ platform, url }));
  
    const currentLinks = formatLinks(form.socialLinks || []);
    const originalLinks = formatLinks(originalData.socialLinks || []);
  
    const linksChanged =
      currentLinks.length !== originalLinks.length ||
      currentLinks.some(
        (link, index) =>
          !originalLinks[index] ||
          link.url !== originalLinks[index].url ||
          link.platform !== originalLinks[index].platform
      );
  
    if (linksChanged) {
      updatedPayload.socialLinks = currentLinks;
    }
  
    if (Object.keys(updatedPayload).length === 0) {
      console.log("No changes to submit");
      toast("No changes to submit", {
        action: {
          label: 'Continue',
          onClick: () => navigate('/onboarding/profile-summary')
        }
      });
      return;
    }
  
    try {
      await updatePersonalDetails(updatedPayload);
      console.log("Updated successfully");
      toast.success("Personal Details Updated Successfully")
      setOriginalData(form); // Reset original data
      navigate('/onboarding/profile-summary');
    } catch (error) {
      console.error("Update failed", error);
    }
  };
  
  
  
  useEffect(() => {
    fetchFilledDetails();
  }
  , [])

  return (
    <div className="min-h-screen flex flex-col">
      

      <form className="space-y-4" onSubmit={handleSubmit}>

      <Card className="max-w-xl w-full mx-auto p-6 bg-white rounded-3xl shadow-sm">
        <Toaster />

        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile image on left or top depending on screen size */}
          <div className="md:w-1/3 flex justify-center">
            <ProfileImageCard />
          </div>

          {/* Form inputs on right or below depending on screen size */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="px-1">Full Name</Label>
              <Input id="fullName" placeholder="Full Name" value={form.fullName} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="px-1">Job Title</Label>
              <Input id="jobTitle" placeholder="Job Title" value={form.jobTitle} onChange={handleInputChange} />
            </div>
          </div>
      </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="Location" value={form.location} onChange={handleInputChange} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="px-1">Email</Label>
          <Input id="email" placeholder="Email" value={form.email} onChange={handleInputChange} />
        </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="px-1">Phone Number</Label>
            <Input id="phone" placeholder="Phone no." value={form.phone} onChange={handleInputChange} />
          </div>      
        </div>

        <div className="space-y-2 mt-4">
          <AddtionalSections 
            form={form}
            setForm={setForm}
            handleInputChange={handleInputChange}
          />
        </div>

        {/* Social Links Section with its own labels is already implemented below */}
        <div className="space-y-2 mt-4">
          <LinksSection 
            form={form}
            handleLinkChange={handleLinkChange}
            handleRemoveLink={handleRemoveLink}
            handleAddLink={handleAddLink}
          />
        </div>
      <div className="w-full px-4 py-4 flex justify-end gap-4">
        <Button
          type="submit"
          className="rounded"
        >
          Continue
        </Button>
      </div>
      </Card>
      </form>
    </div>
  );
};

function AddtionalSections({ form, setForm }) {
  const fieldLabels = {
    dateOfBirth: "Date of Birth",
    nationality: "Nationality",
    passport: "Passport",
    maritalStatus: "Marital Status",
    militaryService: "Military Service",
    genderPronoun: "Gender Pronouns",
    visa: "Visa",
    drivingLicense: "Driving License",
  };

  // Derive visibleFields from the form prop
  const visibleFields = useMemo(() => ({
    dateOfBirth: !!form.dateOfBirth,
    nationality: !!form.nationality,
    passport: !!form.passport_govt_id,
    maritalStatus: !!form.maritalStatus,
    militaryService: !!form.militaryService,
    genderPronoun: !!form.genderPronoun,
    visa: !!form.visa,
    drivingLicense: !!form.drivingLicense,
  }), [form]); // Re-calculate when 'form' prop changes

  const [localVisibleFields, setLocalVisibleFields] = useState(() => ({ ...visibleFields }));

  // Update localVisibleFields when the derived visibleFields change (on initial load with data)
  useEffect(() => {
    setLocalVisibleFields(visibleFields);
  }, [visibleFields]);

  const toggleField = useCallback((field) => {
   setLocalVisibleFields((prevVisibleFields) => {
     const newVisibleFields = { ...prevVisibleFields, [field]: !prevVisibleFields?.[field] };
     if (!newVisibleFields[field]) { // Check the *new* visibility
       setForm((prevForm) => ({ ...prevForm, [field]: '' }));
     }
     return newVisibleFields;
   });
 }, [setForm]);

  const handleInputChange = useCallback((e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  }, [setForm]);

  const handleDateChange = useCallback((value) => {
    setForm((prev) => ({ ...prev, dateOfBirth: value }));
  }, [setForm]);

  const handleSelectChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, [setForm]);

  return (
    <div className="space-y-2">
      {localVisibleFields.dateOfBirth && (
        <div className="flex items-center space-x-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="dateOfBirth">{fieldLabels.dateOfBirth}</Label>
            <div className="w-full">
              <DatePicker
                id="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleDateChange}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <Button onClick={() => toggleField("dateOfBirth")} variant="destructive" className="self-end">
            <Trash />
          </Button>
        </div>
      )}

      {localVisibleFields.nationality && (
        <div className="flex items-center space-x-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="nationality">{fieldLabels.nationality}</Label>
            <Input
              id="nationality"
              placeholder="Nationality"
              value={form.nationality}
              onChange={handleInputChange}
            />
          </div>
          <Button onClick={() => toggleField("nationality")} variant="destructive" className="self-end">
            <Trash />
          </Button>
        </div>
      )}

      {localVisibleFields.passport && (
        <div className="flex items-center space-x-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="passport">{fieldLabels.passport}</Label>
            <Input
              id="passport_govt_id"
              placeholder="Passport / Govt ID"
              value={form.passport_govt_id}
              onChange={handleInputChange}
            />
          </div>
          <Button onClick={() => toggleField("passport")} variant="destructive" className="self-end">
            <Trash />
          </Button>
        </div>
      )}

      {localVisibleFields.maritalStatus && (
        <div className="flex items-center space-x-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="maritalStatus">{fieldLabels.maritalStatus}</Label>
            <Select value={form.maritalStatus} onValueChange={(value) => handleSelectChange('maritalStatus', value)}>
              <SelectTrigger className="w-full align-bottom">
                <SelectValue placeholder={fieldLabels.maritalStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => toggleField("maritalStatus")} variant="destructive" className="self-end mb-2">
            <Trash />
          </Button>
        </div>
      )}

      {localVisibleFields.militaryService && (
        <div className="flex items-center space-x-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="militaryService">{fieldLabels.militaryService}</Label>
            <Select value={form.militaryService} onValueChange={(value) => handleSelectChange('militaryService', value)}>
              <SelectTrigger className="w-full align-bottom">
                <SelectValue placeholder={fieldLabels.militaryService} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="serving">Currently Serving</SelectItem>
                <SelectItem value="veteran">Veteran</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => toggleField("militaryService")} variant="destructive" className="self-end mb-2">
            <Trash />
          </Button>
        </div>
      )}

      {localVisibleFields.genderPronoun && (
        <div className="flex items-center space-x-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="genderPronoun">{fieldLabels.genderPronoun}</Label>
            <Select value={form.genderPronoun} onValueChange={(value) => handleSelectChange('genderPronoun', value)}>
              <SelectTrigger className="w-full align-bottom">
                <SelectValue placeholder={fieldLabels.genderPronoun} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="he/him">He/Him</SelectItem>
                <SelectItem value="she/her">She/Her</SelectItem>
                <SelectItem value="they/them">They/Them</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => toggleField("genderPronoun")} variant="destructive" className="self-end mb-2">
            <Trash />
          </Button>
        </div>
      )}

      {localVisibleFields.visa && (
        <div className="flex items-center space-x-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="visa">{fieldLabels.visa}</Label>
            <Input
              id="visa"
              placeholder="Visa"
              value={form.visa}
              onChange={handleInputChange}
            />
          </div>
          <Button onClick={() => toggleField("visa")} variant="destructive" className="self-end">
            <Trash />
          </Button>
        </div>
      )}

      {localVisibleFields.drivingLicense && (
        <div className="flex items-center space-x-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="drivingLicense">{fieldLabels.drivingLicense}</Label>
            <Input
              id="drivingLicense"
              placeholder="Driving License"
              value={form.drivingLicense}
              onChange={handleInputChange}
            />
          </div>
          <Button onClick={() => toggleField("drivingLicense")} variant="destructive" className="self-end">
            <Trash />
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-1 mt-2">
        {Object.keys(visibleFields).map((field) => (
          !localVisibleFields[field] && (
            <Button key={field} onClick={() => toggleField(field)} variant="outline">
              {fieldLabels[field] || field} <Plus />
            </Button>
          )
        ))}
      </div>
    </div>
  );
}




const availablePlatforms = [
  "LinkedIn", "GitHub", "Twitter", "Facebook", 
  "Instagram", "YouTube", "Website", "Other"
];

function LinksSection({ form, handleLinkChange, handleRemoveLink, handleAddLink }) {
  // Track which platforms have already been added
  const addedPlatforms = form.socialLinks.map(link => link.platform);
  const remainingPlatforms = availablePlatforms.filter(p => !addedPlatforms.includes(p));

  return (
    <div className="space-y-2">
      <Label className="text-md font-semibold">Social Links</Label>

      {/* Render existing link inputs */}
      {form.socialLinks?.map((link, index) => (
        <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Label className="w-24">{link.platform}</Label>

          <Input
            type="text"
            placeholder="URL"
            value={link.url}
            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
            className="flex-grow"
          />

          <Button
            type="button"
            variant="destructive"
            onClick={() => handleRemoveLink(index)}
            className="px-3"
          >
            <Trash />
          </Button>
        </div>
      ))}

      {/* Render platform buttons */}
      <div className="flex flex-wrap gap-1 mt-2">
        {remainingPlatforms.map((platform) => (
          <Button
            key={platform}
            type="button"
            variant="outline"
            onClick={() => handleAddLink(platform)}
          >
            {platform} <Plus />
          </Button>
        ))}
      </div>
    </div>
  );
}

export default PersonalDetailsForm;