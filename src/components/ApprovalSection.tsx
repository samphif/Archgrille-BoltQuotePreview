import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { DropboxSignature } from './DropboxSignature';

interface ApprovalSectionProps {
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
  onQuoteAccepted: () => void;
  commentsSubmitted?: boolean;
}

export const ApprovalSection: React.FC<ApprovalSectionProps> = ({ quoteData, onQuoteAccepted, commentsSubmitted }) => {
  const [isSigned, setIsSigned] = useState(false);
  const [signedDate, setSignedDate] = useState<Date | null>(null);

  const handleSignatureComplete = () => {
    setIsSigned(true);
    setSignedDate(new Date());
    onQuoteAccepted();
  };

  if (isSigned) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-900 mb-2">Quote Accepted!</h3>
          <p className="text-green-700 mb-4">
            Thank you for accepting this quote. Your order has been submitted and our team will be in touch shortly.
          </p>
          {signedDate && (
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 inline-block">
              <strong>Signed on:</strong> {signedDate.toLocaleDateString()} at {signedDate.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (commentsSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Comments Submitted!</h3>
          <p className="text-blue-700 mb-4">
            Thank you for your feedback. Your comments have been submitted and our team will review them. 
            You will receive an updated quote shortly.
          </p>
          <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 inline-block">
            <strong>Note:</strong> Quote signature is no longer available since comments have been submitted.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">3. Approval</h2>
      
      <DropboxSignature 
        quoteData={quoteData}
        onSignatureComplete={handleSignatureComplete}
      />
    </div>
  );
};