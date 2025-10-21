import React from 'react';
import { ApprovalSection } from './ApprovalSection';
import { MessageSquare, CheckCircle, Paperclip, X } from 'lucide-react';

interface SeparateCommentSignProps {
  // Add the same props that your current App.tsx uses
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

export const SeparateCommentSign: React.FC<SeparateCommentSignProps> = ({
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
    <>
      {/* Original Approval Section */}
      <ApprovalSection 
        quoteData={quoteData} 
        onQuoteAccepted={onQuoteAccepted}
        commentsSubmitted={false}
      />

      {/* Original Comments Section in Sidebar */}
      <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments Summary</h3>
        
        {isQuoteAccepted ? (
          <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              Comments are disabled - quote has been accepted.
            </p>
          </div>
        ) : (
          <>
            {/* Line Item Comments Summary */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Line Comments ({lineComments.length})</h4>
              {lineComments.length > 0 ? (
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {lineComments.map((lineComment) => (
                    <div key={lineComment.lineItemId} className="text-xs bg-gray-50 rounded px-2 py-1">
                      <span className="font-medium text-gray-700">Line {lineComment.lineItemId}:</span> <span className="text-gray-600">{lineComment.comment}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* General Comments Section */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">General Comments</h4>
              <div>
                <textarea
                  id="comment"
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                  placeholder="Add general comments about the entire quote..."
                />
              </div>
              
              {/* File Attachment Section */}
              <div className="mt-3">
                <label className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer text-sm transition-colors">
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
                <p className="text-xs text-gray-500 mt-1">Max 10MB per file. Executable files not allowed.</p>
                
                {/* File Error Display */}
                {fileError && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                    {fileError}
                  </div>
                )}
                
                {/* Attached Files List */}
                {attachedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {attachedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 text-xs">
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
            </div>

            {/* Important Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-start space-x-2">
                <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-xs text-blue-800">
                  <div className="font-medium mb-1">Comments:</div>
                  <div className="text-blue-700">
                    Click 💬 for line comments or add general comments above.
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
          </>
        )}
      </div>
    </>
  );
};
