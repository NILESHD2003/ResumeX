import React, { useEffect, useState } from 'react';
import { getProfileDetails } from '../services/operations/profileDetailsAPIS';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProgressIndicator from '../components/ProgressIndicator';
import StaticBar from '../components/StaticBar';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const PreviewPage = () => {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate()

  const fetchData = async () => {
    const data = await getProfileDetails();
    setProfileData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!profileData) {
    return <div>Loading preview...</div>;
  }

  return (
    <div className="flex flex-col w-full"> {/* Added some spacing between cards */}
        <StaticBar />
        <h1 className="text-3xl pt-2 font-bold text-center">Preview Section</h1>
        <ProgressIndicator currentStep={15}/>
      
      {profileData.personalDetails && (
        <Card className="max-w-xl w-full mx-auto my-3 p-6 bg-white rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Name:</strong> {profileData.personalDetails?.fullName}</p>
            <p><strong>Email:</strong> {profileData.personalDetails?.email}</p>
            <p><strong>Phone:</strong> {profileData.personalDetails?.phone}</p>
            <p><strong>Job Title:</strong> {profileData.personalDetails?.jobTitle}</p>
            {profileData.personalDetails?.location && (
              <p><strong>Location:</strong> {profileData.personalDetails.location}</p>
            )}
            {profileData.personalDetails?.nationality && (
              <p><strong>Nationality:</strong> {profileData.personalDetails.nationality}</p>
            )}
            {profileData.personalDetails?.socialLinks &&
              profileData.personalDetails.socialLinks.map((link, index) => (
                <p key={index}>
                  <strong>{link.platform}:</strong> <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                </p>
              ))}
          </CardContent>
        </Card>
      )}

      {profileData.profileSummary && (
        <Card className="max-w-xl w-full mx-auto my-3 p-6 bg-white rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{profileData.profileSummary}</p>
          </CardContent>
        </Card>
      )}

      {profileData.educationDetails && profileData.educationDetails.length > 0 && (
        <Card className="max-w-xl w-full mx-auto my-3 p-6 bg-white rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profileData.educationDetails.map((edu, index) => (
              <div key={index} className="border rounded-md p-4">
                <h3>{edu.degree}</h3>
                <p><strong>School:</strong> {edu.school}</p>
                {edu.university && <p><strong>University:</strong> {edu.university}</p>}
                <p><strong>City, Country:</strong> {edu.city}, {edu.country}</p>
                <p><strong>Start Date:</strong> {new Date(edu.startDate).toLocaleDateString()}</p>
                {edu.endDate && <p><strong>End Date:</strong> {new Date(edu.endDate).toLocaleDateString()}</p>}
                {edu.grade && <p><strong>Grade:</strong> {edu.grade}</p>}
                {edu.description && <p>{edu.description}</p>}
                {edu.link && <p><strong>Link:</strong> <a href={edu.link} target="_blank" rel="noopener noreferrer">{edu.link}</a></p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {profileData.professionalExperience && profileData.professionalExperience.length > 0 && (
        <Card className="max-w-xl w-full mx-auto my-3 p-6 bg-white rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>Professional Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profileData.professionalExperience.map((exp, index) => (
              <div key={index} className="border rounded-md p-4">
                <h3>{exp.jobTitle}</h3>
                <p><strong>Employer:</strong> {exp.employer}</p>
                <p><strong>City, Country:</strong> {exp.city}, {exp.country}</p>
                <p><strong>Start Date:</strong> {new Date(exp.startDate).toLocaleDateString()}</p>
                {exp.endDate && <p><strong>End Date:</strong> {new Date(exp.endDate).toLocaleDateString()}</p>}
                {exp.description && <p>{exp.description}</p>}
                {exp.link && <p><strong>Link:</strong> <a href={exp.link} target="_blank" rel="noopener noreferrer">{exp.link}</a></p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {profileData.skills && profileData.skills.length > 0 && (
        <Card className="max-w-xl w-full mx-auto my-3 p-6 bg-white rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profileData.skills.map((skill, index) => (
              <div key={index} className="border rounded-md p-4">
                <h3>{skill.name}</h3>
                {skill.subSkills && skill.subSkills.length > 0 && (
                  <p><strong>Sub-skills:</strong> {skill.subSkills.join(', ')}</p>
                )}
                {skill.level && <p><strong>Level:</strong> {skill.level}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {profileData.languages && profileData.languages.length > 0 && (
        <Card className="max-w-xl w-full mx-auto my-3 p-6 bg-white rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>Languages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profileData.languages.map((lang, index) => (
              <div key={index} className="border rounded-md p-4">
                <h3>{lang.name}</h3>
                {lang.level && <p><strong>Level:</strong> {lang.level}</p>}
                {lang.additionalInfo && <p>{lang.additionalInfo}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {profileData.certificates && profileData.certificates.length > 0 && (
        <Card className="max-w-xl w-full mx-auto my-3 p-6 bg-white rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>Certificates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profileData.certificates.map((cert, index) => (
              <div key={index} className="border rounded-md p-4">
                <h3>{cert.title}</h3>
                <p><strong>Issuer:</strong> {cert.issuer}</p>
                {cert.date && <p><strong>Date:</strong> {new Date(cert.date).toLocaleDateString()}</p>}
                {cert.expirationDate && <p><strong>Expiration Date:</strong> {new Date(cert.expirationDate).toLocaleDateString()}</p>}
                {cert.license && <p><strong>License:</strong> {cert.license}</p>}
                {cert.additionalInfo && <p>{cert.additionalInfo}</p>}
                {cert.link && <p><strong>Link:</strong> <a href={cert.link} target="_blank" rel="noopener noreferrer">{cert.link}</a></p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {profileData.projects && profileData.projects.length > 0 && (
        <Card className="max-w-xl w-full mx-auto my-3 p-6 bg-white rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profileData.projects.map((project, index) => (
              <div key={index} className="border rounded-md p-4">
                <h3>{project.title}</h3>
                {project.subtitle && <p><strong>Subtitle:</strong> {project.subtitle}</p>}
                {project.description && <p>{project.description}</p>}
                {project.startDate && <p><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</p>}
                {project.endDate && <p><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</p>}
                {project.links && project.links.length > 0 && (
                  <p>
                    <strong>Links:</strong>{' '}
                    {project.links.map((link, idx) => (
                      <span key={idx}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.platform}
                        </a>
                        {idx < project.links.length - 1 && ', '}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {profileData.awards && profileData.awards.length > 0 && (
        <Card className="max-w-xl w-full mx-auto my-3 p-6 bg-white rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>Awards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profileData.awards.map((award, index) => (
              <div key={index} className="border rounded-md p-4">
                <h3>{award.title}</h3>
                <p><strong>Issuer:</strong> {award.issuer}</p>
                {award.date && <p><strong>Date:</strong> {new Date(award.date).toLocaleDateString()}</p>}
                {award.additionalInfo && <p>{award.additionalInfo}</p>}
                {award.link && <p><strong>Link:</strong> <a href={award.link} target="_blank" rel="noopener noreferrer">{award.link}</a></p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {profileData.courses && profileData.courses.length > 0 && (
        <Card className="max-w-xl w-full mx-auto my-3 p-6 bg-white rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>Courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profileData.courses.map((course, index) => (
              <div key={index} className="border rounded-md p-4">
                <h3>{course.title}</h3>
                <p><strong>Issuer:</strong> {course.issuer}</p>
                {course.date && <p><strong>Date:</strong> {new Date(course.date).toLocaleDateString()}</p>}
                {course.expirationDate && <p><strong>Expiration Date:</strong> {new Date(course.expirationDate).toLocaleDateString()}</p>}
                {course.license && <p><strong>License:</strong> {course.license}</p>}
                {course.additionalInfo && <p>{course.additionalInfo}</p>}
                {course.link && <p><strong>Link:</strong> <a href={course.link} target="_blank" rel="noopener noreferrer">{course.link}</a></p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {profileData.organizations && profileData.organizations.length > 0 && (
        <Card className="max-w-xl w-full mx-auto my-3 p-6 bg-white rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profileData.organizations.map((org, index) => (
              <div key={index} className="border rounded-md p-4">
                <h3>{org.name}</h3>
                <p><strong>City, Country:</strong> {org.city}, {org.country}</p>
                <p><strong>Start Date:</strong> {new Date(org.startDate).toLocaleDateString()}</p>
                {org.endDate && <p><strong>End Date:</strong> {new Date(org.endDate).toLocaleDateString()}</p>}
                {org.description && <p>{org.description}</p>}
                {org.link && <p><strong>Link:</strong> <a href={org.link} target="_blank" rel="noopener noreferrer">{org.link}</a></p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {profileData.publications && profileData.publications.length > 0 && (
        <Card className="max-w-xl w-full mx-auto my-3 p-6 bg-white rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>Publications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profileData.publications.map((pub, index) => (
              <div key={index} className="border rounded-md p-4">
                <h3>{pub.title}</h3>
                <p><strong>Publisher:</strong> {pub.publisher}</p>
                {pub.date && <p><strong>Date:</strong> {new Date(pub.date).toLocaleDateString()}</p>}
                {pub.description && <p>{pub.description}</p>}
                {pub.citation && <p><strong>Citation:</strong> {pub.citation}</p>}
                {pub.link && <p><strong>Link:</strong> <a href={pub.link} target="_blank" rel="noopener noreferrer">{pub.link}</a></p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {profileData.references && profileData.references.length > 0 && (
        <Card className="max-w-xl w-full mx-auto my-3 p-6 bg-white rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>References</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profileData.references.map((ref, index) => (
              <div key={index} className="border rounded-md p-4">
                <h3>{ref.name}</h3>
                <p><strong>Job Title:</strong> {ref.jobTitle}</p>
                <p><strong>Organization:</strong> {ref.organization}</p>
                <p><strong>Email:</strong> {ref.email}</p>
                <p><strong>Phone:</strong> {ref.phone}</p>
                {ref.link && <p><strong>Link:</strong> <a href={ref.link} target="_blank" rel="noopener noreferrer">{ref.link}</a></p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {profileData.declaration && (
        <Card className="max-w-xl w-full mx-auto my-3 p-6 bg-white rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>Declaration</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{profileData.declaration.text}</p>
            <p><strong>Date:</strong> {new Date(profileData.declaration.date).toLocaleDateString()}</p>
            <p><strong>Full Name:</strong> {profileData.declaration.fullName}</p>
            <p><strong>Place:</strong> {profileData.declaration.place}</p>
            <p><strong>Signature:</strong> {profileData.declaration.signature}</p>
          </CardContent>
        </Card>
      )}

      <div className='flex max-w-xl mb-4 mx-auto'>
        <div>
          <Button onClick={() => {navigate('/generate-resume')}} className="mr-20">Generate Resume</Button>
        </div>
        <div>
          <Button variant="outline" onClick={() => {navigate('/dashboard')}} className="ml-20">Skip for now</Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;