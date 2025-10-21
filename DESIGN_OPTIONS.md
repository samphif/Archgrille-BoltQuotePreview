# Design Options for Comment and Sign Interface

This project now supports two different UI designs for the comment and sign interface. You can easily switch between them using feature flags.

## Option 1: Consolidated Design (Default)
- Comments and signing are in a single section labeled "3. Next Steps"
- Users must choose between submitting comments OR signing the quote
- Toggle interface allows switching between the two options
- Once comments are submitted, signature option is permanently disabled

## Option 2: Separate Design
- Comments section remains in the right sidebar
- Signature section remains in the main content area
- Users can submit comments and sign independently
- Both options are always available

## How to Switch Between Designs

### Method 1: Environment Variable
Create a `.env` file in the project root and set:

```bash
# For consolidated design (default)
REACT_APP_CONSOLIDATED_DESIGN=true

# For separate design
REACT_APP_CONSOLIDATED_DESIGN=false
```

### Method 2: Code Configuration
Edit `src/config/featureFlags.ts` and change:

```typescript
// Set to true for consolidated design, false for separate design
CONSOLIDATED_COMMENT_SIGN: true, // Change this value
```

## Testing Both Designs

1. **Test Consolidated Design:**
   - Set `CONSOLIDATED_COMMENT_SIGN: true` in featureFlags.ts
   - Run `npm run dev`
   - Visit the application and see the toggle interface in section 3

2. **Test Separate Design:**
   - Set `CONSOLIDATED_COMMENT_SIGN: false` in featureFlags.ts
   - Run `npm run dev`
   - Visit the application and see comments in sidebar, signature in main area

## For Business Demo

To show both options to the business:

1. **Create two separate deployments:**
   - One with consolidated design enabled
   - One with separate design enabled

2. **Or use environment variables:**
   - Create two different .env files
   - Switch between them for demonstrations

3. **Or create separate branches:**
   - `feature/consolidated-design` - with consolidated design as default
   - `feature/separate-design` - with separate design as default

## Files Modified

- `src/config/featureFlags.ts` - Feature flag configuration
- `src/components/ConsolidatedCommentSign.tsx` - Consolidated design component
- `src/components/SeparateCommentSign.tsx` - Separate design component
- `src/App.tsx` - Main app with conditional rendering

## Current Default

The consolidated design is currently set as the default. To change this, modify the `CONSOLIDATED_COMMENT_SIGN` value in `src/config/featureFlags.ts`.
