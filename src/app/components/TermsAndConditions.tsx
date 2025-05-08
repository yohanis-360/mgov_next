import React from 'react';
import Link from 'next/link';

interface TermsAndConditionsProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  userType?: 'user' | 'developer';
  className?: string;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ 
  checked, 
  onChange, 
  error, 
  userType = 'user',
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="font-medium text-gray-700">
            I agree to the 
            <Link 
              href={`/terms-and-conditions?type=${userType}`} 
              className="text-customblue hover:text-blue-800 ml-1 inline-flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms and Conditions
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
              </svg>
            </Link>
          </label>
          <p className="text-gray-500">
            {userType === 'developer' 
              ? 'I understand that by submitting this form, I consent to the collection and use of information as per the privacy policy.'
              : 'I understand that by creating an account, I consent to the collection and use of my information as per the privacy policy.'}
          </p>
        </div>
      </div>
      {error && <p className="mt-2 text-xs md:text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default TermsAndConditions; 