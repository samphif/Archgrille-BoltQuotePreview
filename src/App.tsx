import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  MessageSquare, 
  CheckCircle,
  Building2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Image
} from 'lucide-react';
import { ApprovalSection } from './components/ApprovalSection';
import { ShippingAddressUpdate } from './components/ShippingAddressUpdate';
import { calculatePricing, requiresRecalculation, type PricingCalculation, type ShippingAddress } from './services/pricingCalculator';

interface LineItemComment {
  lineItemId: number;
  comment: string;
  timestamp: Date;
}

// Mock data - in real implementation, this would come from Salesforce
const initialQuoteData = {
  quoteNumber: "857501-Q",
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
  financials: {
    subtotal: 24400.00,
    tax: 2165.50,
    freight: 0.00,
    grandTotal: 26565.50
  },
  lineItems: [
    {
      id: 1,
      product: "Perforated Grilles",
      description: "20 H* X 80 L→ (in inches) Brass 14ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 1872.00,
      totalPrice: 1872.00
    },
    {
      id: 2,
      product: "Perforated Grilles",
      description: "21 H* X 80 L→ (in inches) Brass 14ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 1936.00,
      totalPrice: 1936.00
    },
    {
      id: 3,
      product: "Perforated Grilles",
      description: "22 H* X 80 L→ (in inches) Brass 14ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 1999.00,
      totalPrice: 1999.00
    },
    {
      id: 4,
      product: "Perforated Grilles",
      description: "23 H* X 80 L→ (in inches) Brass 14ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 2063.00,
      totalPrice: 2063.00
    },
    {
      id: 5,
      product: "Perforated Grilles",
      description: "24 H* X 80 L→ (in inches) Brass 14ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 2127.00,
      totalPrice: 2127.00
    },
    {
      id: 6,
      product: "Perforated Grilles",
      description: "25 H* X 80 L→ (in inches) Brass 14ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 2191.00,
      totalPrice: 2191.00
    },
    {
      id: 7,
      product: "Bar Grilles",
      description: "12 H* X 17 L→ (in inches) Stainless with Satin Finish, No Mounting Requested\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 12212.00,
      totalPrice: 12212.00
    }
  ]
};

function App() {
  const [quoteData, setQuoteData] = useState(initialQuoteData);
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [lineComments, setLineComments] = useState<LineItemComment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [tempComment, setTempComment] = useState('');

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    
    setIsSubmittingComment(true);
    // Simulate API call to Salesforce
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmittingComment(false);
    setCommentSubmitted(true);
    setComment('');
    
    // Reset success message after 3 seconds
    setTimeout(() => setCommentSubmitted(false), 3000);
  };

  const handleAddressUpdate = async (newAddress: ShippingAddress) => {
    const oldAddress = quoteData.customer.address;
    
    if (!requiresRecalculation(oldAddress, newAddress)) {
      // Just update address without recalculation
      setQuoteData(prev => ({
        ...prev,
        customer: {
          ...prev.customer,
          address: newAddress
        }
      }));
      setLastUpdated(new Date());
      return;
    }

    setIsUpdatingAddress(true);
    
    try {
      // Recalculate pricing based on new address
      const newPricing = await calculatePricing(quoteData.lineItems, newAddress);
      
      // Update quote data with new address and pricing
      setQuoteData(prev => ({
        ...prev,
        customer: {
          ...prev.customer,
          address: newAddress
        },
        financials: {
          subtotal: newPricing.subtotal,
          tax: newPricing.tax,
          freight: newPricing.freight,
          grandTotal: newPricing.grandTotal
        }
      }));
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to update address and recalculate pricing:', error);
      throw error;
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  const handleLineCommentSave = async (lineItemId: number) => {
    if (!tempComment.trim()) return;
    
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AG</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quote Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
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
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mb-2">
                    {quoteData.status}
                  </div>
                  {lastUpdated && (
                    <div className="text-xs text-gray-500">
                      Updated {lastUpdated.toLocaleTimeString()}
                    </div>
                  )}
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
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Your Proposal</h2>
                  <p className="text-gray-600">Download and review your PDF document here:</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">2. Review Your Options</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">Line</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Product</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-80">Finish/Spec</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Qty</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Unit Price</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quoteData.lineItems.map((item, index) => {
                      const lineComment = getLineComment(item.id);
                      const isEditingThis = editingCommentId === item.id;
                      
                      return (
                        <React.Fragment key={item.id}>
                          <tr className="hover:bg-gray-50">
                            <td className="px-3 py-4 text-sm font-medium text-gray-500 text-center">
                              {index + 1}
                            </td>
                            <td className="px-3 py-4 text-sm font-medium text-gray-900">
                              <div className="truncate" title={item.product}>{item.product}</div>
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-600">
                              <div className="whitespace-pre-line text-xs leading-tight">{item.description}</div>
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-900 text-center">{item.quantity}</td>
                            <td className="px-3 py-4 text-sm text-gray-900 text-right">{formatCurrency(item.unitPrice)}</td>
                            <td className="px-3 py-4 text-sm font-medium text-gray-900 text-right">
                              <div className="flex items-center justify-between">
                                <span>{formatCurrency(item.totalPrice)}</span>
                                <div className="ml-3">
                                  {lineComment ? (
                                    <button
                                      onClick={() => {
                                        setEditingCommentId(item.id);
                                        setTempComment(lineComment.comment);
                                      }}
                                      className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded border border-blue-200 hover:bg-blue-50"
                                      title="Edit comment"
                                    >
                                      💬
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => setEditingCommentId(item.id)}
                                      className="text-xs text-gray-400 hover:text-blue-600 px-2 py-1 rounded border border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                                      title="Add comment"
                                    >
                                      💬
                                    </button>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                          
                          {/* Expanded comment editing row */}
                          {isEditingThis && (
                            <tr className="bg-blue-50">
                              <td className="px-3 py-2"></td>
                              <td colSpan={5} className="px-3 py-2">
                                <div className="flex items-start space-x-3">
                                  <textarea
                                    value={tempComment}
                                    onChange={(e) => setTempComment(e.target.value)}
                                    placeholder="Add your comment about this line item..."
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    rows={2}
                                    autoFocus
                                  />
                                  <div className="flex flex-col space-y-1">
                                    <button
                                      onClick={() => handleLineCommentSave(item.id)}
                                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={handleLineCommentCancel}
                                      className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 whitespace-nowrap"
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


            {/* Digital Signature Section */}
            <ApprovalSection quoteData={quoteData} />
          </div>

          {/* Sidebar - Quote Summary */}
          <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
            {/* Quote Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
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
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="text-sm text-gray-600">
                  {lastUpdated && (
                    <div className="flex items-center mt-2 text-xs text-blue-600">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Pricing updated {lastUpdated.toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comments Summary Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments Summary</h3>
              
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
              </div>

              {/* Important Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;