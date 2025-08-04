import React, { useState, useRef, useEffect } from 'react';
import { X, Check, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperProps {
  imageFile: File;
  onCrop: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ImageCropper({ imageFile, onCrop, onCancel }: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cropArea, setCropArea] = useState<CropArea>({ x: 50, y: 50, width: 200, height: 200 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImage(img);
      // Center the image and set initial crop area
      const canvas = canvasRef.current;
      if (canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        const imageAspect = img.width / img.height;
        const canvasAspect = canvasRect.width / canvasRect.height;
        
        let displayWidth = canvasRect.width;
        let displayHeight = canvasRect.height;
        
        if (imageAspect > canvasAspect) {
          displayHeight = displayWidth / imageAspect;
        } else {
          displayWidth = displayHeight * imageAspect;
        }
        
        setImagePosition({
          x: (canvasRect.width - displayWidth) / 2,
          y: (canvasRect.height - displayHeight) / 2
        });
        
        setCropArea({
          x: (canvasRect.width - 200) / 2,
          y: (canvasRect.height - 200) / 2,
          width: 200,
          height: 200
        });
      }
    };
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    drawCanvas();
  }, [image, cropArea, scale, rotation, imagePosition]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !image) return;

    // Set canvas size to match its display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate image dimensions to fit canvas while maintaining aspect ratio
    const imageAspect = image.width / image.height;
    const canvasAspect = canvas.width / canvas.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;

    if (imageAspect > canvasAspect) {
      drawHeight = canvas.width / imageAspect;
    } else {
      drawWidth = canvas.height * imageAspect;
    }

    // Apply scale
    drawWidth *= scale;
    drawHeight *= scale;

    // Center the image
    const x = (canvas.width - drawWidth) / 2 + imagePosition.x;
    const y = (canvas.height - drawHeight) / 2 + imagePosition.y;

    // Save context for transformations
    ctx.save();

    // Apply rotation around the center
    ctx.translate(x + drawWidth / 2, y + drawHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-drawWidth / 2, -drawHeight / 2);

    // Draw image
    ctx.drawImage(image, 0, 0, drawWidth, drawHeight);
    ctx.restore();

    // Draw crop overlay (dark area outside crop)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area (make it transparent)
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';

    // Draw crop border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

    // Draw corner handles
    const handleSize = 8;
    ctx.fillStyle = '#3b82f6';
    // Top-left
    ctx.fillRect(cropArea.x - handleSize/2, cropArea.y - handleSize/2, handleSize, handleSize);
    // Top-right
    ctx.fillRect(cropArea.x + cropArea.width - handleSize/2, cropArea.y - handleSize/2, handleSize, handleSize);
    // Bottom-left
    ctx.fillRect(cropArea.x - handleSize/2, cropArea.y + cropArea.height - handleSize/2, handleSize, handleSize);
    // Bottom-right
    ctx.fillRect(cropArea.x + cropArea.width - handleSize/2, cropArea.y + cropArea.height - handleSize/2, handleSize, handleSize);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is inside crop area
    if (x >= cropArea.x && x <= cropArea.x + cropArea.width &&
        y >= cropArea.y && y <= cropArea.y + cropArea.height) {
      setIsDragging(true);
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newX = Math.max(0, Math.min(x - dragStart.x, canvas.width - cropArea.width));
    const newY = Math.max(0, Math.min(y - dragStart.y, canvas.height - cropArea.height));
    
    setCropArea(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    // Create a new canvas for the cropped image
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
    if (!croppedCtx) return;

    croppedCanvas.width = cropArea.width;
    croppedCanvas.height = cropArea.height;

    // Calculate the source coordinates on the original image
    const scaleFactorX = image.width / (canvas.width * scale);
    const scaleFactorY = image.height / (canvas.height * scale);
    
    const sourceX = (cropArea.x - imagePosition.x) * scaleFactorX;
    const sourceY = (cropArea.y - imagePosition.y) * scaleFactorY;
    const sourceWidth = cropArea.width * scaleFactorX;
    const sourceHeight = cropArea.height * scaleFactorY;

    // Draw the cropped portion
    croppedCtx.drawImage(
      image,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, cropArea.width, cropArea.height
    );

    // Convert to blob
    croppedCanvas.toBlob((blob) => {
      if (blob) {
        onCrop(blob);
      }
    }, 'image/jpeg', 0.9);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-neutral-900">قص الصورة</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative mb-4">
          <canvas
            ref={canvasRef}
            className="w-full h-96 border border-neutral-200 rounded-lg cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              title="تصغير"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-neutral-600">{Math.round(scale * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              title="تكبير"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleRotate}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors mr-2"
              title="تدوير"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleCrop}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              قص وإرسال
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
