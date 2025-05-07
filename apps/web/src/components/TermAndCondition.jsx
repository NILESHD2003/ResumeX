// src/pages/Terms.jsx or src/components/Terms.jsx

import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">ResumeX – Terms and Conditions</h1>
      <p className="mb-4">Effective Date: [Insert Date]</p>
      
      <p className="font-semibold mt-6 mb-2">1. Service Description</p>
      <ul className="list-disc list-inside mb-4">
        <li>ResumeX is an online platform for resume and cover letter creation.</li>
        <li>Operated by ResumeX, registered in India.</li>
        <li>Users can build documents, track applications, and design profiles/signatures.</li>
        <li>Offers free and premium services.</li>
        <li>ResumeX is not responsible for job application outcomes.</li>
      </ul>

      <p className="font-semibold mt-6 mb-2">2. Account Registration and Security</p>
      <ul className="list-disc list-inside mb-4">
        <li>Users must register and provide accurate info.</li>
        <li>One account per user; protect login credentials.</li>
        <li>Notify of breaches immediately.</li>
        <li>Accounts violating terms may be suspended.</li>
      </ul>

      <p className="font-semibold mt-6 mb-2">3. Acceptable Use Policy</p>
      <ul className="list-disc list-inside mb-4">
        <li>Must be 18+ or have consent to use.</li>
        <li>No illegal use, spam, or bots.</li>
        <li>Violations may lead to termination.</li>
      </ul>

      <p className="font-semibold mt-6 mb-2">4. Privacy and Data Protection</p>
      <ul className="list-disc list-inside mb-4">
        <li>Follows data laws like GDPR.</li>
        <li>No data selling; only service improvement.</li>
        <li>Request deletion via support@resumex.com.</li>
      </ul>

      <p className="font-semibold mt-6 mb-2">5. Intellectual Property</p>
      <ul className="list-disc list-inside mb-4">
        <li>Content belongs to ResumeX or licensors.</li>
        <li>Users own their content; ResumeX processes it.</li>
        <li>Don't copy or distribute without permission.</li>
      </ul>

      <p className="font-semibold mt-6 mb-2">6. Service Availability and Liability</p>
      <ul className="list-disc list-inside mb-4">
        <li>No guaranteed uptime.</li>
        <li>Not liable for data loss or missed opportunities.</li>
        <li>Use at your own risk.</li>
      </ul>

      <p className="font-semibold mt-6 mb-2">7. Payments and Subscriptions</p>
      <ul className="list-disc list-inside mb-4">
        <li>Some features require payment.</li>
        <li>Prices may vary and are subject to change.</li>
        <li>Subscriptions auto-renew unless canceled.</li>
        <li>Refund policy via support@resumex.com.</li>
      </ul>

      <p className="font-semibold mt-6 mb-2">8. Termination</p>
      <ul className="list-disc list-inside mb-4">
        <li>Close your account anytime via support.</li>
        <li>Violating accounts may be terminated.</li>
        <li>Data may be deleted upon termination.</li>
      </ul>

      <p className="font-semibold mt-6 mb-2">9. Changes to Terms</p>
      <ul className="list-disc list-inside mb-4">
        <li>We may update terms anytime.</li>
        <li>Continued use means acceptance.</li>
      </ul>

      <p className="font-semibold mt-6 mb-2">10. Governing Law</p>
      <p className="mb-4">Governed by Indian law. Disputes subject to courts in India.</p>

      <p className="font-semibold mt-6 mb-2">11. Contact</p>
      <p>Email: <a href="mailto:support@resumex.com" className="text-blue-600 underline">support@resumex.com</a></p>
    </div>
  );
};

export default Terms;
