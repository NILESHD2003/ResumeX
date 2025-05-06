import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import { getPersonalDetails, updatePersonalDetails } from '../services/operations/personalDetailsAPI';
import { toast, Toaster } from 'sonner';

const PersonalDetailsForm = () => {
  const [form, setForm] = useState({
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    personalInfo: '',
    dateOfBirth: '',
    nationality: '',
    passport_govt_id: '',
    maritalStatus: '',
    militaryService: '',
    genderPronoun: '',
    drivingLicense: '',
    visa: '',
    socialLinks: [{ id: 0, url: '', platform: '' }]
  });
  const [originalData, setOriginalData] = useState(null);
  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false);
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value)
    setForm(prev => ({ ...prev, dateOfBirth: date}));
  };

  const handleAddLink = () => {
    setForm((prevForm) => ({
      ...prevForm,
      socialLinks: [...(prevForm.socialLinks || []), { url: '', platform: '' }],
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
        personalInfo: data.personalInfo || '',
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : '',
        nationality: data.nationality || '',
        passport_govt_id: data.passport_govt_id || '',
        maritalStatus: data.maritalStatus || '',
        militaryService: data.militaryService || '',
        genderPronoun: data.genderPronoun || '',
        drivingLicense: data.drivingLicense || '',
        visa: data.visa || '',
        socialLinks: formattedLinks.length > 0 ? formattedLinks : [{ url: '', platform: '' }],
      };
  
      setForm(populatedForm);
      setOriginalData(populatedForm);
    } catch (error) {
      console.error("Error fetching personal details:", error);
    }
  };  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!originalData) return;
  
    const updatedPayload = {};
  
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
      return;
    }
  
    try {
      await updatePersonalDetails(updatedPayload);
      console.log("Updated successfully");
      setOriginalData(form); // Reset original data
    } catch (error) {
      console.error("Update failed", error);
    }
  };
  
  
  
  useEffect(() => {
    fetchFilledDetails();
  }
  , [])
  return (
    <Card className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-sm">
      <Toaster />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input id="fullName" placeholder="Full Name" value={form.fullName} onChange={handleInputChange} />
        <Input id="email" placeholder="Email" value={form.email} onChange={handleInputChange} />
        <Input id="jobTitle" placeholder="Job Title" value={form.jobTitle} onChange={handleInputChange} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input id="phone" placeholder="Phone no." value={form.phone} onChange={handleInputChange} />
          <div className="flex items-center gap-4">
            <Label htmlFor="dob">DOB</Label>
            <Input
              type="date"
              id="dateOfBirth"
              value={form.dateOfBirth ? new Date(form.dateOfBirth).toISOString().split('T')[0] : ''}
              onChange={handleDateChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input id="nationality" placeholder="Nationality" value={form.nationality} onChange={handleInputChange} />
          <Input id="passport_govt_id" placeholder="Passport Govt ID" value={form.passport_govt_id} onChange={handleInputChange} />
        </div>

        <Input id="location" placeholder="Location" value={form.location} onChange={handleInputChange} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select value={form.maritalStatus} onValueChange={(val) => handleSelectChange('maritalStatus', val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder="Marital Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={form.militaryService} onValueChange={(val) => handleSelectChange('militaryService', val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder="Military Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="serving">Currently Serving</SelectItem>
              <SelectItem value="veteran">Veteran</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>

            <Select value={form.genderPronoun} onValueChange={(val) => handleSelectChange('genderPronoun', val)}>
              <SelectTrigger className='w-full'><SelectValue placeholder="Gender Pronouns" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="he/him">He/Him</SelectItem>
                <SelectItem value="she/her">She/Her</SelectItem>
                <SelectItem value="they/them">They/Them</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input id="drivingLicense" placeholder="Driving License" value={form.drivingLicense} onChange={handleInputChange} />
          <Input id="visa" placeholder="Visa" value={form.visa} onChange={handleInputChange} />
        </div>

        <textarea
          id="personalInfo"
          placeholder="Personal Info"
          className="w-full rounded-2xl border-gray-200 resize-none h-20 p-4"
          value={form.personalInfo}
          onChange={handleInputChange}
        />

        {/* Link Section */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Links</span>
          <Dialog open={isAddLinkDialogOpen} onOpenChange={setIsAddLinkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent aria-describedby="">
              <DialogHeader>
                <DialogTitle className="text-center">Add/Edit Links</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Label className="text-md font-semibold">Social Links</Label>
                {form.socialLinks?.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Select value={link.platform} onValueChange={(val) => handleLinkChange(index, 'platform', val)}>
                      <SelectTrigger className='w-full'><SelectValue placeholder="Platform" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="GitHub">Github</SelectItem>
                        <SelectItem value="Twitter">Twitter</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="YouTube">Youtube</SelectItem>
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="text"
                      key={index}
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemoveLink(index)}
                      className="px-2"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={handleAddLink}
                  variant="outline"
                >
                  Add Link
                </Button>
              </div>
              <DialogFooter>
                <Button variant="secondary" onClick={() => setIsAddLinkDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsAddLinkDialogOpen(false)}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Preview of added links */}
          {form.socialLinks.map((link, index) => (
            <span key={index} className="inline-flex items-center mr-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {link.platform}: {link.url}
            </span>
          ))}
        </div>

        <Button type="submit" className="w-full rounded-full">Submit</Button>
      </form>
    </Card>
  );
};

export default PersonalDetailsForm;
