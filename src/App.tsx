import React, { useState } from 'react';
import { 
  Download, 
  MessageSquare, 
  RefreshCw,
  User
} from 'lucide-react';
import { Step3ApprovalChoice } from './components/Step3ApprovalChoice';
import { AGLogo } from './components/AGLogo';
import { ReferenceSection } from './components/ReferenceSection';
import { type ShippingAddress } from './services/pricingCalculator';
import { uploadCommentAttachments } from './services/salesforceApi';

interface LineItemComment {
  lineItemId: number;
  comment: string;
  timestamp: Date;
}

import { csvLineItems, calculateFinancials } from './data/csvData';

// Mock data - in real implementation, this would come from Salesforce
const initialQuoteData = {
  quoteNumber: "857501-Q",
  createdDate: new Date(),
  status: "Draft",
  customer: {
    name: "Sam Test Account",
    address: {
      street: "11 Glenwood Avenue",
      city: "Cambridge",
      state: "MA",
      zipCode: "02139",
      country: "United States"
    },
    email: "sam.test@company.com",
    phone: "+1 (555) 123-4567"
  },
  preparedBy: {
    name: "Admin Support",
    email: "sphifer.sv@gmail.com"
  },
  estimator: {
    name: "John Smith",
    comments: "This quote includes premium brass perforated grilles with satin finish. All items are manufactured to exact specifications. Lead time is approximately 2-3 weeks. Please note that custom sizing may require additional engineering review."
  },
  financials: calculateFinancials(csvLineItems),
  lineItems: csvLineItems
};
function App() {
  const [quoteData, setQuoteData] = useState(initialQuoteData);
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [lineComments, setLineComments] = useState<LineItemComment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [tempComment, setTempComment] = useState('');
  const [isQuoteAccepted, setIsQuoteAccepted] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [step3Choice, setStep3Choice] = useState<'changes' | 'sign' | null>(null);

  const handleQuoteAccepted = () => {
    if (quoteExpired) return;
    setIsQuoteAccepted(true);
  };


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.sh', '.app', '.dmg', '.pkg', '.msi', '.dll', '.scr', '.vbs', '.js', '.jar'];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB

    const newFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = file.name.toLowerCase();
      
      // Check for dangerous extensions
      const hasDangerousExtension = dangerousExtensions.some(ext => fileName.endsWith(ext));
      if (hasDangerousExtension) {
        setFileError(`File "${file.name}" has a dangerous extension and cannot be uploaded.`);
        return;
      }
      
      // Check file size
      if (file.size > maxSizeBytes) {
        setFileError(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }
      
      newFiles.push(file);
    }
    
    setAttachedFiles(prev => [...prev, ...newFiles]);
    setFileError(null);
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleCommentSubmit = async () => {
    if ((!comment.trim() && lineComments.length === 0) || isQuoteAccepted || quoteExpired) return;
    
    setIsSubmittingComment(true);
    
    try {
      // If there are files, upload them along with the comment
      if (attachedFiles.length > 0) {
        // In production, this would call the Salesforce API
        console.log('Uploading files:', attachedFiles);
        await uploadCommentAttachments(quoteData.quoteNumber, attachedFiles, comment);
      } else {
        // Simulate API call to Salesforce for comment-only submission
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      setIsSubmittingComment(false);
      setCommentSubmitted(true);
      setComment('');
      setAttachedFiles([]);
      setFileError(null);
      // Comments submitted - signature option is now disabled
      
      // Reset success message after 3 seconds
      setTimeout(() => setCommentSubmitted(false), 3000);
    } catch (error) {
      console.error('Failed to submit comment:', error);
      setIsSubmittingComment(false);
      setFileError('Failed to submit comment. Please try again.');
    }
  };


  const handleLineCommentSave = async (lineItemId: number) => {
    if (!tempComment.trim() || isQuoteAccepted || quoteExpired) return;
    
    // Remove existing comment for this line item
    const updatedComments = lineComments.filter(c => c.lineItemId !== lineItemId);
    
    // Add new comment
    const newComment: LineItemComment = {
      lineItemId,
      comment: tempComment.trim(),
      timestamp: new Date()
    };
    
    setLineComments([...updatedComments, newComment]);
    setEditingCommentId(null);
    setTempComment('');
    
    // In production, this would sync with Salesforce
    console.log('Line comment saved:', newComment);
  };

  const handleLineCommentCancel = () => {
    setEditingCommentId(null);
    setTempComment('');
  };

  const getLineComment = (lineItemId: number): LineItemComment | undefined => {
    return lineComments.find(c => c.lineItemId === lineItemId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatAddress = (address: ShippingAddress) => {
    return `${address.street}\n${address.city}, ${address.state} ${address.zipCode}\n${address.country}`;
  };

  // Quote expiration logic
  const getExpirationDate = (createdDate: Date) => {
    const expirationDate = new Date(createdDate);
    expirationDate.setDate(expirationDate.getDate() + 30);
    return expirationDate;
  };

  const getDaysRemaining = (createdDate: Date) => {
    const expirationDate = getExpirationDate(createdDate);
    const today = new Date();
    const timeDiff = expirationDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const getExpirationStatus = (createdDate: Date) => {
    const daysRemaining = getDaysRemaining(createdDate);
    
    if (daysRemaining >= 4) {
      return { color: 'green', text: 'Valid', urgency: 'normal' };
    } else if (daysRemaining >= 1) {
      return { color: 'yellow', text: 'Expiring Soon', urgency: 'warning' };
    } else {
      return { color: 'red', text: 'Expired', urgency: 'critical' };
    }
  };

  const isQuoteExpired = (createdDate: Date) => {
    return getDaysRemaining(createdDate) <= 0;
  };

  // Check if quote is expired for lockdown functionality
  const quoteExpired = isQuoteExpired(quoteData.createdDate);

  return (
    <div className="min-h-screen bg-archgrille-secondary">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <AGLogo color="dark" size="md" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Quote Header */}
        <div className="bg-white shadow-sm border mb-8">
          <div className="bg-archgrille-primary text-white px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">Testing AC-1150</h1>
              <div className="text-sm">Quote #{quoteData.quoteNumber}</div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Customer</h3>
                <div className="space-y-2">
                  <div className="font-semibold text-gray-900">{quoteData.customer.name}</div>
                  <div className="text-gray-600 whitespace-pre-line">{formatAddress(quoteData.customer.address)}</div>
                  <div className="text-gray-600 text-sm">{quoteData.customer.email}</div>
                </div>
              </div>

              {/* Status & Prepared By */}
              <div className="text-right space-y-3">
                <div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-archgrille-secondary text-archgrille-primary border border-archgrille-primary mb-2">
                    {quoteData.status}
                  </div>
                  {lastUpdated && (
                    <div className="text-xs text-gray-500">
                      Updated {lastUpdated.toLocaleTimeString()}
                    </div>
                  )}
                </div>
                
                {/* Quote Expiration Display */}
                <div>
                  {(() => {
                    const daysRemaining = getDaysRemaining(quoteData.createdDate);
                    const expirationDate = getExpirationDate(quoteData.createdDate);
                    
                    const statusColors = {
                      green: 'text-archgrille-primary',
                      yellow: 'text-yellow-600',
                      red: 'text-red-600'
                    };
                    
                    const expirationStatus = getExpirationStatus(quoteData.createdDate);
                    
                    return (
                      <div className="text-xs text-gray-500">
                        <span className={`font-medium ${statusColors[expirationStatus.color as keyof typeof statusColors]}`}>
                          {daysRemaining > 0 ? (
                            <>Valid until {expirationDate.toLocaleDateString()} ({daysRemaining} days left)</>
                          ) : (
                            <>Expired on {expirationDate.toLocaleDateString()}</>
                          )}
                        </span>
                      </div>
                    );
                  })()}
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600">Prepared By</h3>
                  <div className="font-semibold text-gray-900">{quoteData.preparedBy.name}</div>
                  <div className="text-gray-600 text-sm">{quoteData.preparedBy.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
            {/* PDF Download Section */}
            <div className="bg-white shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Your Proposal</h2>
                  <p className="text-gray-600">Download and review your PDF document here:</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center px-4 py-2 bg-archgrille-primary text-white hover:bg-[#3a4556] transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="bg-white shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">2. Review Your Options</h2>
              </div>
              
              {/* Sticky Header */}
              <div className="sticky top-0 z-10 bg-gray-50 border-b">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">Line</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Qty</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Product</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Description</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Unit Price</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Amount</th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
              
              {/* Scrollable Table Body */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quoteData.lineItems.map((item, index) => {
                      const lineComment = getLineComment(item.id);
                      const isEditingThis = editingCommentId === item.id;
                      
                      return (
                        <React.Fragment key={item.id}>
                          <tr className="hover:bg-gray-50">
                            <td className="px-3 py-4 text-sm text-gray-900 text-center w-12">
                              {index + 1}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-900 text-center w-16">{item.quantity}</td>
                            <td className="px-3 py-4 text-sm text-gray-900 w-32">
                              <div>
                                <div>{item.product}</div>
                                <div className="text-sm text-gray-600 mt-1">{item.dimensions}</div>
                              </div>
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-600 w-48">
                              <div className="whitespace-pre-line text-sm leading-tight">{item.description}</div>
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-900 text-left w-20">{formatCurrency(item.unitPrice)}</td>
                            <td className="pl-3 pr-0 py-4 text-sm text-gray-900 text-left w-20">
                              <div className="flex items-center justify-between">
                                <span>{formatCurrency(item.totalPrice)}</span>
                                <div className="pr-3">
                                  {!isQuoteAccepted && !quoteExpired && step3Choice === 'changes' && lineComment && (
                                    <button
                                      onClick={() => {
                                        setEditingCommentId(item.id);
                                        setTempComment(lineComment.comment);
                                      }}
                                      className="text-xs text-archgrille-primary hover:text-[#3a4556] px-2 py-1 border border-archgrille-primary hover:bg-archgrille-secondary"
                                      title="Edit comment"
                                    >
                                      <MessageSquare className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                  {!isQuoteAccepted && !quoteExpired && step3Choice === 'changes' && !lineComment && (
                                    <button
                                      onClick={() => setEditingCommentId(item.id)}
                                      className="text-xs text-gray-400 hover:text-archgrille-primary px-2 py-1 border border-gray-200 hover:border-archgrille-primary hover:bg-archgrille-secondary"
                                      title="Add comment"
                                    >
                                      <MessageSquare className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                  {(isQuoteAccepted || quoteExpired) && lineComment && (
                                    <span className="text-xs text-gray-400 px-2 py-1 border border-gray-200 bg-gray-50" title={quoteExpired ? "Comments disabled - quote expired" : "Comments disabled - quote accepted"}>
                                      <MessageSquare className="h-3.5 w-3.5" />
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                          
                          {/* Expanded comment editing row */}
                          {isEditingThis && !isQuoteAccepted && !quoteExpired && step3Choice === 'changes' && (
                            <tr className="bg-archgrille-secondary">
                              <td className="px-3 py-2"></td>
                              <td colSpan={5} className="px-3 py-2">
                                <div className="flex items-start space-x-3">
                                  <textarea
                                    value={tempComment}
                                    onChange={(e) => setTempComment(e.target.value)}
                                    placeholder="Add your comment about this line item..."
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 focus:ring-1 focus:ring-archgrille-primary focus:border-archgrille-primary resize-none"
                                    rows={2}
                                    autoFocus
                                  />
                                  <div className="flex flex-col space-y-1">
                                    <button
                                      onClick={() => handleLineCommentSave(item.id)}
                                      className="px-3 py-1 text-xs bg-archgrille-primary text-white hover:bg-[#3a4556] whitespace-nowrap"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={handleLineCommentCancel}
                                      className="px-3 py-1 text-xs bg-gray-300 text-gray-700 hover:bg-gray-400 whitespace-nowrap"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                          
                          {/* Existing comment display row */}
                          {lineComment && !isEditingThis && (
                            <tr className="bg-gray-50">
                              <td className="px-3 py-1"></td>
                              <td colSpan={5} className="px-3 py-1">
                                <div className="text-xs text-gray-600">
                                  <span className="text-gray-500">Comment:</span> {lineComment.comment}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Sidebar - Quote Summary */}
          <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
            {/* Quote Summary */}
            <div className="bg-white shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quote Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(quoteData.financials.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatCurrency(quoteData.financials.tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Freight</span>
                  <span className="font-medium">{formatCurrency(quoteData.financials.freight)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Grand Total</span>
                    <span className="text-lg font-bold text-gray-900">{formatCurrency(quoteData.financials.grandTotal)}</span>
                  </div>
                </div>
                {lastUpdated && (
                  <div className="flex items-center mt-3 text-xs text-archgrille-primary">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Pricing updated {lastUpdated.toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            {/* Estimator Comments Section */}
            <div className="bg-white shadow-sm border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-archgrille-primary" />
                <h3 className="text-lg font-semibold text-gray-900">Estimator Comments</h3>
              </div>
              
              <p className="text-sm text-gray-700 leading-relaxed">
                {quoteData.estimator.comments}
              </p>
            </div>

            {/* Reference Section */}
            <ReferenceSection />

            {/* Step 3 - Next Steps (both designs) */}
            <Step3ApprovalChoice
              comment={comment}
              setComment={setComment}
              lineComments={lineComments}
              attachedFiles={attachedFiles}
              fileError={fileError}
              handleFileSelect={handleFileSelect}
              handleRemoveFile={handleRemoveFile}
              formatFileSize={formatFileSize}
              handleCommentSubmit={handleCommentSubmit}
              isSubmittingComment={isSubmittingComment}
              commentSubmitted={commentSubmitted}
              isQuoteAccepted={isQuoteAccepted}
              quoteData={quoteData}
              onQuoteAccepted={handleQuoteAccepted}
              quoteExpired={quoteExpired}
              step3Choice={step3Choice}
              setStep3Choice={setStep3Choice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
