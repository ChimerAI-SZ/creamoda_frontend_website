import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <div className="text-black font-inter text-[24px] font-medium leading-[32px] h-[32px] pb-2 mb-4 border-b border-[#E0E0E0] box-content">
      {title}
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

const Modal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  sections: { title: string; content: React.ReactNode }[];
}> = ({ open, onOpenChange, title, sections }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="w-[841px] h-[680px] max-w-none flex flex-col p-0">
      <DialogHeader className="flex items-center justify-between pt-6 px-6">
        <DialogTitle className="w-full leading-[48px] h-[48px]">
          <span className="text-[#000] font-inter text-[32px] font-bold">{title}</span>
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 h-[calc(100%-48px)] p-6 pb-8 overflow-y-auto">
        {sections.map((section, index) => (
          <Section key={index} title={section.title}>
            {section.content}
          </Section>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);

export default React.memo(Modal);
