import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { TechnicalConsiderationsModal } from './TechnicalConsiderationsModal';

export const ReferenceSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white shadow-sm border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="h-5 w-5 text-archgrille-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Reference</h3>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleOpenModal}
            className="w-full text-left p-3 border border-gray-200 hover:border-archgrille-primary hover:bg-archgrille-secondary transition-colors rounded-lg"
          >
            <div className="flex items-center">
              <div>
                <div className="font-medium text-gray-900">Technical Considerations</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <TechnicalConsiderationsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};
