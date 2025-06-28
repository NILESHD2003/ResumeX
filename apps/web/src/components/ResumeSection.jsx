import React, { useEffect, useState } from 'react';
import { Pencil, Download, Trash2, FilePlus2} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserAllGeneratedResumes } from '../services/operations/resumeDataAPIS';
import { toast, Toaster } from 'sonner';
import { useDispatch } from 'react-redux';
import { setJobId } from '../slices/jobIdSlice';

const ResumeSection = () => {
  const navigate = useNavigate();
  const [resumeItems, setResumeItems] = useState([]);
  const dispatch = useDispatch(); // Initialize useDispatch

  const handleEdit = (id) => {
    console.log('Edit clicked for resume ID:', id);
    dispatch(setJobId(id)); // Dispatch the _id as jobId
    navigate('/resume/preview'); // Navigate to /resume/preview
  };

  const handleDownload = (id) => {
    console.log('Download clicked for resume ID:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete clicked for resume ID:', id);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserAllGeneratedResumes();
      if (data) {
        // Map the fetched data to the desired format for rendering
        const formattedResumes = data.map((resume, index) => ({
          id: resume._id, // Using the unique _id from the fetched data
          image: `https://placehold.co/300x200?text=Resume+${index + 1}`,
          title: `Resume ${index + 1}`,
          description: resume.profileSummary || 'No summary provided.', // Use profileSummary if available, otherwise a default
        }));
        setResumeItems(formattedResumes);
        toast.success('Resumes loaded successfully!');
      } else {
        toast.warning('No resume data available. Please create a new resume.');
      }
    };
    fetchData();
  }, []);

  return (
    <div className='w-full'>
      <Toaster />
      <div className="max-w-7xl mx-auto p-2 text-left ml-4 mt-2 mb-3">
        <h1 className="text-4xl font-bold mb-2">Your Resumes</h1>
        <p className="text-gray-400 mb-1 font-medium">
          Manage and create professional resumes
        </p>
      </div>

      <div className="relative p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {resumeItems.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow rounded-lg p-4 flex flex-col gap-3 w-full"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-40 object-cover rounded-md"
            />
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <div className="flex justify-end gap-4 mt-2 text-gray-700">
              <Pencil
                className="cursor-pointer p-1 border-1 border-gray-100 rounded-md"
                onClick={() => handleEdit(item.id)}
              />
              <Download
                className="cursor-pointer p-1 border-1 border-gray-100 rounded-md"
                onClick={() => handleDownload(item.id)}
              />
              <Trash2
                className="cursor-pointer text-red-500 p-1 border-1 border-gray-100 rounded-md"
                onClick={() => handleDelete(item.id)}
              />
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => {navigate('/generate-resume')}} className="fixed md:absolute bottom-6 right-6 z-10 md:bottom-4 md:right-4 bg-gradient-to-r from-[#CA79FF] to-[#1C7EFF] text-white p-3 rounded-full shadow-lg hover:opacity-90 transition md:block">
        <FilePlus2 size={24} />
      </button>
    </div>
  );
};

export default ResumeSection;