import React from 'react';
import avatar from '/assets/Avatar.png';



const ReviewsSection = () => {
  // Review data
  const reviews = [
    {
      rating: 5,
      text: '"ResumeFlow helped me land my dream job! The templates are beautiful and the editor is so easy to use. I created a professional resume in less than 30 minutes."',
      author: 'Sarah Johnson',
      title: 'Marketing Manager',
      image: avatar,
    },
    {
      rating: 5,
      text: '"As someone who struggled with creating resumes, this platform was a game-changer. The content suggestions made it so easy to highlight my skills properly."',
      author: 'Michael Chen',
      title: 'Software Engineer',
      image: avatar,
    },
    {
      rating: 5,
      text: '"The ATS optimization feature is incredible. I started getting more interview calls almost immediately after switching to a resume I made with ResumeFlow."',
      author: 'Emily Rodriguez',
      title: 'HR Specialist',
      image: avatar,
    },
  ];

  // Function to push stars in stars array
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.928c-.383-1.21-1.172-1.21-1.555 0L3.995 6.75a.7.7 0 01-.139.77l-2.14 6.632c-.159.49-.011 1.03.384 1.362.395.332 1.053.306 1.383-.03l5.418-4.167a.7.7 0 01.764 0l5.418 4.167c.33.336.988.362 1.383.03.395-.332.543-.872.384-1.362l-2.14-6.632a.7.7 0 01-.139-.77l-3.214-3.822z" />
        </svg>,
      );
    }
    return stars;
  };

  // implementing review section
  return (
    <div className="bg-[#F1F0FB] py-16 rounded-lg px-0 mx-0">
      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What our users say
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              Thousands of job seekers have used ResumeFlow to create standout
              resumes.
            </p>
          </div>
          {/* mapping rating */}
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center mb-4">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-gray-700 text-sm italic mb-4">
                    {review.text}
                  </p>
                </div>
                <div className="flex items-center mt-4">
                  <img
                    className="w-10 h-10 rounded-full object-cover mr-3"
                    src={review.image}
                    alt={review.author}
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {review.author}
                    </h4>
                    <p className="text-gray-500 text-xs">{review.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      
    </div>
  );
};

export default ReviewsSection;
