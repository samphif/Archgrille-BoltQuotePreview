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
      <div className="bg-white shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Quote Accepted!</h3>
          <p className="text-gray-700 mb-4">
            Thank you for accepting this quote. Your order has been submitted and our team will be in touch shortly.
          </p>
          {signedDate && (
            <div className="text-sm text-gray-600 bg-archgrille-secondary p-3 inline-block">
              <strong>Signed on:</strong> {signedDate.toLocaleDateString()} at {signedDate.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (commentsSubmitted) {
    return (
      <div className="bg-white shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Comments Submitted!</h3>
          <p className="text-gray-700 mb-4">
            Thank you for your feedback. Your comments have been submitted and our team will review them. 
            You will receive an updated quote shortly.
          </p>
          <div className="text-sm text-gray-600 bg-archgrille-secondary p-3 inline-block">
            <strong>Note:</strong> Quote signature is no longer available since comments have been submitted.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DropboxSignature 
        quoteData={quoteData}
        onSignatureComplete={handleSignatureComplete}
      />
    </div>
  );
};