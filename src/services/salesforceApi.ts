// Salesforce API integration utilities for Dropbox Sign
// This would be implemented as Apex REST endpoints in your Salesforce org

export interface CreateEmbeddedDraftRequest {
  quoteId: string;
  signerEmail: string;
  signerName: string;
  quoteAmount: number;
  templateId: string;
}

export interface CreateEmbeddedDraftResponse {
  signUrl: string;
  signatureRequestId: string;
}

export interface UpdateQuoteStatusRequest {
  quoteId: string;
  status: string;
  signedDate: string;
  signatureRequestId?: string;
}

/**
 * Creates an embedded signature request using Dropbox Sign
 * This calls a Salesforce Apex REST endpoint that:
 * 1. Creates an embedded unclaimed draft with template
 * 2. Returns the signing URL for embedding
 */
export const createEmbeddedSignatureRequest = async (
  request: CreateEmbeddedDraftRequest
): Promise<CreateEmbeddedDraftResponse> => {
  const response = await fetch('/services/apexrest/DropboxSign/createEmbeddedDraft', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getSalesforceSessionId()}`
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`Failed to create signature request: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Updates the quote status in Salesforce
 * This calls a Salesforce Apex REST endpoint that updates the Quote record
 */
export const updateQuoteStatus = async (
  request: UpdateQuoteStatusRequest
): Promise<void> => {
  const response = await fetch('/services/apexrest/Quote/updateStatus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getSalesforceSessionId()}`
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`Failed to update quote status: ${response.statusText}`);
  }
};

/**
 * Gets the Salesforce session ID for API calls
 * In a real Salesforce Experience Cloud site, this would be available globally
 */
const getSalesforceSessionId = (): string => {
  // In Salesforce Experience Cloud, you can access the session ID via:
  // return $A.get("$SObjectType.CurrentUser.Id"); // Lightning
  // or through a server-side controller
  
  // For development/testing purposes:
  return (window as any).sessionId || 'mock_session_id';
};

/**
 * Converts a File to base64 string for Salesforce upload
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

export interface UploadCommentAttachmentsRequest {
  quoteId: string;
  commentText: string;
  files: Array<{
    name: string;
    base64Data: string;
    contentType: string;
  }>;
}

export interface UploadCommentAttachmentsResponse {
  attachmentIds: string[];
  success: boolean;
}

/**
 * Uploads comment attachments to Salesforce
 * This calls a Salesforce Apex REST endpoint that:
 * 1. Creates ContentVersion records for each file
 * 2. Links them to the Quote record via ContentDocumentLink
 * 3. Creates a Comment record with the comment text
 */
export const uploadCommentAttachments = async (
  quoteId: string,
  files: File[],
  commentText: string
): Promise<UploadCommentAttachmentsResponse> => {
  // Convert all files to base64
  const filePromises = files.map(async (file) => ({
    name: file.name,
    base64Data: await fileToBase64(file),
    contentType: file.type || 'application/octet-stream'
  }));

  const filesData = await Promise.all(filePromises);

  const request: UploadCommentAttachmentsRequest = {
    quoteId,
    commentText,
    files: filesData
  };

  const response = await fetch('/services/apexrest/Quote/uploadCommentAttachments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getSalesforceSessionId()}`
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`Failed to upload attachments: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Apex REST endpoint examples that would need to be created in Salesforce:
 * 
 * @RestResource(urlMapping='/DropboxSign/createEmbeddedDraft')
 * global class DropboxSignController {
 *   @HttpPost
 *   global static CreateEmbeddedDraftResponse createEmbeddedDraft(CreateEmbeddedDraftRequest request) {
 *     // 1. Get Dropbox Sign API credentials from Custom Settings
 *     // 2. Create embedded unclaimed draft with template
 *     // 3. Return signing URL
 *   }
 * }
 * 
 * @RestResource(urlMapping='/Quote/updateStatus')
 * global class QuoteController {
 *   @HttpPost
 *   global static void updateStatus(UpdateQuoteStatusRequest request) {
 *     // 1. Find Quote record by ID
 *     // 2. Update status and signed date
 *     // 3. Trigger any necessary workflows
 *   }
 * }
 * 
 * @RestResource(urlMapping='/Quote/uploadCommentAttachments')
 * global class QuoteCommentController {
 *   @HttpPost
 *   global static UploadCommentAttachmentsResponse uploadCommentAttachments(UploadCommentAttachmentsRequest request) {
 *     // 1. Create ContentVersion records for each file
 *     // 2. Link ContentDocuments to the Quote record via ContentDocumentLink
 *     // 3. Create a Comment/Note record with the comment text
 *     // 4. Return the attachment IDs
 *   }
 * }
 */