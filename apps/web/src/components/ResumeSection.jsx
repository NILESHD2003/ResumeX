import React from 'react';
import { Pencil, Download, Trash2, FilePlus2} from 'lucide-react';

const ResumeSection = () => {
  const resumeItems = [
    {
      id: 1,
      image: 'https://placehold.co/300x200?text=Resume+1',
      title: 'Software Engineer Resume',
      description: 'Tailored for full-stack development roles.',
    },
    {
      id: 2,
      image: 'https://placehold.co/300x200?text=Resume+2',
      title: 'Data Scientist Resume',
      description: 'Optimized for machine learning positions.',
    },
    {
      id: 3,
      image: 'https://placehold.co/300x200?text=Resume+3',
      title: 'Product Manager Resume',
      description: 'Suited for leadership and product roles.',
    },
  ];

  const handleEdit = (id) => {
    console.log('Edit clicked for resume ID:', id);
  };

  const handleDownload = (id) => {
    console.log('Download clicked for resume ID:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete clicked for resume ID:', id);
  };

  return (
    <div className=' w-full'>
      <div className="  max-w-7xl mx-auto p-2 text-left ml-4 mt-2 mb-3">
        <h1 className="text-4xl font-bold mb-2">Your Resumes</h1>
        <p className="text-gray-400 mb-1 font-medium">
          Manage and create professional resumes
        </p>
      </div>

      <div className=" relative p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
            <p className="text-sm text-gray-600">{item.description}</p>
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
      <button onClick={() => (console.log("working"))} className="fixed md:absolute bottom-6 right-6 z-10 md:bottom-4 md:right-4 bg-gradient-to-r from-[#CA79FF] to-[#1C7EFF] text-white p-3 rounded-full shadow-lg hover:opacity-90 transition md:block">
        <FilePlus2 size={24} />
      </button>
    </div>
  );
};

export default ResumeSection;
