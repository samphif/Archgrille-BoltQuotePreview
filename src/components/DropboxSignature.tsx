import React, { useState } from 'react';
import { PenTool, CheckCircle, Download, Share2, FileText } from 'lucide-react';
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
}

export const DropboxSignature: React.FC<DropboxSignatureProps> = ({
  quoteData,
  onSignatureComplete
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [signatureData, setSignatureData] = useState<{
    data: string;
    type: 'draw' | 'type';
    timestamp: Date;
  } | null>(null);

  const handleStartSignature = () => {
    if (agreementAccepted) {
      setIsModalOpen(true);
    }
  };

  const handleSignatureConfirm = (data: string, type: 'draw' | 'type') => {
    setSignatureData({
      data,
      type,
      timestamp: new Date()
    });
    setIsModalOpen(false);
    setShowSuccess(true);

    setTimeout(() => {
      onSignatureComplete();
    }, 2000);
  };

  if (showSuccess && signatureData) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 text-center shadow-lg">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-green-900 mb-2">
            Document Successfully Signed!
          </h3>

          <p className="text-green-700 mb-4">
            Your digital signature has been applied and the document is now complete.
          </p>

          <div className="bg-white border border-green-200 rounded-lg p-4 mb-6 inline-block">
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

          <div className="border-t border-green-200 pt-6 mt-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
                <Download className="h-4 w-4 mr-2" />
                Download Signed Document
              </button>
              <button className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                <Share2 className="h-4 w-4 mr-2" />
                Share Document
              </button>
              <button className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                <FileText className="h-4 w-4 mr-2" />
                View Details
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Signature Preview</h4>
          <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
            {signatureData.type === 'draw' ? (
              <img
                src={signatureData.data}
                alt="Signature"
                className="max-h-32 mx-auto"
              />
            ) : (
              <p
                className="text-3xl text-center text-gray-900"
                style={{ fontFamily: 'Brush Script MT, cursive' }}
              >
                {signatureData.data}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-600">To accept this quote, you'll need to review the terms and provide your digital signature:</p>

      <div className="space-y-4">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
          <h3 className="font-semibold text-amber-900 mb-3 text-lg">Terms and Conditions</h3>
          <div className="text-sm text-gray-800 space-y-3 max-h-64 overflow-y-auto pr-2">
            <p>
              The above quote technical specifications on my quote and disclaimer have been reviewed. This quote is approved to move forward with fabrication. Custom-made orders are not eligible for return. Please review your specifications for accuracy before approving for fabrication. If shop drawings apply, fabrication will not start until said drawings are returned to Architectural Grille signed and approved.
            </p>
            <p>
              Updated pricing will be provided based on any revision requests received.
            </p>
            <p>
              Prices are based on quantities and specifications provided and are valid for 30 days.
            </p>
            <p>
              If your quote has expired, please check to ensure pricing has not changed due to unforeseen cost increases ie: cost of raw materials. To secure pricing on this quote for a project that starts past 30 days please sign and return the quote along with your 1/3rd deposit. We will place the order on hold for you until you are ready to release the order. Terms are 1/3rd deposit balance upon completion.
            </p>
            <p className="font-medium text-gray-900 pt-2 border-t border-amber-200">
              By signing below or clicking, Client acknowledges, represents and warrants that it has read and agrees to the terms and conditions/technical considerations in the following documents, which are incorporated herein by reference in the PDF Version of the proposal above.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreementAccepted}
              onChange={(e) => setAgreementAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="text-sm text-gray-700">
              <span className="font-medium">I have read, understood, and agree to the Terms and Conditions stated above. I acknowledge that custom-made orders are not eligible for return.</span>
            </div>
          </label>
        </div>

        <button
          onClick={handleStartSignature}
          disabled={!agreementAccepted}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 shadow-sm"
        >
          <PenTool className="h-5 w-5" />
          <span>Start Digital Signature Process</span>
        </button>

        {!agreementAccepted && (
          <p className="text-xs text-gray-500 text-center">
            Please read and accept the terms and conditions above to continue
          </p>
        )}
      </div>

      <SignatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSignatureConfirm}
        customerName={quoteData.customer.name}
      />
    </div>
  );
};
