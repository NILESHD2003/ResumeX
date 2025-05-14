import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy – ResumeX</h1>
      <p className="mb-2">Effective Date: [Insert Date]</p>
      <p className="mb-4">Last Updated: [Insert Date]</p>

      <p className="mb-4">
        ResumeX respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and disclose your information when you use our platform, including our website and related services.
      </p>
      <p className="mb-6">By using ResumeX, you agree to the terms of this Privacy Policy.</p>

      <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
      <p className="mb-2 font-semibold">a. Personal Information</p>
      <ul className="list-disc list-inside mb-2">
        <li>Full name</li>
        <li>Email address</li>
        <li>Phone number (if provided)</li>
        <li>Professional experience, education, and resume content</li>
        <li>Profile photo (if uploaded)</li>
        <li>Payment details (only if you purchase premium services; processed via secure third-party payment gateways)</li>
      </ul>
      <p className="mb-2 font-semibold">b. Usage Data</p>
      <ul className="list-disc list-inside mb-2">
        <li>IP address</li>
        <li>Browser type and version</li>
        <li>Pages visited</li>
        <li>Time and date of visit</li>
        <li>Device information</li>
        <li>Referral source</li>
      </ul>
      <p className="mb-2 font-semibold">c. Cookies and Tracking Technologies</p>
      <p className="mb-4">
        We use cookies and similar tracking technologies to enhance your user experience. You can manage cookie preferences through your browser settings.
      </p>

      <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc list-inside mb-4">
        <li>To provide and improve our resume-building services</li>
        <li>To personalize your experience</li>
        <li>To communicate with you about your account or updates</li>
        <li>To process payments for premium services</li>
        <li>To conduct analytics and monitor platform performance</li>
        <li>To detect and prevent fraud or abuse</li>
        <li>To comply with legal obligations</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">3. Legal Basis for Processing (GDPR Compliance)</h2>
      <p className="mb-2">If you are located in the European Economic Area (EEA), we process your personal data under the following legal bases:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Your consent</li>
        <li>Performance of a contract (e.g., providing services)</li>
        <li>Legal obligations</li>
        <li>Legitimate interests, such as improving our services</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">4. Data Sharing and Disclosure</h2>
      <p className="mb-2">We do not sell your personal data. We only share your data in the following cases:</p>
      <ul className="list-disc list-inside mb-4">
        <li>With trusted third-party service providers (e.g., payment processors, analytics tools)</li>
        <li>To comply with legal obligations, court orders, or law enforcement</li>
        <li>In case of a merger, acquisition, or asset sale (with appropriate safeguards)</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">5. Data Retention</h2>
      <p className="mb-4">
        We retain your personal data only as long as necessary to fulfil the purposes outlined in this policy or to comply with legal obligations. You may request deletion of your account and associated data at any time.
      </p>

      <h2 className="text-xl font-semibold mb-2">6. Your Data Protection Rights</h2>
      <p className="mb-2">Depending on your location, you may have the right to:</p>
      <ul className="list-disc list-inside mb-2">
        <li>Access, correct, or delete your personal data</li>
        <li>Withdraw consent at any time</li>
        <li>Object to or restrict data processing</li>
        <li>Lodge a complaint with a data protection authority</li>
      </ul>
      <p className="mb-4">To exercise any of these rights, contact us at <a href="mailto:support@resumex.com" className="text-blue-600 underline">support@resumex.com</a>.</p>

      <h2 className="text-xl font-semibold mb-2">7. Data Security</h2>
      <p className="mb-4">
        We implement appropriate technical and organizational measures to protect your data from unauthorized access, alteration, disclosure, or destruction. These include:
      </p>
      <ul className="list-disc list-inside mb-2">
        <li>SSL encryption</li>
        <li>Secure authentication protocols</li>
        <li>Regular security audits</li>
      </ul>
      <p className="mb-4">However, no internet transmission is 100% secure. You use ResumeX at your own risk.</p>

      <h2 className="text-xl font-semibold mb-2">8. Children’s Privacy</h2>
      <p className="mb-4">
        ResumeX is not intended for children under 13 (or equivalent minimum age in relevant jurisdictions). We do not knowingly collect data from minors.
      </p>

      <h2 className="text-xl font-semibold mb-2">9. Third-Party Links</h2>
      <p className="mb-4">
        Our platform may contain links to third-party websites or services. We are not responsible for their content or privacy practices. We recommend reviewing their policies separately.
      </p>

      <h2 className="text-xl font-semibold mb-2">10. International Transfers</h2>
      <p className="mb-4">
        Your data may be transferred to and processed in countries outside your own. We ensure appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) where required.
      </p>

      <h2 className="text-xl font-semibold mb-2">11. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated “Effective Date.” You are encouraged to review this policy regularly.
      </p>

      <h2 className="text-xl font-semibold mb-2">12. Contact Us</h2>
      <p>
        For questions, concerns, or data requests, contact us at: <br />
        Email: <a href="mailto:support@resumex.com" className="text-blue-600 underline">support@resumex.com</a>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
