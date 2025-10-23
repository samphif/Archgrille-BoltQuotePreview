import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface TechnicalConsiderationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalConsiderationsModal: React.FC<TechnicalConsiderationsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Technical Considerations</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
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
        </div>
      </div>
    </div>,
    document.body
  );
};
