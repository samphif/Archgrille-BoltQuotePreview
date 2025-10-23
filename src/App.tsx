import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  MessageSquare, 
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Image,
  User,
  Paperclip,
  X
} from 'lucide-react';
import { ApprovalSection } from './components/ApprovalSection';
import { ShippingAddressUpdate } from './components/ShippingAddressUpdate';
import { Step3ApprovalChoice } from './components/Step3ApprovalChoice';
import { AGLogo } from './components/AGLogo';
import { calculatePricing, requiresRecalculation, type PricingCalculation, type ShippingAddress } from './services/pricingCalculator';
import { uploadCommentAttachments } from './services/salesforceApi';

interface LineItemComment {
  lineItemId: number;
  comment: string;
  timestamp: Date;
}

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
  financials: {
    subtotal: 682142.00,
    tax: 60540.10,
    freight: 0.00,
    grandTotal: 742682.10
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
    },
    {
      id: 8,
      product: "Perforated Grilles",
      description: "26 H* X 80 L→ (in inches) Brass 14ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 2255.00,
      totalPrice: 2255.00
    },
    {
      id: 9,
      product: "Perforated Grilles",
      description: "27 H* X 80 L→ (in inches) Brass 14ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 2319.00,
      totalPrice: 2319.00
    },
    {
      id: 10,
      product: "Perforated Grilles",
      description: "28 H* X 80 L→ (in inches) Brass 14ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 2383.00,
      totalPrice: 2383.00
    },
    {
      id: 11,
      product: "Perforated Grilles",
      description: "29 H* X 80 L→ (in inches) Brass 14ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 2447.00,
      totalPrice: 2447.00
    },
    {
      id: 12,
      product: "Perforated Grilles",
      description: "30 H* X 80 L→ (in inches) Brass 14ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 2511.00,
      totalPrice: 2511.00
    },
    {
      id: 13,
      product: "Bar Grilles",
      description: "14 H* X 20 L→ (in inches) Stainless with Satin Finish, No Mounting Requested\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 14500.00,
      totalPrice: 14500.00
    },
    {
      id: 14,
      product: "Bar Grilles",
      description: "16 H* X 24 L→ (in inches) Stainless with Satin Finish, No Mounting Requested\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 16800.00,
      totalPrice: 16800.00
    },
    {
      id: 15,
      product: "Perforated Grilles",
      description: "18 H* X 60 L→ (in inches) Aluminum 16ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Wall",
      quantity: 1,
      unitPrice: 1245.00,
      totalPrice: 1245.00
    },
    {
      id: 16,
      product: "Perforated Grilles",
      description: "19 H* X 60 L→ (in inches) Aluminum 16ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Wall",
      quantity: 1,
      unitPrice: 1289.00,
      totalPrice: 1289.00
    },
    {
      id: 17,
      product: "Perforated Grilles",
      description: "20 H* X 60 L→ (in inches) Aluminum 16ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Wall",
      quantity: 1,
      unitPrice: 1333.00,
      totalPrice: 1333.00
    },
    {
      id: 18,
      product: "Perforated Grilles",
      description: "21 H* X 60 L→ (in inches) Aluminum 16ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Wall",
      quantity: 1,
      unitPrice: 1377.00,
      totalPrice: 1377.00
    },
    {
      id: 19,
      product: "Perforated Grilles",
      description: "22 H* X 60 L→ (in inches) Aluminum 16ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Wall",
      quantity: 1,
      unitPrice: 1421.00,
      totalPrice: 1421.00
    },
    {
      id: 20,
      product: "Perforated Grilles",
      description: "23 H* X 60 L→ (in inches) Aluminum 16ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Wall",
      quantity: 1,
      unitPrice: 1465.00,
      totalPrice: 1465.00
    },
    {
      id: 21,
      product: "Bar Grilles",
      description: "18 H* X 28 L→ (in inches) Stainless with Satin Finish, No Mounting Requested\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 19200.00,
      totalPrice: 19200.00
    },
    {
      id: 22,
      product: "Bar Grilles",
      description: "20 H* X 32 L→ (in inches) Stainless with Satin Finish, No Mounting Requested\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 21600.00,
      totalPrice: 21600.00
    },
    {
      id: 23,
      product: "Perforated Grilles",
      description: "24 H* X 60 L→ (in inches) Aluminum 16ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Wall",
      quantity: 1,
      unitPrice: 1509.00,
      totalPrice: 1509.00
    },
    {
      id: 24,
      product: "Perforated Grilles",
      description: "25 H* X 60 L→ (in inches) Aluminum 16ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Wall",
      quantity: 1,
      unitPrice: 1553.00,
      totalPrice: 1553.00
    },
    {
      id: 25,
      product: "Perforated Grilles",
      description: "26 H* X 60 L→ (in inches) Aluminum 16ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Wall",
      quantity: 1,
      unitPrice: 1597.00,
      totalPrice: 1597.00
    },
    {
      id: 26,
      product: "Perforated Grilles",
      description: "27 H* X 60 L→ (in inches) Aluminum 16ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Wall",
      quantity: 1,
      unitPrice: 1641.00,
      totalPrice: 1641.00
    },
    {
      id: 27,
      product: "Perforated Grilles",
      description: "28 H* X 60 L→ (in inches) Aluminum 16ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Wall",
      quantity: 1,
      unitPrice: 1685.00,
      totalPrice: 1685.00
    },
    {
      id: 28,
      product: "Perforated Grilles",
      description: "29 H* X 60 L→ (in inches) Aluminum 16ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Wall",
      quantity: 1,
      unitPrice: 1729.00,
      totalPrice: 1729.00
    },
    {
      id: 29,
      product: "Perforated Grilles",
      description: "30 H* X 60 L→ (in inches) Aluminum 16ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Wall",
      quantity: 1,
      unitPrice: 1773.00,
      totalPrice: 1773.00
    },
    {
      id: 30,
      product: "Bar Grilles",
      description: "22 H* X 36 L→ (in inches) Stainless with Satin Finish, No Mounting Requested\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 24000.00,
      totalPrice: 24000.00
    },
    {
      id: 31,
      product: "Bar Grilles",
      description: "24 H* X 40 L→ (in inches) Stainless with Satin Finish, No Mounting Requested\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 26400.00,
      totalPrice: 26400.00
    },
    {
      id: 32,
      product: "Perforated Grilles",
      description: "15 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 890.00,
      totalPrice: 890.00
    },
    {
      id: 33,
      product: "Perforated Grilles",
      description: "16 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 920.00,
      totalPrice: 920.00
    },
    {
      id: 34,
      product: "Perforated Grilles",
      description: "17 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 950.00,
      totalPrice: 950.00
    },
    {
      id: 35,
      product: "Perforated Grilles",
      description: "18 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 980.00,
      totalPrice: 980.00
    },
    {
      id: 36,
      product: "Perforated Grilles",
      description: "19 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1010.00,
      totalPrice: 1010.00
    },
    {
      id: 37,
      product: "Perforated Grilles",
      description: "20 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1040.00,
      totalPrice: 1040.00
    },
    {
      id: 38,
      product: "Bar Grilles",
      description: "26 H* X 44 L→ (in inches) Stainless with Satin Finish, No Mounting Requested\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 28800.00,
      totalPrice: 28800.00
    },
    {
      id: 39,
      product: "Bar Grilles",
      description: "28 H* X 48 L→ (in inches) Stainless with Satin Finish, No Mounting Requested\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 31200.00,
      totalPrice: 31200.00
    },
    {
      id: 40,
      product: "Perforated Grilles",
      description: "21 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1070.00,
      totalPrice: 1070.00
    },
    {
      id: 41,
      product: "Perforated Grilles",
      description: "22 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1100.00,
      totalPrice: 1100.00
    },
    {
      id: 42,
      product: "Perforated Grilles",
      description: "23 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1130.00,
      totalPrice: 1130.00
    },
    {
      id: 43,
      product: "Perforated Grilles",
      description: "24 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1160.00,
      totalPrice: 1160.00
    },
    {
      id: 44,
      product: "Perforated Grilles",
      description: "25 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1190.00,
      totalPrice: 1190.00
    },
    {
      id: 45,
      product: "Perforated Grilles",
      description: "26 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1220.00,
      totalPrice: 1220.00
    },
    {
      id: 46,
      product: "Perforated Grilles",
      description: "27 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1250.00,
      totalPrice: 1250.00
    },
    {
      id: 47,
      product: "Bar Grilles",
      description: "30 H* X 52 L→ (in inches) Stainless with Satin Finish, No Mounting Requested\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 33600.00,
      totalPrice: 33600.00
    },
    {
      id: 48,
      product: "Bar Grilles",
      description: "32 H* X 56 L→ (in inches) Stainless with Satin Finish, No Mounting Requested\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 36000.00,
      totalPrice: 36000.00
    },
    {
      id: 49,
      product: "Perforated Grilles",
      description: "28 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1280.00,
      totalPrice: 1280.00
    },
    {
      id: 50,
      product: "Perforated Grilles",
      description: "29 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1310.00,
      totalPrice: 1310.00
    },
    {
      id: 51,
      product: "Perforated Grilles",
      description: "30 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1340.00,
      totalPrice: 1340.00
    },
    {
      id: 52,
      product: "Perforated Grilles",
      description: "31 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1370.00,
      totalPrice: 1370.00
    },
    {
      id: 53,
      product: "Perforated Grilles",
      description: "32 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1400.00,
      totalPrice: 1400.00
    },
    {
      id: 54,
      product: "Perforated Grilles",
      description: "33 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1430.00,
      totalPrice: 1430.00
    },
    {
      id: 55,
      product: "Bar Grilles",
      description: "34 H* X 60 L→ (in inches) Stainless with Satin Finish, No Mounting Requested\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 38400.00,
      totalPrice: 38400.00
    },
    {
      id: 56,
      product: "Bar Grilles",
      description: "36 H* X 64 L→ (in inches) Stainless with Satin Finish, No Mounting Requested\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 40800.00,
      totalPrice: 40800.00
    },
    {
      id: 57,
      product: "Perforated Grilles",
      description: "34 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1460.00,
      totalPrice: 1460.00
    },
    {
      id: 58,
      product: "Perforated Grilles",
      description: "35 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1490.00,
      totalPrice: 1490.00
    },
    {
      id: 59,
      product: "Perforated Grilles",
      description: "36 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1520.00,
      totalPrice: 1520.00
    },
    {
      id: 60,
      product: "Perforated Grilles",
      description: "37 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1550.00,
      totalPrice: 1550.00
    },
    {
      id: 61,
      product: "Perforated Grilles",
      description: "38 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1580.00,
      totalPrice: 1580.00
    },
    {
      id: 62,
      product: "Perforated Grilles",
      description: "39 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1610.00,
      totalPrice: 1610.00
    },
    {
      id: 63,
      product: "Perforated Grilles",
      description: "40 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1640.00,
      totalPrice: 1640.00
    },
    {
      id: 64,
      product: "Bar Grilles",
      description: "38 H* X 68 L→ (in inches) Stainless with Satin Finish, No Mounting Requested\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 43200.00,
      totalPrice: 43200.00
    },
    {
      id: 65,
      product: "Bar Grilles",
      description: "40 H* X 72 L→ (in inches) Stainless with Satin Finish, No Mounting Requested\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 45600.00,
      totalPrice: 45600.00
    },
    {
      id: 66,
      product: "Perforated Grilles",
      description: "41 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1670.00,
      totalPrice: 1670.00
    },
    {
      id: 67,
      product: "Perforated Grilles",
      description: "42 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1700.00,
      totalPrice: 1700.00
    },
    {
      id: 68,
      product: "Perforated Grilles",
      description: "43 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1730.00,
      totalPrice: 1730.00
    },
    {
      id: 69,
      product: "Perforated Grilles",
      description: "44 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1760.00,
      totalPrice: 1760.00
    },
    {
      id: 70,
      product: "Perforated Grilles",
      description: "45 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1790.00,
      totalPrice: 1790.00
    },
    {
      id: 71,
      product: "Perforated Grilles",
      description: "46 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1820.00,
      totalPrice: 1820.00
    },
    {
      id: 72,
      product: "Perforated Grilles",
      description: "47 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1850.00,
      totalPrice: 1850.00
    },
    {
      id: 73,
      product: "Bar Grilles",
      description: "42 H* X 76 L→ (in inches) Stainless with Satin Finish, No Mounting Requested\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 48000.00,
      totalPrice: 48000.00
    },
    {
      id: 74,
      product: "Bar Grilles",
      description: "44 H* X 80 L→ (in inches) Stainless with Satin Finish, No Mounting Requested\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 50400.00,
      totalPrice: 50400.00
    },
    {
      id: 75,
      product: "Perforated Grilles",
      description: "48 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1880.00,
      totalPrice: 1880.00
    },
    {
      id: 76,
      product: "Perforated Grilles",
      description: "49 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1910.00,
      totalPrice: 1910.00
    },
    {
      id: 77,
      product: "Perforated Grilles",
      description: "50 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1940.00,
      totalPrice: 1940.00
    },
    {
      id: 78,
      product: "Perforated Grilles",
      description: "51 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 1970.00,
      totalPrice: 1970.00
    },
    {
      id: 79,
      product: "Perforated Grilles",
      description: "52 H* X 40 L→ (in inches) Steel 18ga with Satin Finish, 609 Perforated grille with snap in catches\nRequested Border of 1 X 1\nGrille installation location: Floor",
      quantity: 1,
      unitPrice: 2000.00,
      totalPrice: 2000.00
    },
    {
      id: 80,
      product: "Bar Grilles",
      description: "46 H* X 84 L→ (in inches) Stainless with Satin Finish, No Mounting Requested\nGrille installation location: Ceiling",
      quantity: 1,
      unitPrice: 52800.00,
      totalPrice: 52800.00
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
  const [isQuoteAccepted, setIsQuoteAccepted] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'comments' | 'signature'>('signature');
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
      // Permanently disable signature option after comments are submitted
      setSelectedAction('comments');
      
      // Reset success message after 3 seconds
      setTimeout(() => setCommentSubmitted(false), 3000);
    } catch (error) {
      console.error('Failed to submit comment:', error);
      setIsSubmittingComment(false);
      setFileError('Failed to submit comment. Please try again.');
    }
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
                                  {!isQuoteAccepted && !quoteExpired && step3Choice === 'changes' && lineComment && (
                                    <button
                                      onClick={() => {
                                        setEditingCommentId(item.id);
                                        setTempComment(lineComment.comment);
                                      }}
                                      className="text-xs text-archgrille-primary hover:text-[#3a4556] px-2 py-1 border border-archgrille-primary hover:bg-archgrille-secondary"
                                      title="Edit comment"
                                    >
                                      💬
                                    </button>
                                  )}
                                  {!isQuoteAccepted && !quoteExpired && step3Choice === 'changes' && !lineComment && (
                                    <button
                                      onClick={() => setEditingCommentId(item.id)}
                                      className="text-xs text-gray-400 hover:text-archgrille-primary px-2 py-1 border border-gray-200 hover:border-archgrille-primary hover:bg-archgrille-secondary"
                                      title="Add comment"
                                    >
                                      💬
                                    </button>
                                  )}
                                  {!isQuoteAccepted && !quoteExpired && step3Choice !== 'changes' && (
                                    <span className="text-xs text-gray-300 px-2 py-1 border border-gray-200 bg-gray-50" title="Select 'I Need Changes' in Step 3 to add comments">
                                      💬
                                    </span>
                                  )}
                                  {(isQuoteAccepted || quoteExpired) && lineComment && (
                                    <span className="text-xs text-gray-400 px-2 py-1 border border-gray-200 bg-gray-50" title={quoteExpired ? "Comments disabled - quote expired" : "Comments disabled - quote accepted"}>
                                      💬
                                    </span>
                                  )}
                                  {!isQuoteAccepted && quoteExpired && !lineComment && (
                                    <span className="text-xs text-gray-400 px-2 py-1 border border-gray-200 bg-gray-50" title="Comments disabled - quote expired">
                                      💬
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
