import React, { useState } from 'react';


const PricingSection = () => {
  const [plan, setPlan] = useState('monthly');

  return (
    <section className="flex flex-col items-center px-4 py-8" id="pricing">
      
        {/* Title */}
        <h3 className="text-4xl font-medium mt-8 text-center">
          Simple, transparent pricing
        </h3>
        <p className="text-2xl text-[#757575] mt-6 font-semibold text-center">
          Choose the plan that's right for your career journey.
        </p>

        {/* Monthly / Yearly Buttons */}
        <div className="flex space-x-4 mt-8">
          <button
            onClick={() => setPlan('monthly')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              plan === 'monthly' ? 'bg-gray-200 text-black' : 'text-gray-500'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setPlan('yearly')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              plan === 'yearly' ? 'bg-gray-200 text-black' : 'text-gray-500'
            }`}
          >
            Yearly
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl mt-10">
          {/* Free Plan */}
          <div className=" rounded-lg p-6 text-center shadow-md">
            <h2 className="text-xl font-semibold mb-2">Free</h2>
            <p className="text-4xl font-bold">Free</p>
            <ul className="text-gray-500 mt-4 space-y-1">
              <li>List item</li>
              <li>List item</li>
              <li>List item</li>
            </ul>
          </div>

          {/* Premium Plan */}
          <div className=" rounded-lg p-6 text-center shadow-md">
            <h2 className="text-xl font-semibold mb-2">Premium</h2>
            <p className="text-4xl font-bold">
              ${plan === 'monthly' ? '9' : '90'}
              <span className="text-base font-medium text-gray-500">
                /{plan === 'monthly' ? 'mo' : 'yr'}
              </span>
            </p>
            <ul className="text-gray-500 mt-4 space-y-1">
              <li>List item</li>
              <li>List item</li>
              <li>List item</li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className=" rounded-lg p-6 text-center shadow-md">
            <h2 className="text-xl font-semibold mb-2">Pro</h2>
            <p className="text-4xl font-bold">
              ${plan === 'monthly' ? '19' : '190'}
              <span className="text-base font-medium text-gray-500">
                /{plan === 'monthly' ? 'mo' : 'yr'}
              </span>
            </p>
            <ul className="text-gray-500 mt-4 space-y-1">
              <li>List item</li>
              <li>List item</li>
              <li>List item</li>
            </ul>
          </div>
        </div>
      
    </section>
  );
};

export default PricingSection;
