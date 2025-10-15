# Quote Review Portal for Salesforce Experience Cloud

A professional customer-facing quote review and approval interface that integrates with Salesforce data and Dropbox Sign for digital signatures.

## Features

### Core Components
- **Professional Header**: Clean AG logo with responsive navigation
- **Quote Details Display**: Complete quote information with financial summary
- **Line Items Table**: Detailed product specifications and pricing
- **Customer Feedback**: Comment submission system integrated with Salesforce
- **Digital Signature**: Embedded Dropbox Sign integration for quote acceptance

### Dropbox Sign Integration

This application integrates with Dropbox Sign (formerly HelloSign) for Salesforce to provide embedded digital signature functionality.

#### Implementation Details

1. **Embedded Signature Process**:
   - Uses Dropbox Sign's embedded unclaimed draft with template approach
   - Loads HelloSign SDK dynamically
   - Creates signature request via Salesforce Apex REST endpoints
   - Embeds signing interface directly in the page

2. **Required Salesforce Setup**:
   - Install Dropbox Sign for Salesforce package
   - Configure API credentials in Custom Settings
   - Create signature templates for quotes
   - Implement Apex REST endpoints (see `src/services/salesforceApi.ts`)

3. **Apex REST Endpoints Needed**:
   ```apex
   // Create embedded signature request
   @RestResource(urlMapping='/DropboxSign/createEmbeddedDraft')
   global class DropboxSignController {
     @HttpPost
     global static CreateEmbeddedDraftResponse createEmbeddedDraft(CreateEmbeddedDraftRequest request) {
       // Implementation details in salesforceApi.ts comments
     }
   }
   
   // Update quote status after signing
   @RestResource(urlMapping='/Quote/updateStatus')
   global class QuoteController {
     @HttpPost
     global static void updateStatus(UpdateQuoteStatusRequest request) {
       // Implementation details in salesforceApi.ts comments
     }
   }
   ```

#### Configuration Steps

1. **Dropbox Sign Setup**:
   - Create templates for quote documents
   - Configure signing roles and fields
   - Set up webhook endpoints for status updates

2. **Salesforce Configuration**:
   - Add Dropbox Sign API key to Custom Settings
   - Configure template IDs for different quote types
   - Set up proper security and sharing rules

3. **Experience Cloud Setup**:
   - Deploy components to Experience Cloud site
   - Configure proper user permissions
   - Test signature workflow end-to-end

## Technical Architecture

### Component Structure
```
src/
├── components/
│   ├── ApprovalSection.tsx      # Main approval container
│   ├── DropboxSignature.tsx     # Embedded signature component
├── services/
│   └── salesforceApi.ts         # Salesforce integration utilities
└── App.tsx                      # Main application component
```

### Key Features
- **Mobile Responsive**: Works seamlessly on all device sizes
- **Real-time Updates**: Status updates reflect immediately in Salesforce
- **Error Handling**: Comprehensive error states and user feedback
- **Security**: All API calls authenticated with Salesforce session
- **Accessibility**: WCAG compliant interface elements

## Development

### Prerequisites
- Node.js 18+
- Salesforce org with Experience Cloud enabled
- Dropbox Sign for Salesforce package installed

### Environment Variables
```env
VITE_REACT_APP_HELLOSIGN_API_KEY=your_api_key_here
REACT_APP_SALESFORCE_INSTANCE_URL=https://your-instance.salesforce.com
```

### Local Development
```bash
npm install
npm run dev
```

### Deployment to Salesforce
1. Build the application: `npm run build`
2. Upload static resources to Salesforce
3. Create Lightning Web Component wrapper
4. Add to Experience Cloud site pages

## Integration Points

### Salesforce Objects
- **Quote**: Main quote record with status updates
- **QuoteLineItem**: Individual line items displayed in table
- **Account/Contact**: Customer information
- **Document**: Signed documents storage

### Dropbox Sign Webhooks
Configure webhooks to handle signature events:
- `signature_request_signed`: Update quote status to "Accepted"
- `signature_request_declined`: Update quote status to "Declined"
- `signature_request_canceled`: Reset quote to "Draft" status

## Security Considerations

- All API calls use Salesforce session authentication
- Dropbox Sign API keys stored securely in Salesforce Custom Settings
- User permissions enforced through Salesforce sharing rules
- HTTPS required for all signature operations
- Audit trail maintained for all quote status changes

## Support

For technical support or implementation questions, refer to:
- [Dropbox Sign for Salesforce Documentation](https://sfdc-docs.hellosign.com/)
- [Salesforce Experience Cloud Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.exp_cloud_dev.meta/exp_cloud_dev/)