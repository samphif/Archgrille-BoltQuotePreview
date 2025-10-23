import React from 'react';
import { MessageSquare, CheckCircle, Paperclip, X, Edit3, PenTool } from 'lucide-react';
import { DropboxSignature } from './DropboxSignature';

interface Step3ApprovalChoiceProps {
  comment: string;
  setComment: (comment: string) => void;
  lineComments: Array<{lineItemId: number; comment: string; timestamp: Date}>;
  attachedFiles: File[];
  fileError: string | null;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: (index: number) => void;
  formatFileSize: (bytes: number) => string;
  handleCommentSubmit: () => void;
  isSubmittingComment: boolean;
  commentSubmitted: boolean;
  isQuoteAccepted: boolean;
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
  quoteExpired: boolean;
  step3Choice: 'changes' | 'sign' | null;
  setStep3Choice: (choice: 'changes' | 'sign' | null) => void;
}

export const Step3ApprovalChoice: React.FC<Step3ApprovalChoiceProps> = ({
  comment,
  setComment,
  lineComments,
  attachedFiles,
  fileError,
  handleFileSelect,
  handleRemoveFile,
  formatFileSize,
  handleCommentSubmit,
  isSubmittingComment,
  commentSubmitted,
  isQuoteAccepted,
  quoteData,
  onQuoteAccepted,
  quoteExpired,
  step3Choice,
  setStep3Choice
}) => {

  // Show expired message if quote is expired
  if (quoteExpired) {
    return (
      <div className="bg-white shadow-sm border p-6 sticky top-8">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">3. Next Steps</h3>
        </div>
        <div className="text-center py-8">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⏰</span>
          </div>
          <h3 className="text-xl font-semibold text-red-900 mb-2">Quote Expired</h3>
          <p className="text-red-700 mb-4">
            This quote is no longer valid. Please contact us for a new quote.
          </p>
          <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 inline-block">
            <strong>Quote expired:</strong> All actions are disabled
          </div>
        </div>
      </div>
    );
  }

  // Show success states
  if (isQuoteAccepted) {
    return (
      <div className="bg-white shadow-sm border p-6 sticky top-8">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">3. Next Steps</h3>
        </div>
        <div className="text-center py-8">
          <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Quote Accepted!</h3>
          <p className="text-gray-700 mb-4">
            Thank you for accepting this quote. Your order has been submitted and our team will be in touch shortly.
          </p>
          <div className="text-sm text-gray-600 bg-archgrille-secondary p-3 inline-block">
            <strong>Signed on:</strong> {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  }

  if (commentSubmitted) {
    return (
      <div className="bg-white shadow-sm border p-6 sticky top-8">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">3. Next Steps</h3>
        </div>
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

  // Show choice selection if no choice made yet
  if (!step3Choice) {
    return (
      <div className="bg-white shadow-sm border p-6 sticky top-8">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">3. Next Steps</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose one option below:
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <button
                onClick={() => setStep3Choice('changes')}
                className="w-full px-4 py-2 bg-archgrille-primary text-white hover:bg-[#3a4556] transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <Edit3 className="h-5 w-5 text-white" />
                  <div className="font-medium text-white">I Need Changes</div>
                </div>
              </button>
              <p className="text-sm text-gray-600 pl-8">Request modifications to the quote</p>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => setStep3Choice('sign')}
                className="w-full px-4 py-2 bg-archgrille-primary text-white hover:bg-[#3a4556] transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <PenTool className="h-5 w-5 text-white" />
                  <div className="font-medium text-white">No Changes - Ready to Sign</div>
                </div>
              </button>
              <p className="text-sm text-gray-600 pl-8">Accept the quote as-is</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show changes interface
  if (step3Choice === 'changes') {
    return (
      <div className="bg-white shadow-sm border p-6 sticky top-8">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">3. Next Steps</h3>
            <button
              onClick={() => setStep3Choice(null)}
              className="text-sm text-archgrille-primary hover:text-[#3a4556]"
            >
              ← Back
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Line Item Comments Summary */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Line Comments ({lineComments.length})</h4>
            {lineComments.length > 0 ? (
              <div className="space-y-2 max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-3">
                {lineComments.map((lineComment) => (
                  <div key={lineComment.lineItemId} className="text-xs">
                    <span className="font-medium text-gray-700">Line {lineComment.lineItemId}:</span> <span className="text-gray-600">{lineComment.comment}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                Use the <MessageSquare className="inline h-3 w-3" /> buttons in the table to the left to add comments to line items.
              </div>
            )}
          </div>

          {/* General Comments Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">General Comments</h4>
            <div>
              <textarea
                id="comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-archgrille-primary focus:border-archgrille-primary resize-none text-sm"
                placeholder="Add general comments about the entire quote..."
              />
            </div>
          </div>

          {/* File Attachment Section */}
          <div>
            <label className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer text-sm transition-colors">
              <Paperclip className="h-4 w-4 mr-2" />
              Attach Files
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">Max 10MB per file.</p>
            
            {/* File Error Display */}
            {fileError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 text-xs text-red-700">
                {fileError}
              </div>
            )}
            
            {/* Attached Files List */}
            {attachedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                <h5 className="text-xs font-medium text-gray-700 mb-2">Attached Files:</h5>
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 text-xs">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <Paperclip className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700 truncate">{file.name}</span>
                      <span className="text-gray-500">({formatFileSize(file.size)})</span>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="ml-2 text-gray-400 hover:text-red-600 flex-shrink-0"
                      title="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="space-y-3">
            <button
              onClick={handleCommentSubmit}
              disabled={(!comment.trim() && lineComments.length === 0) || isSubmittingComment}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-archgrille-primary text-white hover:bg-[#3a4556] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {isSubmittingComment ? 'Submitting...' : 'Submit Comments'}
            </button>
            
            {commentSubmitted && (
              <div className="flex items-center text-green-600 text-sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Comments submitted successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show signature interface
  if (step3Choice === 'sign') {
    return (
      <DropboxSignature
        quoteData={quoteData}
        onSignatureComplete={onQuoteAccepted}
        onBack={() => setStep3Choice(null)}
      />
    );
  }

  return null;
};
