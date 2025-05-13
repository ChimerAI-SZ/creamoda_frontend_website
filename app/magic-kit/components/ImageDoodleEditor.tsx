'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { HexColorPicker } from 'react-colorful';
import { ReactSketchCanvas, type ReactSketchCanvasRef } from 'react-sketch-canvas';
import { PencilIcon, EraserIcon, TrashIcon, UndoIcon, RedoIcon, SaveIcon } from 'lucide-react';

interface ImageDoodleEditorProps {
  imageUrl: string;
  maskImageUrl?: string;
  onSave?: (doodleDataUrl: string, strokes: any[]) => void;
  initialStrokes?: any[];
}

export default function ImageDoodleEditor({
  imageUrl,
  maskImageUrl,
  onSave,
  initialStrokes = []
}: ImageDoodleEditorProps) {
  const [color, setColor] = useState<string>('#ff0000');
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [eraseMode, setEraseMode] = useState<boolean>(false);
  const [maskDataUrl, setMaskDataUrl] = useState<string | null>(maskImageUrl || null);
  const [transparentDoodleUrl, setTransparentDoodleUrl] = useState<string | null>(maskImageUrl || null);
  const [strokes, setStrokes] = useState<any[]>(initialStrokes);
  const [pathsChanged, setPathsChanged] = useState<boolean>(false);
  const [strokeWidth, setStrokeWidth] = useState<number>(15);
  const [eraserWidth, setEraserWidth] = useState<number>(15);
  const [showPenSlider, setShowPenSlider] = useState<boolean>(false);
  const [showEraserSlider, setShowEraserSlider] = useState<boolean>(false);

  // Reference to the ReactSketchCanvas component
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  // Canvas for generating previews
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundImgRef = useRef<HTMLImageElement | null>(null);

  // Track drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const drawingRef = useRef(false);
  const animationFrameId = useRef<number | null>(null);

  // Performance optimization - throttle updates
  const lastUpdateTime = useRef<number>(0);
  const THROTTLE_TIME = 30; // ms between updates during drawing
  const MASK_UPDATE_DELAY = 200; // ms to delay mask generation after drawing stops

  // Timeouts for delayed hiding of sliders
  const penSliderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eraserSliderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle pen tool selection
  const handlePenClick = useCallback(() => {
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  }, []);

  // Handle eraser tool selection
  const handleEraserClick = useCallback(() => {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  }, []);

  // Handle stroke width change
  const handleStrokeWidthChange = useCallback((value: number[]) => {
    setStrokeWidth(value[0]);
  }, []);

  // Handle eraser width change
  const handleEraserWidthChange = useCallback((value: number[]) => {
    setEraserWidth(value[0]);
  }, []);

  // Handle color picker toggle
  const handleColorPickerToggle = useCallback(() => {
    setShowColorPicker(!showColorPicker);
  }, [showColorPicker]);

  // Handle color change
  const handleColorChange = useCallback((newColor: string) => {
    setColor(newColor);
  }, []);

  // Handle undo action
  const handleUndo = useCallback(() => {
    canvasRef.current?.undo();
    setPathsChanged(true);
  }, []);

  // Handle redo action
  const handleRedo = useCallback(() => {
    canvasRef.current?.redo();
    setPathsChanged(true);
  }, []);

  // Handle reset canvas action (clears canvas and undo/redo history)
  const handleReset = useCallback(() => {
    canvasRef.current?.resetCanvas();
    setStrokes([]);
    setTransparentDoodleUrl(null);
    setMaskDataUrl(null);
    setPathsChanged(false);
  }, []);

  // Handle save action
  const handleSave = useCallback(() => {
    if (maskDataUrl && onSave) {
      onSave(maskDataUrl, strokes);
    }
  }, [maskDataUrl, onSave, strokes]);

  // Function to continuously update preview during drawing
  const updatePreviewContinuously = useCallback(() => {
    if (!drawingRef.current || !canvasRef.current) {
      return;
    }

    const now = Date.now();
    if (now - lastUpdateTime.current < THROTTLE_TIME) {
      // Throttle updates to improve performance
      animationFrameId.current = requestAnimationFrame(updatePreviewContinuously);
      return;
    }

    lastUpdateTime.current = now;

    canvasRef.current
      .exportImage('png')
      .then(image => {
        setTransparentDoodleUrl(image);
        animationFrameId.current = requestAnimationFrame(updatePreviewContinuously);
      })
      .catch(error => {
        console.error('Failed to export image during drawing:', error);
        animationFrameId.current = requestAnimationFrame(updatePreviewContinuously);
      });
  }, []);

  // Get the current strokes from the canvas
  const updateStrokesFromCanvas = useCallback(async () => {
    if (canvasRef.current) {
      try {
        const currentStrokes = await canvasRef.current.exportPaths();
        setStrokes(currentStrokes);
      } catch (error) {
        console.error('Failed to export paths:', error);
      }
    }
  }, []);

  // Generate black and white mask image from the canvas drawing
  const generateMaskFromCanvas = useCallback(async () => {
    if (!maskCanvasRef.current) return;

    const canvas = maskCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas and set black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (canvasRef.current) {
      try {
        // Get the image from the canvas
        const imageData = await canvasRef.current.exportImage('png');

        // Create a temporary image to draw on the mask canvas
        const img = new Image();
        img.onload = () => {
          // Draw the canvas content as white
          ctx.globalCompositeOperation = 'source-over';

          // Create a temporary canvas to convert the colored image to black and white
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext('2d');

          if (tempCtx) {
            // Draw the image to the temp canvas
            tempCtx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Get the image data
            const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const data = imgData.data;

            // Convert to black and white mask (any non-transparent pixel becomes white)
            for (let i = 0; i < data.length; i += 4) {
              // If pixel has any opacity (alpha > 0)
              if (data[i + 3] > 0) {
                // Set it to white
                data[i] = 255; // R
                data[i + 1] = 255; // G
                data[i + 2] = 255; // B
                data[i + 3] = 255; // A
              } else {
                // Keep transparent pixels as black (background)
                data[i] = 0; // R
                data[i + 1] = 0; // G
                data[i + 2] = 0; // B
                data[i + 3] = 255; // A (fully opaque)
              }
            }

            // Put the modified image data back to the temp canvas
            tempCtx.putImageData(imgData, 0, 0);

            // Draw the black and white image to the mask canvas
            ctx.drawImage(tempCanvas, 0, 0);

            // Save mask image data
            setMaskDataUrl(canvas.toDataURL('image/png'));
          }
        };
        img.src = imageData;
      } catch (error) {
        console.error('Failed to generate mask:', error);
      }
    }
  }, []);

  // Handle pointer down (start drawing)
  const handlePointerDown = useCallback(() => {
    setIsDrawing(true);
    drawingRef.current = true;
    lastUpdateTime.current = Date.now();

    // Start continuous preview updates
    if (animationFrameId.current === null) {
      animationFrameId.current = requestAnimationFrame(updatePreviewContinuously);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle pointer up (end drawing)
  const handlePointerUp = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      drawingRef.current = false;

      // Stop continuous preview updates
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }

      // Delay final update with mask generation to improve responsiveness
      setTimeout(() => {
        setPathsChanged(true);
      }, MASK_UPDATE_DELAY);
    }
  }, [isDrawing]);

  // Handle pointer move
  const handlePointerMove = useCallback(() => {
    if (isDrawing && !animationFrameId.current) {
      // Restart animation frame if it got cancelled for some reason
      animationFrameId.current = requestAnimationFrame(updatePreviewContinuously);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawing]);

  // Handle stroke completion
  const handleStrokeEnd = useCallback(() => {
    setPathsChanged(true);
  }, []);

  // Track changes to the canvas paths
  const handleCanvasChange = useCallback((updatedPaths: any[]) => {
    setStrokes(updatedPaths);
  }, []);

  // Load initial strokes if provided
  useEffect(() => {
    if (initialStrokes && initialStrokes.length > 0 && canvasRef.current) {
      canvasRef.current.loadPaths(initialStrokes);
      setStrokes(initialStrokes);
      setPathsChanged(true);
    }
  }, [initialStrokes]);

  // Load background image
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        backgroundImgRef.current = img;
      };
    }
  }, [imageUrl]);

  // Update previews from maskImageUrl when it changes
  useEffect(() => {
    if (maskImageUrl) {
      setMaskDataUrl(maskImageUrl);
      setTransparentDoodleUrl(maskImageUrl);
    }
  }, [maskImageUrl]);

  // Update previews when paths change
  useEffect(() => {
    if (pathsChanged) {
      let isMounted = true;
      const updateCanvas = async () => {
        await updateStrokesFromCanvas();
        if (isMounted) {
          try {
            // Get transparent image directly from the canvas
            if (canvasRef.current) {
              const transparentImage = await canvasRef.current.exportImage('png');
              setTransparentDoodleUrl(transparentImage);
            }
            // Generate mask separately
            generateMaskFromCanvas();
          } catch (error) {
            console.error('Failed to update previews:', error);
          }
          setPathsChanged(false);
        }
      };
      updateCanvas();

      return () => {
        isMounted = false;
      };
    }
    // Remove the functions from dependencies to break circular dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathsChanged]);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Handle pen slider hover
  const handlePenSliderEnter = useCallback(() => {
    if (penSliderTimeoutRef.current) {
      clearTimeout(penSliderTimeoutRef.current);
      penSliderTimeoutRef.current = null;
    }
    setShowPenSlider(true);
  }, []);

  const handlePenSliderLeave = useCallback(() => {
    penSliderTimeoutRef.current = setTimeout(() => {
      setShowPenSlider(false);
    }, 300); // 300ms delay before hiding
  }, []);

  // Handle eraser slider hover
  const handleEraserSliderEnter = useCallback(() => {
    if (eraserSliderTimeoutRef.current) {
      clearTimeout(eraserSliderTimeoutRef.current);
      eraserSliderTimeoutRef.current = null;
    }
    setShowEraserSlider(true);
  }, []);

  const handleEraserSliderLeave = useCallback(() => {
    eraserSliderTimeoutRef.current = setTimeout(() => {
      setShowEraserSlider(false);
    }, 300); // 300ms delay before hiding
  }, []);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (penSliderTimeoutRef.current) {
        clearTimeout(penSliderTimeoutRef.current);
      }
      if (eraserSliderTimeoutRef.current) {
        clearTimeout(eraserSliderTimeoutRef.current);
      }
    };
  }, []);

  // Memoize toolbar buttons to prevent unnecessary re-renders
  const toolbarButtons = useMemo(
    () => (
      <div className="flex w-full gap-2 border-b border-gray-200 pb-2 mb-4 pl-11">
        <div className="relative flex flex-col" onMouseEnter={handlePenSliderEnter} onMouseLeave={handlePenSliderLeave}>
          <Button
            variant={!eraseMode ? 'default' : 'ghost'}
            size="sm"
            onClick={handlePenClick}
            className="flex flex-col items-center justify-center w-[70px] h-[70px]"
          >
            <PencilIcon className="w-5 h-5" />
            笔刷
          </Button>
          {showPenSlider && (
            <div
              className="absolute top-full left-[-50%] mt-2 p-3 bg-white shadow-lg rounded-md z-10 w-[140px]"
              onMouseEnter={handlePenSliderEnter}
              onMouseLeave={handlePenSliderLeave}
            >
              <Slider
                defaultValue={[strokeWidth]}
                value={[strokeWidth]}
                onValueChange={handleStrokeWidthChange}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          )}
        </div>

        <div
          className="relative flex flex-col"
          onMouseEnter={handleEraserSliderEnter}
          onMouseLeave={handleEraserSliderLeave}
        >
          <Button
            variant={eraseMode ? 'default' : 'ghost'}
            size="sm"
            onClick={handleEraserClick}
            className="flex flex-col items-center justify-center w-[70px] h-[70px]"
          >
            <EraserIcon className="w-5 h-5" />
            橡皮
          </Button>
          {showEraserSlider && (
            <div
              className="absolute top-full left-[-50%] mt-2 p-3 bg-white shadow-lg rounded-md z-10 w-[140px]"
              onMouseEnter={handleEraserSliderEnter}
              onMouseLeave={handleEraserSliderLeave}
            >
              <Slider
                defaultValue={[eraserWidth]}
                value={[eraserWidth]}
                onValueChange={handleEraserWidthChange}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleUndo}
          className="flex flex-col  items-center justify-center w-[70px] h-[70px]"
        >
          <UndoIcon className="w-5 h-5" />
          撤销
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRedo}
          className="flex flex-col items-center justify-center w-[70px] h-[70px]"
        >
          <RedoIcon className="w-5 h-5" />
          重做
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="flex flex-col items-center justify-center w-[70px] h-[70px]"
          title="Reset Canvas (Clear Undo History)"
        >
          <TrashIcon className="w-5 h-5" />
          清除
        </Button>
      </div>
    ),
    [
      eraseMode,
      handleEraserClick,
      handlePenClick,
      handleRedo,
      handleReset,
      handleUndo,
      showPenSlider,
      showEraserSlider,
      strokeWidth,
      eraserWidth,
      handleStrokeWidthChange,
      handleEraserWidthChange
    ]
  );

  return (
    <>
      <div className="flex justify-between items-center w-full mb-2">
        <h2 className="text-xl font-bold">选择修改的区域 *</h2>
      </div>
      {toolbarButtons}

      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Main editing area */}
        <div className="flex-1 flex items-center justify-between gap-4">
          <div className="flex-1 flex  items-center justify-center">
            <div
              style={{ position: 'relative', width: 360, height: 480 }}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerUp} // Also handle when pointer leaves the area
            >
              {/* Background image */}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Background"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    zIndex: 0
                  }}
                />
              )}
              {/* Drawing canvas */}
              <ReactSketchCanvas
                ref={canvasRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 1
                }}
                strokeWidth={eraseMode ? eraserWidth : strokeWidth}
                eraserWidth={eraserWidth}
                strokeColor={color}
                canvasColor="transparent"
                backgroundImage=""
                exportWithBackgroundImage={false}
                onStroke={handleStrokeEnd}
                onChange={handleCanvasChange}
              />
            </div>
          </div>

          <div className="flex-1 relative flex  items-center justify-center">
            {/* Transparent doodle preview */}
            <div className="relative border rounded shadow overflow-hidden" style={{ width: 360, height: 480 }}>
              {/* Checkerboard background to show transparency */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              />

              {/* Real-time transparent doodle */}
              {transparentDoodleUrl && (
                <img
                  src={transparentDoodleUrl}
                  alt="Doodle Preview"
                  className="absolute inset-0 z-10"
                  style={{ objectFit: 'contain' }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <div
          className="w-[150px] h-[40px] bg-[#ff7315] cursor-pointer text-white rounded-md flex items-center justify-center"
          onClick={handleSave}
        >
          确认
        </div>
      </div>

      {/* Hidden canvas for generating mask image */}
      <canvas ref={maskCanvasRef} width={360} height={480} className="hidden" />
    </>
  );
}
