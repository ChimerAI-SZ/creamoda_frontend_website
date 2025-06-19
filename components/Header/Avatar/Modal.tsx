import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="pb-6 last:pb-[40px]">
    <div className="text-[#0A1532] text-xl font-bold mb-3">{title}</div>
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
    <DialogContent className="w-[720px] max-w-none flex flex-col p-0 gap-0">
      <DialogHeader className="flex items-center justify-between pt-[40px] px-[48px] pb-6">
        <DialogTitle className="w-full leading-[40px] text-[28px] font-bold text-[#0A1532] font-inter border-b pb-6 border-[#EFF3F6]">
          <span>{title}</span>
        </DialogTitle>
      </DialogHeader>
      <div className="px-[48px]">
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
