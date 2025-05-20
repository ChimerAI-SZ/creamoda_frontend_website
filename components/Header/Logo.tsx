import React, { memo } from 'react';
import Image from 'next/image';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center h-[20px] w-[155px]">
      <Image src="/images/logo-black.svg" alt="Logo" width={155} height={20} />
    </div>
  );
};

export default memo(Logo);
