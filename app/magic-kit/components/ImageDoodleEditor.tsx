'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ReactSketchCanvas, type ReactSketchCanvasRef } from 'react-sketch-canvas';
import { PencilIcon, EraserIcon, TrashIcon, UndoIcon, RedoIcon, SaveIcon } from 'lucide-react';
import { uploadImage } from '@/lib/api/common';

interface ImageDoodleEditorProps {
  imageUrl: string;
  maskImageUrl?: string;
  onSave?: (doodleDataUrl: string, strokes: any[], uploadedMaskUrl?: string) => void;
  initialStrokes?: any[];
  width?: number;
  height?: number;
}

export default function ImageDoodleEditor({
  imageUrl,
  maskImageUrl,
  onSave,
  initialStrokes = [],
  width = 360,
  height = 480
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
  const [originalImageSize, setOriginalImageSize] = useState<{ width: number; height: number } | null>(null);

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

  // 追踪图片的实际渲染尺寸和位置
  const [imageRenderRect, setImageRenderRect] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  // 计算适合显示的容器尺寸
  const getContainerDimensions = useCallback(() => {
    // 默认尺寸
    let containerWidth = width;
    let containerHeight = height;

    // 如果有原始图像尺寸信息，则根据原始图像比例设置容器尺寸
    if (originalImageSize) {
      const imgRatio = originalImageSize.width / originalImageSize.height;

      // 保持容器总面积大致相同，但比例与图片一致
      // 这样可以确保无论图片是横向还是纵向，显示区域都是合适的
      const targetArea = width * height; // 原始容器面积

      // 根据图片比例计算新尺寸
      containerHeight = Math.sqrt(targetArea / imgRatio);
      containerWidth = containerHeight * imgRatio;

      // 限制最大尺寸，避免超出屏幕
      if (containerWidth > width * 1.5) {
        containerWidth = width;
        containerHeight = width / imgRatio;
      }

      if (containerHeight > height * 1.5) {
        containerHeight = height;
        containerWidth = height * imgRatio;
      }
    }

    return { containerWidth, containerHeight };
  }, [width, height, originalImageSize]);

  // 获取当前容器尺寸
  const { containerWidth, containerHeight } = getContainerDimensions();

  // 图片加载后计算其实际渲染尺寸和位置
  const updateImageRenderRect = useCallback(() => {
    if (backgroundImgRef.current) {
      const img = backgroundImgRef.current;

      // 使用图片的真实尺寸，而不是默认的width和height
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      // 使用根据图片比例计算的容器尺寸
      const maxDisplayWidth = containerWidth;
      const maxDisplayHeight = containerHeight;

      // 计算图片保持比例适应容器的尺寸
      const imgRatio = imgWidth / imgHeight;
      const containerRatio = maxDisplayWidth / maxDisplayHeight;

      let renderWidth: number;
      let renderHeight: number;
      let x: number;
      let y: number;

      if (imgRatio > containerRatio) {
        // 图片更宽，按宽度适应
        renderWidth = maxDisplayWidth;
        renderHeight = maxDisplayWidth / imgRatio;
        x = 0;
        y = (maxDisplayHeight - renderHeight) / 2;
      } else {
        // 图片更高，按高度适应
        renderHeight = maxDisplayHeight;
        renderWidth = maxDisplayHeight * imgRatio;
        x = (maxDisplayWidth - renderWidth) / 2;
        y = 0;
      }

      setImageRenderRect({
        x,
        y,
        width: renderWidth,
        height: renderHeight
      });
    }
  }, [containerWidth, containerHeight]);

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
  const handleSave = useCallback(async () => {
    if (maskDataUrl && onSave) {
      try {
        // 创建新Image对象来加载mask数据
        const img = new Image();
        // Add crossOrigin attribute to prevent canvas tainting
        img.crossOrigin = 'anonymous';
        img.onload = async () => {
          // 使用原始图像尺寸
          const actualWidth = originalImageSize?.width || width;
          const actualHeight = originalImageSize?.height || height;

          // 创建临时canvas进行压缩
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = actualWidth;
          tempCanvas.height = actualHeight;
          const ctx = tempCanvas.getContext('2d');

          if (ctx) {
            // 绘制图像到临时canvas，保持原始比例
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, actualWidth, actualHeight);

            // 绘制时保持原图比例
            ctx.drawImage(img, 0, 0, actualWidth, actualHeight);

            try {
              // 尝试使用较低质量导出以减小文件大小
              // 黑白图像使用较低质量也能保持清晰度
              let quality = 0.8;
              let compressedDataUrl = tempCanvas.toDataURL('image/png', quality);

              // 估算大小 (dataUrl长度大致可以估计文件大小)
              const estimatedSize = compressedDataUrl.length * 0.75; // 转换base64到字节大小

              // 如果估计大小超过9MB (留1MB的安全边界)，进一步压缩
              if (estimatedSize > 9 * 1024 * 1024) {
                // 对于非常大的图像，考虑降低尺寸
                const scaleFactor = Math.sqrt((9 * 1024 * 1024) / estimatedSize);
                const scaledWidth = Math.floor(actualWidth * scaleFactor);
                const scaledHeight = Math.floor(actualHeight * scaleFactor);

                // 重新创建最终尺寸的canvas
                tempCanvas.width = scaledWidth;
                tempCanvas.height = scaledHeight;

                // 重新绘制并压缩
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, scaledWidth, scaledHeight);
                ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

                // 尝试进一步降低质量
                quality = 0.7;
                compressedDataUrl = tempCanvas.toDataURL('image/png', quality);

                console.log(
                  `Mask image resized from ${actualWidth}x${actualHeight} to ${scaledWidth}x${scaledHeight} to stay under 10MB limit`
                );
              }

              // 将 dataURL 转换为 Blob/File 对象以便上传
              const byteString = atob(compressedDataUrl.split(',')[1]);
              const mimeType = compressedDataUrl.split(',')[0].split(':')[1].split(';')[0];
              const ab = new ArrayBuffer(byteString.length);
              const ia = new Uint8Array(ab);

              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
              }

              const blob = new Blob([ab], { type: mimeType });
              const maskFile = new File([blob], 'mask.png', { type: mimeType });

              try {
                // 上传遮罩图片到服务器
                const uploadedMaskUrl = await uploadImage(maskFile);

                // 调用onSave回调，传入压缩后的数据URL、笔画数据和上传后的URL
                onSave(compressedDataUrl, strokes, uploadedMaskUrl);
              } catch (error) {
                console.error('Failed to upload mask image:', error);
                // 如果上传失败，仍然使用本地数据URL
                onSave(compressedDataUrl, strokes);
              }
            } catch (error) {
              console.error('Canvas tainted error:', error);
              // 当canvas被污染时，我们仍然可以使用原始maskDataUrl
              onSave(maskDataUrl, strokes);
            }
          } else {
            // 如果无法获取context，则使用原始数据
            onSave(maskDataUrl, strokes);
          }
        };
        img.onerror = () => {
          console.error('Error loading mask image');
          // 出错时使用原始数据
          onSave(maskDataUrl, strokes);
        };
        img.src = maskDataUrl;
      } catch (error) {
        console.error('Error processing mask image:', error);
        // 出错时也尝试使用原始数据
        onSave(maskDataUrl, strokes);
      }
    } else if (onSave) {
      // 即使没有涂鸦，也要调用onSave
      // 创建一个全黑的mask（表示没有区域需要编辑）
      const tempCanvas = document.createElement('canvas');
      const actualWidth = originalImageSize?.width || width;
      const actualHeight = originalImageSize?.height || height;
      tempCanvas.width = actualWidth;
      tempCanvas.height = actualHeight;

      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        // 全黑背景表示不编辑任何区域
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, actualWidth, actualHeight);
        const blackDataUrl = tempCanvas.toDataURL('image/png');

        // 调用onSave回调，传入全黑图像和空笔画数据
        onSave(blackDataUrl, strokes);
      } else {
        // 即使无法创建canvas，也应该调用onSave以关闭窗口
        onSave('', strokes);
      }
    }
  }, [maskDataUrl, onSave, strokes, width, height, originalImageSize]);

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
        // 直接使用导出的图像进行预览
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
    if (!maskCanvasRef.current || !originalImageSize) return;

    const canvas = maskCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 获取实际尺寸 - 使用原始图像尺寸
    const actualWidth = originalImageSize.width;
    const actualHeight = originalImageSize.height;

    // 确保canvas尺寸与原始图像一致
    canvas.width = actualWidth;
    canvas.height = actualHeight;

    // Clear canvas and set black background (inverting the colors)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (canvasRef.current) {
      try {
        // Get the image from the canvas
        const imageData = await canvasRef.current.exportImage('png');

        // Create a temporary image to draw on the mask canvas
        const img = new Image();
        // Add crossOrigin attribute to prevent canvas tainting
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          // 创建两个临时canvas:
          // 1. 用于处理原始绘画
          const tempDrawingCanvas = document.createElement('canvas');
          tempDrawingCanvas.width = containerWidth;
          tempDrawingCanvas.height = containerHeight;
          const tempDrawingCtx = tempDrawingCanvas.getContext('2d');

          // 2. 用于生成最终黑白mask
          const tempMaskCanvas = document.createElement('canvas');
          tempMaskCanvas.width = actualWidth;
          tempMaskCanvas.height = actualHeight;
          const tempMaskCtx = tempMaskCanvas.getContext('2d');

          if (tempDrawingCtx && tempMaskCtx) {
            // 步骤1: 绘制原始绘画到临时画布
            tempDrawingCtx.drawImage(img, 0, 0, containerWidth, containerHeight);

            // 记录调试信息
            console.log('Canvas尺寸:', containerWidth, 'x', containerHeight);
            console.log('图片渲染区域:', imageRenderRect);
            console.log('原始图像尺寸:', actualWidth, 'x', actualHeight);

            // 步骤2: 计算正确的映射
            // 确保图片渲染区域有效
            if (imageRenderRect.width <= 0 || imageRenderRect.height <= 0) {
              console.error('图片渲染区域无效');
              return;
            }

            // 修复绘画区域到原始图像的映射
            tempMaskCtx.drawImage(
              tempDrawingCanvas,
              imageRenderRect.x,
              imageRenderRect.y, // 源起点 - 绘画容器中图片的位置
              imageRenderRect.width,
              imageRenderRect.height, // 源尺寸 - 绘画容器中图片的尺寸
              0,
              0, // 目标起点 - 从mask的左上角开始
              actualWidth,
              actualHeight // 目标尺寸 - 缩放到原始图片尺寸
            );

            // 步骤3: 获取图像数据并转换为黑白
            const imgData = tempMaskCtx.getImageData(0, 0, actualWidth, actualHeight);
            const data = imgData.data;

            // Convert to black and white mask with inverted colors
            // (any non-transparent pixel becomes white - regions to edit)
            for (let i = 0; i < data.length; i += 4) {
              // If pixel has any opacity (alpha > 0)
              if (data[i + 3] > 0) {
                // Set it to white (regions to edit)
                data[i] = 255; // R
                data[i + 1] = 255; // G
                data[i + 2] = 255; // B
                data[i + 3] = 255; // A
              } else {
                // Keep transparent pixels as black (background - not to edit)
                data[i] = 0; // R
                data[i + 1] = 0; // G
                data[i + 2] = 0; // B
                data[i + 3] = 255; // A (fully opaque)
              }
            }

            // 步骤4: 将处理后的数据回写到临时canvas
            tempMaskCtx.putImageData(imgData, 0, 0);

            // 步骤5: 将临时canvas绘制到最终mask canvas
            ctx.drawImage(tempMaskCanvas, 0, 0);

            try {
              // 步骤6: 保存mask图像数据
              setMaskDataUrl(canvas.toDataURL('image/png'));
            } catch (error) {
              console.error('Canvas tainted error in mask generation:', error);
              // Fallback to just saving the strokes data without a mask image
              // This will ensure we at least have the drawing paths saved
              updateStrokesFromCanvas();
            }
          }
        };
        img.onerror = e => {
          console.error('Error loading canvas image:', e);
        };
        img.src = imageData;
      } catch (error) {
        console.error('Failed to generate mask:', error);
      }
    }
  }, [originalImageSize, containerWidth, containerHeight, imageRenderRect, updateStrokesFromCanvas]);

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
      // Add crossOrigin attribute to prevent canvas tainting
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      img.onload = () => {
        backgroundImgRef.current = img;

        // 保存原始图像尺寸以便后续处理
        setOriginalImageSize({
          width: img.naturalWidth,
          height: img.naturalHeight
        });

        // 计算图片的渲染尺寸和位置
        updateImageRenderRect();
      };
      img.onerror = e => {
        console.error('Error loading image:', e);
      };
    }
  }, [imageUrl, updateImageRenderRect]);

  // 使用原始图像尺寸创建适当大小的mask
  useEffect(() => {
    // 确保maskCanvasRef已创建
    if (maskCanvasRef.current && originalImageSize) {
      const canvas = maskCanvasRef.current;

      // 调整隐藏canvas的尺寸以匹配原始图像
      canvas.width = originalImageSize.width;
      canvas.height = originalImageSize.height;
    }
  }, [originalImageSize]);

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
      handleEraserWidthChange,
      handlePenSliderEnter,
      handlePenSliderLeave,
      handleEraserSliderEnter,
      handleEraserSliderLeave
    ]
  );

  // 窗口调整或容器尺寸变化时重新计算
  useEffect(() => {
    updateImageRenderRect();
  }, [containerWidth, containerHeight, updateImageRenderRect]);

  // 处理指针事件，确保绘画仅在图片区域内有效
  const handlePointerEvent = useCallback(
    (event: React.PointerEvent, eventType: 'down' | 'move' | 'up' | 'leave') => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // 判断指针是否在图片区域内
      const isInImageArea =
        x >= imageRenderRect.x &&
        x <= imageRenderRect.x + imageRenderRect.width &&
        y >= imageRenderRect.y &&
        y <= imageRenderRect.y + imageRenderRect.height;

      // 只有在图片区域内才处理绘画事件
      if (isInImageArea || eventType === 'up' || eventType === 'leave') {
        switch (eventType) {
          case 'down':
            handlePointerDown();
            break;
          case 'move':
            handlePointerMove();
            break;
          case 'up':
          case 'leave':
            handlePointerUp();
            break;
        }
      }
    },
    [handlePointerDown, handlePointerMove, handlePointerUp, imageRenderRect]
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
          <div className="flex-1 flex items-center justify-center">
            {/* 使用根据图片比例计算的容器尺寸 */}
            <div
              className="relative"
              style={{ width: containerWidth, height: containerHeight }}
              onPointerDown={e => handlePointerEvent(e, 'down')}
              onPointerUp={e => handlePointerEvent(e, 'up')}
              onPointerMove={e => handlePointerEvent(e, 'move')}
              onPointerLeave={e => handlePointerEvent(e, 'leave')}
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
              {/* 添加一个视觉提示，显示可绘画区域 */}
              <div
                style={{
                  position: 'absolute',
                  top: imageRenderRect.y,
                  left: imageRenderRect.x,
                  width: imageRenderRect.width,
                  height: imageRenderRect.height,
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />
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

          <div className="flex-1 relative flex items-center justify-center">
            {/* Transparent doodle preview */}
            <div
              className="relative border rounded shadow overflow-hidden"
              style={{ width: containerWidth, height: containerHeight }}
            >
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

              {/* 显示对应于预览的可编辑区域提示 */}
              <div
                style={{
                  position: 'absolute',
                  top: imageRenderRect.y,
                  left: imageRenderRect.x,
                  width: imageRenderRect.width,
                  height: imageRenderRect.height,
                  zIndex: 15,
                  pointerEvents: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <div
          className="w-[150px] h-[40px] bg-[#ff7315] cursor-pointer text-white rounded-md flex items-center justify-center"
          onClick={handleSave}
        >
          Confirm
        </div>
      </div>

      {/* Hidden canvas for generating mask image */}
      <canvas
        ref={maskCanvasRef}
        width={originalImageSize?.width || containerWidth}
        height={originalImageSize?.height || containerHeight}
        className="hidden"
      />
    </>
  );
}
