import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Trash } from 'lucide-react';

const PersonalDetailsForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [dob, setDob] = useState('');
  const [nationality, setNationality] = useState('');
  const [passportGovtId, setPassportGovtId] = useState('');
  const [location, setLocation] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [militaryService, setMilitaryService] = useState('');
  const [genderPronouns, setGenderPronouns] = useState('');
  const [drivingLicense, setDrivingLicense] = useState('');
  const [visa, setVisa] = useState('');
  const [personalInfo, setPersonalInfo] = useState('');
  const [links, setLinks] = useState([{ id: 0, url: '', type: '' }]); // Initialize with one empty link
  const [nextLinkId, setNextLinkId] = useState(1);
  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    switch (id) {
      case 'fullName': setFullName(value); break;
      case 'email': setEmail(value); break;
      case 'jobTitle': setJobTitle(value); break;
      case 'phoneNo': setPhoneNo(value); break;
      case 'dob': setDob(value); break;
      case 'nationality': setNationality(value); break;
      case 'passportGovtId': setPassportGovtId(value); break;
      case 'location': setLocation(value); break;
      case 'drivingLicense': setDrivingLicense(value); break;
      case 'visa': setVisa(value); break;
      case 'personalInfo': setPersonalInfo(value); break;
      default: break;
    }
  };


  const handleMaritalStatusChange = (value) => {
    setMaritalStatus(value);
  };

  const handleMilitaryServiceChange = (value) => {
    setMilitaryService(value);
  };

  const handleGenderPronounsChange = (value) => {
    setGenderPronouns(value);
  };

  const handleOpenAddLinkDialog = () => {
    setIsAddLinkDialogOpen(true);
  };

  const handleCloseAddLinkDialog = () => {
    setIsAddLinkDialogOpen(false);
  };

  const handleAddLinkInput = () => {
    setLinks([...links, { id: nextLinkId, url: '', type: '' }]);
    setNextLinkId(nextLinkId + 1);
  };

  const handleLinkInputChange = (id, event) => {
    const { value } = event.target;
    setLinks(links.map(link =>
      link.id === id ? { ...link, url: value } : link
    ));
  };

  const handleLinkSelectChange = (id, value) => {
    setLinks(links.map(link =>
      link.id === id ? { ...link, type: value } : link
    ));
  };

  const handleRemoveLinkInput = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      fullName,
      email,
      jobTitle,
      phoneNo,
      dob,
      nationality,
      passportGovtId,
      location,
      maritalStatus,
      militaryService,
      genderPronouns,
      drivingLicense,
      visa,
      personalInfo,
      links,
    };
    console.log('Form Data:', formData);
    // Here you would typically handle form submission logic,
    // like sending the data to an API.
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-sm">
      <h1 className="text-3xl font-bold text-center">Personal Details</h1>
      <span className='text-center font-light'>This is a subtitle</span>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          type="text"
          id="fullName"
          placeholder="Full Name"
          className="w-full border-gray-200"
          value={fullName}
          onChange={handleInputChange}
        />

        <Input
          type="email"
          id="email"
          placeholder="Email"
          className="w-full border-gray-200"
          value={email}
          onChange={handleInputChange}
        />

        <Input
          type="text"
          id="jobTitle"
          placeholder="Job Title"
          className="w-full border-gray-200"
          value={jobTitle}
          onChange={handleInputChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="tel"
            id="phoneNo"
            placeholder="Phone no."
            className="border-gray-200"
            value={phoneNo}
            onChange={handleInputChange}
          />
          <div className="flex items-center gap-4">
            <Label htmlFor="dob" className="whitespace-nowrap">DOB</Label>
            <Input
              id="dob"
              type="date"
              placeholder="DOB"
              className="border-gray-200 flex-1"
              value={dob}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
            type="text"
            id="nationality"
            placeholder="Nationality"
            className="w-full border-gray-200"
            value={nationality}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            id="passportGovtId"
            placeholder="Passport govt ID"
            className="w-full border-gray-200"
            value={passportGovtId}
            onChange={handleInputChange}
          />
        </div>

        <Input
          type="text"
          id="location"
          placeholder="Location"
          className="w-full border-gray-200"
          value={location}
          onChange={handleInputChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={maritalStatus}  onValueChange={handleMaritalStatusChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Marital Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={militaryService} onValueChange={handleMilitaryServiceChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Military Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="serving">Currently Serving</SelectItem>
              <SelectItem value="veteran">Veteran</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={genderPronouns} onValueChange={handleGenderPronounsChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Gender Pronouns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="he/him">He/Him</SelectItem>
              <SelectItem value="she/her">She/Her</SelectItem>
              <SelectItem value="they/them">They/Them</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            id="drivingLicense"
            placeholder="Driving License"
            className="w-full border-gray-200"
            value={drivingLicense}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            id="visa"
            placeholder="Visa"
            className="w-full border-gray-200"
            value={visa}
            onChange={handleInputChange}
          />
        </div>

        <textarea
          id="personalInfo"
          placeholder="Personal Info"
          className="w-full rounded-2xl border-gray-200 resize-none h-24 p-4"
          value={personalInfo}
          onChange={handleInputChange}
        />

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
                {links.map((link) => (
                  <div key={link.id} className="grid grid-cols-4 items-center gap-4">
                    <Input
                      type="text"
                      placeholder="Link URL"
                      className="col-span-3"
                      value={link.url}
                      onChange={(event) => handleLinkInputChange(link.id, event)}
                    />
                    <Select
                      className="w-full col-span-1"
                      value={link.type}
                      onValueChange={(value) => handleLinkSelectChange(link.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Link" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="Github">Github</SelectItem>
                        <SelectItem value="Twitter">Twitter</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="Youtube">Youtube</SelectItem>
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {links.length > 1 && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="rounded-full"
                        onClick={() => handleRemoveLinkInput(link.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={handleAddLinkInput}>
                  Add Another Link <Plus />
                </Button>
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={handleCloseAddLinkDialog}>Cancel</Button>
                <Button type="button" onClick={handleCloseAddLinkDialog}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {links.map((link) => (
            <span key={link.id} className="inline-flex items-center mr-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {link.type}: {link.url}
            </span>
          ))}
        </div>

        <Button type="submit" className="w-full rounded-full">Submit</Button>
      </form>
    </Card>
  );
};

export default PersonalDetailsForm;