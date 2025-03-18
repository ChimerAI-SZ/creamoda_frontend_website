import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface PasswordRequirementProps {
  password: string;
}

export const PasswordRequirements: React.FC<PasswordRequirementProps> = ({ password }) => {
  // Add state to track if component is mounted
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Define the requirements
  const requirements = [
    {
      id: 'length',
      label: 'At least 8 characters',
      isMet: password.length >= 8
    },
    {
      id: 'max-length',
      label: 'Maximum 50 characters',
      isMet: password.length <= 50
    },
    {
      id: 'uppercase',
      label: 'At least one uppercase letter',
      isMet: /[A-Z]/.test(password)
    },
    {
      id: 'lowercase',
      label: 'At least one lowercase letter',
      isMet: /[a-z]/.test(password)
    },
    {
      id: 'number',
      label: 'At least one number',
      isMet: /\d/.test(password)
    },
    {
      id: 'special',
      label: 'At least one special character (!@#$%^&*()-_+=)',
      isMet: /[!@#$%^&*()\-_+=]/.test(password)
    },
    {
      id: 'allowed-chars',
      label: 'Only allowed characters (letters, numbers, !@#$%^&*()-_+=)',
      isMet: /^[A-Za-z0-9!@#$%^&*()\-_+=]*$/.test(password)
    }
  ];

  // Count how many requirements are met
  const metRequirementsCount = requirements.filter(req => req.isMet).length;
  const progress = (metRequirementsCount / requirements.length) * 100;

  return (
    <div className={`mt-2 space-y-3 ${isMounted ? 'animate-fadeIn' : 'opacity-0'}`}>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full transition-all duration-300 ease-in-out"
          style={{
            width: `${progress}%`,
            backgroundColor: progress < 40 ? '#E50000' : progress < 100 ? '#F97917' : '#10B981'
          }}
        ></div>
      </div>

      {/* Fixed height container for requirements */}
      <div className="min-h-[120px]">
        <ul className="space-y-1 text-xs">
          {requirements.map(requirement => (
            <li key={requirement.id} className="flex items-center gap-2">
              {requirement.isMet ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-300" />
              )}
              <span className={requirement.isMet ? 'text-gray-700' : 'text-gray-500'}>{requirement.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
