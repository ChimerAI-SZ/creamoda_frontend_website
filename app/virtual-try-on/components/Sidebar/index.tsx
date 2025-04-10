'use client';

import { useState, useEffect } from 'react';

export function Sidebar() {
  return (
    <div
      className={`w-[334px] h-[calc(100vh-64px)] flex-shrink-0 bg-white border-r box-content border-gray-200 flex flex-col z-0`}
    >
      <div className="flex-1 overflow-hidden pt-4 ">
        <div className="block h-full"></div>
      </div>
    </div>
  );
}
