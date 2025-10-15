// Pricing calculation service for shipping address updates
// This would integrate with Salesforce pricing APIs in production

export interface PricingCalculation {
  subtotal: number;
  tax: number;
  freight: number;
  grandTotal: number;
  taxRate: number;
  freightRate: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface LineItem {
  id: number;
  product: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/**
 * Calculates pricing based on shipping address and line items
 * In production, this would call Salesforce CPQ or custom pricing APIs
 */
export const calculatePricing = async (
  lineItems: LineItem[],
  shippingAddress: ShippingAddress
): Promise<PricingCalculation> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
  
  // Tax calculation based on shipping address
  const taxRate = getTaxRate(shippingAddress);
  const tax = subtotal * taxRate;
  
  // Freight calculation based on shipping address and weight/size
  const freight = calculateFreight(lineItems, shippingAddress);
  
  const grandTotal = subtotal + tax + freight;

  return {
    subtotal,
    tax,
    freight,
    grandTotal,
    taxRate,
    freightRate: freight / subtotal
  };
};

/**
 * Gets tax rate based on shipping address
 * In production, this would integrate with tax calculation services
 */
const getTaxRate = (address: ShippingAddress): number => {
  const stateTaxRates: { [key: string]: number } = {
    'CA': 0.0875, // California
    'NY': 0.08,   // New York
    'TX': 0.0625, // Texas
    'FL': 0.06,   // Florida
    'MA': 0.0625, // Massachusetts
    'WA': 0.065,  // Washington
    'OR': 0.0,    // Oregon (no sales tax)
    'NH': 0.0,    // New Hampshire (no sales tax)
    'DE': 0.0,    // Delaware (no sales tax)
    'MT': 0.0,    // Montana (no sales tax)
    'AK': 0.0,    // Alaska (no state sales tax)
  };

  // Default tax rate for other states
  return stateTaxRates[address.state.toUpperCase()] || 0.07;
};

/**
 * Calculates freight costs based on shipping address and items
 * In production, this would integrate with shipping carriers' APIs
 */
const calculateFreight = (lineItems: LineItem[], address: ShippingAddress): number => {
  const totalWeight = estimateWeight(lineItems);
  const baseFreight = totalWeight * 0.5; // Base rate per pound
  
  // Distance-based multiplier (simplified)
  const distanceMultiplier = getDistanceMultiplier(address);
  
  // Minimum freight charge
  const calculatedFreight = baseFreight * distanceMultiplier;
  return Math.max(calculatedFreight, 50); // Minimum $50 freight
};

/**
 * Estimates total weight of line items
 * In production, this would come from product data
 */
const estimateWeight = (lineItems: LineItem[]): number => {
  return lineItems.reduce((totalWeight, item) => {
    // Estimate weight based on product type and quantity
    let itemWeight = 10; // Default 10 lbs per item
    
    if (item.product.toLowerCase().includes('grille')) {
      // Grilles are heavier based on size
      const sizeMatch = item.description.match(/(\d+)\s*H.*?(\d+)\s*L/);
      if (sizeMatch) {
        const height = parseInt(sizeMatch[1]);
        const length = parseInt(sizeMatch[2]);
        itemWeight = (height * length) / 20; // Rough weight calculation
      }
    }
    
    return totalWeight + (itemWeight * item.quantity);
  }, 0);
};

/**
 * Gets distance multiplier based on shipping address
 * In production, this would use actual distance calculations
 */
const getDistanceMultiplier = (address: ShippingAddress): number => {
  // Simplified zone-based pricing
  const zones: { [key: string]: number } = {
    // Zone 1 - Local (Northeast)
    'MA': 1.0, 'NH': 1.0, 'VT': 1.0, 'ME': 1.0, 'RI': 1.0, 'CT': 1.0,
    'NY': 1.1, 'NJ': 1.1, 'PA': 1.1,
    
    // Zone 2 - Regional
    'MD': 1.2, 'DE': 1.2, 'DC': 1.2, 'VA': 1.2, 'WV': 1.2,
    'OH': 1.3, 'MI': 1.3, 'IN': 1.3, 'IL': 1.3, 'WI': 1.3,
    
    // Zone 3 - Extended
    'NC': 1.4, 'SC': 1.4, 'GA': 1.4, 'FL': 1.4, 'AL': 1.4,
    'TN': 1.4, 'KY': 1.4, 'MO': 1.4, 'IA': 1.4, 'MN': 1.4,
    
    // Zone 4 - Far
    'TX': 1.6, 'OK': 1.6, 'AR': 1.6, 'LA': 1.6, 'MS': 1.6,
    'KS': 1.6, 'NE': 1.6, 'SD': 1.6, 'ND': 1.6,
    
    // Zone 5 - Farthest
    'CA': 1.8, 'NV': 1.8, 'AZ': 1.8, 'UT': 1.8, 'CO': 1.8,
    'NM': 1.8, 'WY': 1.8, 'MT': 1.8, 'ID': 1.8, 'WA': 1.8, 'OR': 1.8,
    
    // International
    'Canada': 2.0, 'Mexico': 2.2
  };

  return zones[address.state] || zones[address.country] || 1.5;
};

/**
 * Validates if address change requires recalculation
 */
export const requiresRecalculation = (
  oldAddress: ShippingAddress,
  newAddress: ShippingAddress
): boolean => {
  // Check if tax-affecting fields changed
  return (
    oldAddress.state !== newAddress.state ||
    oldAddress.zipCode !== newAddress.zipCode ||
    oldAddress.country !== newAddress.country
  );
};