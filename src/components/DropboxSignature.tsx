import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { PenTool, CheckCircle, Download, X, ArrowLeft, Type, Trash2 } from 'lucide-react';
import { SignatureModal } from './SignatureModal';

interface DropboxSignatureProps {
  quoteData: {
    quoteNumber: string;
    customer: {
      name: string;
      email: string;
    };
    financials: {
      grandTotal: number;
    };
  };
  onSignatureComplete: () => void;
  onBack: () => void;
}

export const DropboxSignature: React.FC<DropboxSignatureProps> = ({
  quoteData,
  onSignatureComplete,
  onBack
}) => {
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [signatureData, setSignatureData] = useState<{
    data: string;
    type: 'draw' | 'type';
    timestamp: Date;
  } | null>(null);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [techConsiderationsAccepted, setTechConsiderationsAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    
    // Check if user has scrolled to within 10px of the bottom
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setHasScrolledToBottom(true);
    }
  };

  const handleSignatureConfirm = (data: string, type: 'draw' | 'type') => {
    setSignatureData({
      data,
      type,
      timestamp: new Date()
    });
    setIsSignatureModalOpen(false);
    setShowSuccess(true);
    onSignatureComplete();
  };

  const handleInlineSignature = (data: string, type: 'draw' | 'type') => {
    if (data.trim().length === 0) {
      setSignatureData(null);
    } else {
      setSignatureData({
        data,
        type,
        timestamp: new Date()
      });
    }
  };

  const handleSubmitSignatureAndComments = async () => {
    if (!signatureData) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call to submit signature and comments
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccess(true);
      onSignatureComplete();
    } catch (error) {
      console.error('Failed to submit signature and comments:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    if (showSuccess) {
      setShowSuccess(false);
      setSignatureData(null);
      setHasScrolledToBottom(false);
    }
    onBack();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white w-full h-full max-w-4xl mx-auto flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCloseModal}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Go back to choices"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Review & Sign Document</h2>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close modal"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-hidden">
          {showSuccess && signatureData ? (
            /* Success State */
            <div className="h-full flex flex-col">
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="max-w-2xl mx-auto text-center">
                  <div className="bg-archgrille-secondary border-2 border-gray-200 p-8 shadow-lg">
                    <div className="flex justify-center mb-4">
                      <div className="bg-gray-200 rounded-full p-3">
                        <CheckCircle className="h-12 w-12 text-white" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Document Successfully Signed!
                    </h3>

                    <p className="text-gray-700 mb-4">
                      Your digital signature has been applied and the document is now complete.
                    </p>

                    <div className="bg-white border border-gray-200 p-4 mb-6 inline-block">
                      <div className="text-sm text-gray-600 mb-1">Signed by</div>
                      <div className="font-semibold text-gray-900 mb-1">{quoteData.customer.name}</div>
                      <div className="text-xs text-gray-500">
                        {signatureData.timestamp.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {' at '}
                        {signatureData.timestamp.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <div className="flex justify-center">
                        <button className="inline-flex items-center justify-center px-6 py-3 bg-archgrille-primary text-white hover:bg-[#3a4556] transition-colors font-medium shadow-sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Signed Document
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-white border border-gray-200 p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Signature Preview</h4>
                    <div className="border-2 border-gray-200 p-6 bg-gray-50">
                      {signatureData.type === 'draw' ? (
                        <img
                          src={signatureData.data}
                          alt="Signature"
                          className="max-h-32 mx-auto"
                        />
                      ) : (
                        <p className="text-3xl text-center text-gray-900 font-cursive">
                          {signatureData.data}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Review Content */
            <div className="h-full flex flex-col">
              <div 
                className="flex-1 overflow-y-auto p-6 space-y-8"
                onScroll={handleScroll}
              >
                {/* Technical Considerations */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Considerations</h3>
                  
                  <div className="space-y-4 text-sm text-gray-800">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Linear Bar Grille</h4>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Grilles are fabricated Height x Length which is "A" Dimension x "B" Dimensions.</li>
                        <li>Bar grilles will be fabricated based on the opening sizes provided. Please allow for a 1/16th or 1/8th clearance.</li>
                        <li>Loose core with tabs –The core and frame is not interchangeable including grilles that are the same size. Grilles will come with (1) tab screw installed if you would like all screws to be applied, please inform your estimator.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Perforated Grille</h4>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Perforated grilles are fabricated based on the overall - finished size including the borders.</li>
                        <li>Borders indicated on your quote may be adjusted depending upon the layout of the pattern. Borders will be as close to the specified dimension without going UNDER. If you require the exact border, you request inform your estimator as this will require a different process (Laser) and cost.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Grille location/ Mounting/installation</h4>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Please provide grille location and mounting method needed for each grille.</li>
                        <li>STOCK grilles will not include screw holes or mounting unless requested</li>
                        <li>Standard 1" screws will be provided for all orders requesting screw holes.</li>
                        <li>If access doors, beveled edges, bending, and /or miters are needed, please advise.</li>
                        <li>Floor Grilles - grilles specified for floor installation require additional metal subframe for support, including areas where minimal foot traffic occurs. Warranty is null for any grilles placed in flooring which do not have the required metal subframe.</li>
                        <li>If you would like your grilles to be tagged by room, please inform your estimator.</li>
                        <li>Additional cut sheets and mounting methods are located at https://www.archgrille.com/pages/downloads</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Finishing</h4>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Grilles are finished on the face only unless requested. This includes panels and cabinet infills. Bronze/Brass grilles will include a finished lacquer unless otherwise requested.</li>
                        <li>Anodizing is completed by an outside vendor with extended lead times ranging from 4-12 weeks. Architectural Grille offers an alternative option to powder coat to assist in decreasing lead time.</li>
                        <li>Powder Coat Colors – Architectural grille carries a powder coating line of RAL Tiger Drylac colors. If you are seeking a color match to an outside vendor i.e. Benjamin Moore, we offer a color chart for you to choose a match or we can send your color chip in for color matching. Please be advised that an additional setup fee/lead time may apply.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Shipping Considerations</h4>
                      <p className="text-xs">Any grilles over 98" will be broken down into sections to prevent any damages during the shipping process. If you need the grille to be fabricated as (1) continuous piece, we ask that you pick up the order or arrange for shipping accordingly. Crating fees may apply. Please note that the warranty/courtesy repair policy for damages that occur during shipping will not apply</p>
                    </div>

                    <div>
                      <p className="text-xs">Prices are based on quantities and specifications provided and are valid for 30 days. Updated pricing will be provided based on any revision requests received. All specifications are to be submitted in writing with your quote number for reference.</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Terms</h4>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>All orders Over $1000 require a 1/3rd deposit. Balance due upon completion prior to shipping (Term clientele excluded)</li>
                        <li>Changes to delivery method and/or address requested be subject to additional costs.</li>
                        <li>Change orders or cancellations may incur additional costs if fabrication has started.</li>
                        <li>Custom-made orders are not eligible for return</li>
                      </ul>
                    </div>

                    <p className="text-xs">The above quote technical specifications on my quote and disclaimer have been reviewed. This quote is approved to move forward with fabrication. If shop drawings apply, fabrication will not start until said drawings are returned to Architectural Grille signed and approved. Again, thank you for your interest in Architectural Grille, and feel free to contact me with any questions.</p>
                    
                    <p className="text-xs font-medium">PLEASE KEEP THIS QUOTE NUMBER ON ALL PURCHASE ORDER AND STATUS REQUEST EMAILS AS YOUR JOB REFERENCE</p>
                  </div>
                  
                  {/* Technical Considerations Checkbox */}
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-200">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={techConsiderationsAccepted}
                        onChange={(e) => setTechConsiderationsAccepted(e.target.checked)}
                        className="mt-1 h-4 w-4 text-archgrille-primary focus:ring-archgrille-primary border-gray-300 rounded accent-archgrille-primary"
                      />
                      <span className="text-sm text-gray-700">
                        I have read and agree to the Technical Considerations outlined above.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms and Conditions</h3>
                  <p className="text-sm text-gray-800">
                    Standard Terms: Payment terms require 1/3 deposit for orders over $1000, with balance due upon completion. Custom orders are non-refundable. Prices valid for 30 days. Changes to delivery address may incur additional fees. See full terms on our website or contact us for details.
                  </p>
                  
                  {/* Terms and Conditions Checkbox */}
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-200">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 h-4 w-4 text-archgrille-primary focus:ring-archgrille-primary border-gray-300 rounded accent-archgrille-primary"
                      />
                      <span className="text-sm text-gray-700">
                        I have read and agree to the Terms and Conditions outlined above.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Signature Section - always visible after scroll */}
                {hasScrolledToBottom && (
                  <div className="border-t border-gray-200 pt-8">
                    
                    {/* Validation Message - moved above signature block */}
                    {(!techConsiderationsAccepted || !termsAccepted) && (
                      <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                          <strong>Required:</strong> Please check both agreement boxes above to submit your signature.
                          {!techConsiderationsAccepted && <span className="block mt-1">• Technical Considerations agreement required</span>}
                          {!termsAccepted && <span className="block mt-1">• Terms and Conditions agreement required</span>}
                        </p>
                      </div>
                    )}

                    {/* Inline Signature Interface - with locked state */}
                    {!techConsiderationsAccepted || !termsAccepted ? (
                      <div className="space-y-3">
                        <div className="opacity-50 pointer-events-none">
                          <InlineSignatureInterface
                            onSignature={handleInlineSignature}
                            customerName={quoteData.customer.name}
                            disabled={true}
                          />
                        </div>
                      </div>
                    ) : (
                      <InlineSignatureInterface
                        onSignature={handleInlineSignature}
                        customerName={quoteData.customer.name}
                        disabled={false}
                      />
                    )}

                    {/* Comments Section */}
                    <div className="mt-8">
                      <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Add any additional comments or notes about this quote..."
                        className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-archgrille-primary focus:border-archgrille-primary resize-none"
                        rows={2}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                      <button
                        onClick={handleSubmitSignatureAndComments}
                        disabled={!signatureData || isSubmitting || !hasScrolledToBottom || !techConsiderationsAccepted || !termsAccepted}
                        className="w-full bg-archgrille-primary text-white py-3 px-6 font-semibold hover:bg-[#3a4556] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 shadow-sm"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5" />
                            <span>Submit Signature & Accept Quote</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {!hasScrolledToBottom && (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">
                      Please scroll down to review all terms and conditions before signing
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onConfirm={handleSignatureConfirm}
        customerName={quoteData.customer.name}
      />
    </div>,
    document.body
  );
};

// Inline Signature Interface Component
interface InlineSignatureInterfaceProps {
  onSignature: (data: string, type: 'draw' | 'type') => void;
  customerName: string;
  disabled: boolean;
}

const InlineSignatureInterface: React.FC<InlineSignatureInterfaceProps> = ({
  onSignature,
  customerName,
  disabled
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
  }, [signatureMode]);

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
    onSignature('', signatureMode);
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
    if (value.trim().length > 0) {
      onSignature(value.trim(), 'type');
    }
  };

  const handleCanvasChange = () => {
    if (canvasRef.current && hasSignature) {
      const signatureData = canvasRef.current.toDataURL('image/png');
      onSignature(signatureData, 'draw');
    }
  };

  useEffect(() => {
    if (hasSignature && signatureMode === 'draw') {
      handleCanvasChange();
    }
  }, [hasSignature, signatureMode]);

  return (
    <div className="space-y-4">
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
        <button
          onClick={handleClear}
          disabled={!hasSignature}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear</span>
        </button>
        <div className="flex items-center ml-auto text-sm text-gray-500">
          Signing as: <span className="font-medium text-gray-700 ml-1">{customerName}</span>
        </div>
      </div>

      <div className="space-y-4">
        {signatureMode === 'draw' ? (
          <div className="space-y-3">
            <div className="border-2 border-gray-300 bg-white shadow-inner overflow-hidden">
              <canvas
                ref={canvasRef}
                width={800}
                height={200}
                className="w-full h-48 touch-none cursor-crosshair"
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
            />
            {typedSignature && (
              <div className="border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-white p-6 shadow-inner">
                <p className="text-3xl text-center text-gray-900 font-cursive">
                  {typedSignature}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
