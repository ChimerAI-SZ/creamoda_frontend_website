'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Pipette, X } from 'lucide-react';
import Image from 'next/image';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value = '#ffffff', onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(value);
  const [hue, setHue] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const colorPanelRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert HSV to RGB
  const hsvToRgb = (h: number, s: number, v: number) => {
    let r = 0,
      g = 0,
      b = 0;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${[r, g, b]
      .map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')}`;
  };

  // Convert Hex to RGB
  const hexToRgb = useCallback((hex: string) => {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Parse hex values
    let r, g, b;
    if (hex.length === 3) {
      r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
      g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
      b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
    } else {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }

    return { r, g, b };
  }, []);

  // Convert RGB to HSV
  const rgbToHsv = useCallback((r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    const s = max === 0 ? 0 : delta / max;
    const v = max;

    if (delta === 0) {
      h = 0;
    } else if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    return { h, s, v };
  }, []);

  // Convert Hex to HSV
  const hexToHsv = useCallback((hex: string) => {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHsv(r, g, b);
  }, [hexToRgb, rgbToHsv]);

  // Update positions based on current color - memoize this function to prevent infinite updates
  const updatePositionsFromColor = useCallback((color: string) => {
    if (!colorPanelRef.current) return;

    const { h, s, v } = hexToHsv(color);
    const { width, height } = colorPanelRef.current.getBoundingClientRect();

    // Update hue
    setHue(h);

    // Update position based on saturation and value
    const x = s * width;
    const y = (1 - v) * height;

    setPosition({ x, y });
  }, [hexToHsv]);

  // Update color based on position in color panel
  const updateColorFromPosition = (x: number, y: number) => {
    if (colorPanelRef.current) {
      const { width, height } = colorPanelRef.current.getBoundingClientRect();

      // Constrain x and y within the bounds of the color panel
      const boundedX = Math.max(0, Math.min(width, x));
      const boundedY = Math.max(0, Math.min(height, y));

      const s = boundedX / width;
      const v = 1 - boundedY / height;

      const { r, g, b } = hsvToRgb(hue / 360, s, v);
      const hex = rgbToHex(r, g, b);

      setCurrentColor(hex);
      onChange(hex);
      setPosition({ x: boundedX, y: boundedY });
    }
  };

  // Handle color panel click/drag
  const handleColorPanelInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (colorPanelRef.current) {
      const rect = colorPanelRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

      updateColorFromPosition(x, y);
    }
  };

  // Handle hue slider change
  const handleHueChange = (e: React.MouseEvent | React.TouchEvent) => {
    if (hueSliderRef.current) {
      const rect = hueSliderRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

      // Constrain x within the bounds of the hue slider
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const newHue = (x / rect.width) * 360;

      setHue(newHue);

      // Update color using current position and new hue
      if (colorPanelRef.current) {
        const { width, height } = colorPanelRef.current.getBoundingClientRect();
        const s = position.x / width;
        const v = 1 - position.y / height;

        const { r, g, b } = hsvToRgb(newHue / 360, s, v);
        const hex = rgbToHex(r, g, b);

        setCurrentColor(hex);
        onChange(hex);
      }
    }
  };

  // Handle hex input change
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) {
      setCurrentColor(hex);
      onChange(hex);
      updatePositionsFromColor(hex);
    }
  };

  // Handle eyedropper click
  const handleEyedropper = async () => {
    try {
      // @ts-expect-error - EyeDropper is not in the standard TypeScript types yet
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      setCurrentColor(result.sRGBHex);
      onChange(result.sRGBHex);
      updatePositionsFromColor(result.sRGBHex);
    } catch (e) {
      console.error('Eye dropper error:', e);
    }
  };

  // Update internal state when prop value changes
  useEffect(() => {
    setCurrentColor(value);
    onChange(value);

    if (isOpen) {
      updatePositionsFromColor(value);
    }
  }, [value, isOpen, updatePositionsFromColor, onChange]);

  // Update positions when picker is opened - remove currentColor from dependencies to prevent loop
  useEffect(() => {
    if (isOpen) {
      updatePositionsFromColor(currentColor);
    }
  }, [isOpen, updatePositionsFromColor, currentColor]);

  const { r, g, b } = hsvToRgb(hue / 360, 1, 1);
  const sliderColor = rgbToHex(r, g, b);

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center justify-between h-[48px] bg-[#EFF3F6] rounded-[8px] w-full px-4 py-2">
        <div className="flex-1 flex items-center rounded-md py-2 cursor-pointer gap-4">
          <div className="text-[#0A1532] text-sm font-normal">Hex</div>
          <div
            className="flex items-center justify-start w-[224px] bg-white h-[32px] rounded-[8px] p-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-5 h-5 rounded-md mr-4" style={{ backgroundColor: currentColor }} />
            <div className="w-[1px] h-full bg-[#EFF3F6] mr-4" />
            <span className="text-sm flex-1 text-gray-40 font-normal">{currentColor}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            handleEyedropper();
          }}
          className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Image src="/images/generate/pipette.svg" alt="pipette" width={20} height={20} />
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent overlayVisible={false} className="p-4 w-[280px] left-[426px] translate-x-0 shadow-card-shadow">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center justify-between">
                <span className="text-sm font-normal">Colors</span>
                <DialogTrigger asChild>
                  <X className="w-4 h-4 cursor-pointer" />
                </DialogTrigger>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="top-full z-10 bg-white rounded-md">
            {/* Color gradient panel */}
            <div
              ref={colorPanelRef}
              className="w-full h-40 relative cursor-crosshair rounded-[16px]"
              style={{
                background: `linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`,
                backgroundImage: `
                linear-gradient(to top, #000, transparent),
                linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))
              `
              }}
              onMouseDown={e => {
                e.stopPropagation();
                handleColorPanelInteraction(e);
                const onMouseMove = (e: MouseEvent) => handleColorPanelInteraction(e as any);
                const onMouseUp = () => {
                  document.removeEventListener('mousemove', onMouseMove);
                  document.removeEventListener('mouseup', onMouseUp);
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
              }}
              onClick={handleColorPanelInteraction}
            >
              <div
                className="absolute w-4 h-4 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-md"
                style={{
                  left: position.x,
                  top: position.y,
                  backgroundColor: currentColor
                }}
              />
            </div>

            {/* Hue slider */}
            <div
              ref={hueSliderRef}
              className="w-full h-3 mt-4 rounded-[16px] cursor-pointer relative"
              style={{
                background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)'
              }}
              onMouseDown={e => {
                handleHueChange(e);
                const onMouseMove = (e: MouseEvent) => handleHueChange(e as any);
                const onMouseUp = () => {
                  document.removeEventListener('mousemove', onMouseMove);
                  document.removeEventListener('mouseup', onMouseUp);
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
              }}
              onClick={handleHueChange}
            >
              <div
                className="absolute flex items-center justify-center w-4 h-4 bg-white border border-gray-300 rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-sm pointer-events-none"
                style={{
                  left: `${Math.max(1, Math.min(99, (hue / 360) * 100))}%`
                }}
              >
                <div className={cn('w-2 h-2 rounded-full')} style={{ background: sliderColor }} />
              </div>
            </div>

            {/* Hex input */}
            <div className="flex items-center mt-4">
              <div className="text-[#0A1532] text-sm font-normal mr-[6px]">Hex</div>
              <input
                type="text"
                value={currentColor}
                onChange={handleHexChange}
                className="w-full px-2 py-1 rounded-[8px] text-sm text-center bg-[#EFF3F6]"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
