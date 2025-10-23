import React, { useState } from 'react';
import { MapPin, Edit3, Check, X, Calculator, Truck } from 'lucide-react';

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ShippingAddressUpdateProps {
  currentAddress: ShippingAddress;
  onAddressUpdate: (newAddress: ShippingAddress) => Promise<void>;
  isUpdating: boolean;
}

export const ShippingAddressUpdate: React.FC<ShippingAddressUpdateProps> = ({
  currentAddress,
  onAddressUpdate,
  isUpdating
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAddress, setEditedAddress] = useState<ShippingAddress>(currentAddress);
  const [validationErrors, setValidationErrors] = useState<Partial<ShippingAddress>>({});

  const validateAddress = (address: ShippingAddress): boolean => {
    const errors: Partial<ShippingAddress> = {};
    
    if (!address.street.trim()) errors.street = 'Street address is required';
    if (!address.city.trim()) errors.city = 'City is required';
    if (!address.state.trim()) errors.state = 'State is required';
    if (!address.zipCode.trim()) errors.zipCode = 'ZIP code is required';
    if (!/^\d{5}(-\d{4})?$/.test(address.zipCode.trim())) {
      errors.zipCode = 'Please enter a valid ZIP code (12345 or 12345-6789)';
    }
    if (!address.country.trim()) errors.country = 'Country is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateAddress(editedAddress)) {
      return;
    }

    try {
      await onAddressUpdate(editedAddress);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update address:', error);
    }
  };

  const handleCancel = () => {
    setEditedAddress(currentAddress);
    setValidationErrors({});
    setIsEditing(false);
  };

  const formatAddress = (address: ShippingAddress) => {
    return `${address.street}\n${address.city}, ${address.state} ${address.zipCode}\n${address.country}`;
  };

  if (!isEditing) {
    return (
      <div className="bg-white shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Truck className="h-5 w-5 mr-2 text-archgrille-primary" />
            Shipping Address
          </h3>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-archgrille-primary hover:text-[#3a4556] hover:bg-archgrille-secondary transition-colors"
          >
            <Edit3 className="h-4 w-4 mr-1" />
            Update Address
          </button>
        </div>
        
        <div className="bg-gray-50 p-4">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="text-gray-700 whitespace-pre-line">
              {formatAddress(currentAddress)}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p className="flex items-center">
            <Calculator className="h-4 w-4 mr-2" />
            Tax and shipping costs are calculated based on this address
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Truck className="h-5 w-5 mr-2 text-archgrille-primary" />
          Update Shipping Address
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address *
          </label>
          <input
            type="text"
            id="street"
            value={editedAddress.street}
            onChange={(e) => setEditedAddress({ ...editedAddress, street: e.target.value })}
            className={`w-full px-3 py-2 border focus:ring-2 focus:ring-archgrille-primary focus:border-archgrille-primary ${
              validationErrors.street ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="123 Main Street"
          />
          {validationErrors.street && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.street}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              id="city"
              value={editedAddress.city}
              onChange={(e) => setEditedAddress({ ...editedAddress, city: e.target.value })}
              className={`w-full px-3 py-2 border focus:ring-2 focus:ring-archgrille-primary focus:border-archgrille-primary ${
                validationErrors.city ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Cambridge"
            />
            {validationErrors.city && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input
              type="text"
              id="state"
              value={editedAddress.state}
              onChange={(e) => setEditedAddress({ ...editedAddress, state: e.target.value })}
              className={`w-full px-3 py-2 border focus:ring-2 focus:ring-archgrille-primary focus:border-archgrille-primary ${
                validationErrors.state ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="MA"
            />
            {validationErrors.state && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.state}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code *
            </label>
            <input
              type="text"
              id="zipCode"
              value={editedAddress.zipCode}
              onChange={(e) => setEditedAddress({ ...editedAddress, zipCode: e.target.value })}
              className={`w-full px-3 py-2 border focus:ring-2 focus:ring-archgrille-primary focus:border-archgrille-primary ${
                validationErrors.zipCode ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="02139"
            />
            {validationErrors.zipCode && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.zipCode}</p>
            )}
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              id="country"
              value={editedAddress.country}
              onChange={(e) => setEditedAddress({ ...editedAddress, country: e.target.value })}
              className={`w-full px-3 py-2 border focus:ring-2 focus:ring-archgrille-primary focus:border-archgrille-primary ${
                validationErrors.country ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Country</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="Mexico">Mexico</option>
            </select>
            {validationErrors.country && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.country}</p>
            )}
          </div>
        </div>

        {isUpdating && (
          <div className="bg-archgrille-secondary border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-archgrille-primary"></div>
              <div>
                <p className="text-gray-900 font-medium">Updating Address & Recalculating Costs</p>
                <p className="text-gray-700 text-sm">Please wait while we update tax and shipping calculations...</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3 pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="inline-flex items-center px-4 py-2 bg-archgrille-primary text-white hover:bg-[#3a4556] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Check className="h-4 w-4 mr-2" />
            {isUpdating ? 'Updating...' : 'Save & Recalculate'}
          </button>
          
          <button
            onClick={handleCancel}
            disabled={isUpdating}
            className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Changing your shipping address will automatically recalculate tax and freight costs</p>
          <p>• Your proposal document will be updated with the new totals</p>
          <p>• All other proposal details will remain unchanged</p>
        </div>
      </div>
    </div>
  );
};