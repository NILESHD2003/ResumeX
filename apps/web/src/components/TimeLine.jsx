import React, { Fragment } from 'react';


const TimeLine = ({ step }) => {
  const stepsData = [
    {
      heading: 'STEP 1 — Add Content',
      subHeading: "Build your resume — we'll guide you every step of the way.",
      image: '/assets/Add_Content.png',
      direction: 'right',
    },
    {
      heading: 'STEP 2 — Upload Job Description',
      subHeading:
        'Upload the JD — our Agentic AI recommends skills, projects, certifications.',
      image: '/assets/Upload_Job_Description.png',
      direction: 'left',
    },
    {
      heading: 'STEP 3 — Design Effortlessly',
      subHeading:
        'Customize your resume with beautiful templates and a personal touch.',
      image: '/assets/Design_Effortlessly.png',
      direction: 'right',
    },
    {
      heading: 'STEP 4 — Download & Share',
      subHeading: 'Export as PDF or share online with a unique link.',
      image: '/assets/Download_&_Share.png',
      direction: 'left',
    },
  ];

  return (
    <>
      
        <h2 className="text-bold ml-3 mt-6 mb-6 text-5xl text-center">
          How it Works?
        </h2>
        <div className="flex flex-col gap-y-3 w-full my-4">
          <Circle />
          {stepsData.map((step, key) => {
            return (
              <Fragment key={key}>
                <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 items-center mx-auto">
                  {step.direction === 'left' ? (
                    <StepsCard
                      heading={step.heading}
                      subHeading={step.subHeading}
                      image={step.image}
                    />
                  ) : (
                    <div></div>
                  )}

                  <Pillar />

                  {step.direction === 'right' ? (
                    <StepsCard
                      heading={step.heading}
                      subHeading={step.subHeading}
                      image={step.image}
                    />
                  ) : (
                    <div></div>
                  )}
                </div>

                {key < stepsData.length - 1 && <Circle />}
              </Fragment>
            );
          })}

          <Circle />
        </div>
      
    </>
  );
};

const Circle = () => {
  return (
    <div className="bg-gradient-to-r from-[#1C7EFF] to-[#CA79FF] rounded-full w-4 h-4  mx-auto"></div>
  );
};

const Pillar = () => {
  return (
    <div className="bg-gradient-to-b from-[#1C7EFF] to-[#CA79FF] rounded-t-full rounded-b-full mx-auto  w-2 h-full"></div>
  );
};

const StepsCard = ({ heading, subHeading, image }) => {
  return (
    <div className="transition duration-300 ease-in-out transform hover:shadow-2xl  flex flex-col gap-y-2 shadow-md rounded-xl p-4">
      <img
        src={image}
        alt={heading}
        className="w-full rounded-t-lg sm:h-56 md:h-64"
      />
      <div className="bg-gradient-to-r from-[#1C7EFF] to-[#CA79FF] bg-clip-text text-transparent font-bold text-lg border-b">
        {heading}
      </div>
      <div className="text-sm text-gray-700">{subHeading}</div>
    </div>
  );
};

export default TimeLine;
