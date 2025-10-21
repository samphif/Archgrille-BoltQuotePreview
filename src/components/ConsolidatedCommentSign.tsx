import React from 'react';
import { ApprovalSection } from './ApprovalSection';
import { MessageSquare, CheckCircle, Paperclip, X } from 'lucide-react';

interface ConsolidatedCommentSignProps {
  selectedAction: 'comments' | 'signature';
  setSelectedAction: (action: 'comments' | 'signature') => void;
  comment: string;
  setComment: (comment: string) => void;
  lineComments: Array<{lineItemId: number; comment: string; timestamp: Date}>;
  commentSubmitted: boolean;
  isSubmittingComment: boolean;
  handleCommentSubmit: () => void;
  attachedFiles: File[];
  fileError: string | null;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: (index: number) => void;
  formatFileSize: (bytes: number) => string;
  isQuoteAccepted: boolean;
  quoteData: any;
  onQuoteAccepted: () => void;
}

export const ConsolidatedCommentSign: React.FC<ConsolidatedCommentSignProps> = ({
  selectedAction,
  setSelectedAction,
  comment,
  setComment,
  lineComments,
  commentSubmitted,
  isSubmittingComment,
  handleCommentSubmit,
  attachedFiles,
  fileError,
  handleFileSelect,
  handleRemoveFile,
  formatFileSize,
  isQuoteAccepted,
  quoteData,
  onQuoteAccepted
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">3. Next Steps</h2>
      
      {/* Toggle Selection */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          Choose to either request changes by submitting comments, or accept the quote by signing.
        </p>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedAction('comments')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedAction === 'comments'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            disabled={commentSubmitted}
          >
            Submit Comments for Review
          </button>
          <button
            onClick={() => setSelectedAction('signature')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedAction === 'signature'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            disabled={commentSubmitted}
          >
            Sign & Accept Quote
          </button>
        </div>
      </div>

      {/* Comments Interface */}
      {selectedAction === 'comments' && !commentSubmitted && (
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
                No line-specific comments added yet. Use the 💬 buttons in the table above to add comments for specific line items.
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                placeholder="Add general comments about the entire quote..."
              />
            </div>
          </div>

          {/* File Attachment Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Attach Files (Optional)</h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">
                    Click to upload files or drag and drop
                  </div>
                  <div className="text-xs text-gray-500">
                    PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, TXT (max 10MB each)
                  </div>
                </div>
              </label>
            </div>
            {attachedFiles.length > 0 && (
              <div className="mt-3">
                <h5 className="text-xs font-medium text-gray-700 mb-2">Attached Files:</h5>
                <div className="space-y-1">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1">
                      <span className="text-gray-700">{file.name}</span>
                      <span className="text-gray-500">({formatFileSize(file.size)})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {fileError && (
              <div className="mt-2 text-xs text-red-600">{fileError}</div>
            )}
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-800">
                <div className="font-medium mb-1">Comments:</div>
                <div className="text-blue-700">
                  Click 💬 for line-specific comments or add general comments above. All comments are submitted together.
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-3">
            <button
              onClick={handleCommentSubmit}
              disabled={(!comment.trim() && lineComments.length === 0) || isSubmittingComment}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
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
      )}

      {/* Signature Interface */}
      {selectedAction === 'signature' && !commentSubmitted && !isQuoteAccepted && (
        <ApprovalSection 
          quoteData={quoteData} 
          onQuoteAccepted={onQuoteAccepted}
          commentsSubmitted={false}
        />
      )}

      {/* Show signature success state */}
      {isQuoteAccepted && (
        <ApprovalSection 
          quoteData={quoteData} 
          onQuoteAccepted={onQuoteAccepted}
          commentsSubmitted={false}
        />
      )}

      {/* Show comments submitted state */}
      {commentSubmitted && !isQuoteAccepted && (
        <ApprovalSection 
          quoteData={quoteData} 
          onQuoteAccepted={onQuoteAccepted}
          commentsSubmitted={true}
        />
      )}
    </div>
  );
};
