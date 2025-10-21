// Feature flags configuration
export const FEATURE_FLAGS = {
  // Set to true for consolidated design, false for separate design
  CONSOLIDATED_COMMENT_SIGN: true,
  
  // Environment-based overrides (can be set via environment variables)
  // In production, you can override via env vars or a config service
  get CONSOLIDATED_DESIGN() {
    return process.env.REACT_APP_CONSOLIDATED_DESIGN === 'true' || this.CONSOLIDATED_COMMENT_SIGN;
  }
};

// Helper function to check if consolidated design should be used
export const useConsolidatedDesign = () => {
  return FEATURE_FLAGS.CONSOLIDATED_DESIGN;
};
