import React, { useRef, useState, useEffect } from 'react';
import { X, Trash2, Type, PenTool, Check } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (signatureData: string, signatureType: 'draw' | 'type') => void;
  customerName: string;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customerName
}) => {
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current && signatureMode === 'draw') {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = '#000000';
        context.lineWidth = 2;
        setCtx(context);
      }
    }
  }, [signatureMode, isOpen]);

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in event) {
      return {
        x: (event.touches[0].clientX - rect.left) * scaleX,
        y: (event.touches[0].clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
      };
    }
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    if (!ctx) return;
    event.preventDefault();
    setIsDrawing(true);
    setHasSignature(true);
    const { x, y } = getCoordinates(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctx) return;
    event.preventDefault();
    const { x, y } = getCoordinates(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setHasSignature(false);
    }
  };

  const handleClear = () => {
    if (signatureMode === 'draw') {
      clearCanvas();
    } else {
      setTypedSignature('');
      setHasSignature(false);
    }
  };

  const handleModeSwitch = (mode: 'draw' | 'type') => {
    setSignatureMode(mode);
    setHasSignature(false);
    setTypedSignature('');
    if (mode === 'draw' && ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleTypedSignatureChange = (value: string) => {
    setTypedSignature(value);
    setHasSignature(value.trim().length > 0);
  };

  const handleConfirm = () => {
    if (!hasSignature) return;

    if (signatureMode === 'draw' && canvasRef.current) {
      const signatureData = canvasRef.current.toDataURL('image/png');
      onConfirm(signatureData, 'draw');
    } else if (signatureMode === 'type' && typedSignature.trim()) {
      onConfirm(typedSignature.trim(), 'type');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Sign Document</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-archgrille-secondary border border-gray-200 p-4">
            <p className="text-sm text-gray-900">
              <span className="font-medium">Signing as:</span> {customerName}
            </p>
          </div>

          <div className="flex space-x-2 border-b">
            <button
              onClick={() => handleModeSwitch('draw')}
              className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                signatureMode === 'draw'
                  ? 'border-archgrille-primary text-archgrille-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <PenTool className="h-4 w-4" />
              <span>Draw</span>
            </button>
            <button
              onClick={() => handleModeSwitch('type')}
              className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                signatureMode === 'type'
                  ? 'border-archgrille-primary text-archgrille-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Type className="h-4 w-4" />
              <span>Type</span>
            </button>
          </div>

          <div className="space-y-4">
            {signatureMode === 'draw' ? (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Draw your signature below
                </label>
                <div className="border-2 border-gray-300 bg-white shadow-inner overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={300}
                    className="w-full touch-none cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Use your mouse or touch screen to draw your signature
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <label htmlFor="typed-signature" className="block text-sm font-medium text-gray-700">
                  Type your full name
                </label>
                <input
                  id="typed-signature"
                  type="text"
                  value={typedSignature}
                  onChange={(e) => handleTypedSignatureChange(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:ring-2 focus:ring-archgrille-primary focus:border-archgrille-primary text-lg"
                  autoFocus
                />
                {typedSignature && (
                  <div className="border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-white p-8 shadow-inner">
                    <p className="text-4xl text-center text-gray-900 font-cursive">
                      {typedSignature}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <button
              onClick={handleClear}
              disabled={!hasSignature}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear</span>
            </button>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!hasSignature}
                className="flex items-center space-x-2 px-6 py-2 bg-archgrille-primary text-white hover:bg-[#3a4556] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Check className="h-4 w-4" />
                <span>Confirm Signature</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
