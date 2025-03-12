import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface UsernameRequirementProps {
  username: string;
}

export const UsernameRequirements: React.FC<UsernameRequirementProps> = ({ username }) => {
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
      label: 'Between 3 and 16 characters',
      isMet: username.length >= 3 && username.length <= 16
    },
    {
      id: 'characters',
      label: 'Only letters, numbers, underscores and hyphens',
      isMet: /^[a-zA-Z0-9_-]*$/.test(username)
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
            backgroundColor: progress < 50 ? '#E50000' : progress < 100 ? '#F97917' : '#10B981'
          }}
        ></div>
      </div>

      <div className="min-h-[50px]">
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
