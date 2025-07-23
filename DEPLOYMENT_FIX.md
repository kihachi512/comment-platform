# Deployment Fix Guide

## Client-Side Exception Resolution

This guide addresses the "Application error: a client-side exception has occurred" issue.

## Root Causes Identified

1. **Missing Environment Variables** - NextAuth and AWS configurations
2. **Hydration Mismatches** - localStorage access during SSR
3. **Unhandled API Errors** - Lack of proper error handling

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file with the following variables:

```env
# Google OAuth Configuration (Required for NextAuth)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# AWS Configuration (Required for DynamoDB)
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION=ap-northeast-1
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)

### 3. AWS DynamoDB Setup

1. Create AWS account and set up IAM user with DynamoDB permissions
2. Create the following DynamoDB tables:
   - `Users` (Primary Key: email)
   - `Posts` (Primary Key: postId)
   - `Comments` (Primary Key: commentId, GSI: postId-index)

### 4. NEXTAUTH_SECRET Generation

Generate a secure secret:

```bash
openssl rand -base64 32
```

## Deployment Steps

### For Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`

3. Start development server:
```bash
npm run dev
```

### For Production (Vercel)

1. Add environment variables in Vercel dashboard
2. Ensure all required services (Google OAuth, AWS) are configured
3. Deploy

## Troubleshooting

### Browser Console Errors

1. Open browser developer tools (F12)
2. Check Console tab for specific error messages
3. Check Network tab for failed API requests

### Common Issues

1. **Authentication Error**: Check Google OAuth credentials
2. **Database Connection Error**: Verify AWS credentials and table existence
3. **Hydration Error**: Check for client-side only code in SSR components

### Error Monitoring

The application now includes:
- Error boundaries for graceful error handling
- Improved error logging
- Better fallback mechanisms

## Verification Steps

1. Navigate to the application
2. Check that authentication works
3. Verify data fetching operates correctly
4. Test error scenarios (network offline, etc.)

## Support

If issues persist:
1. Check browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure external services (Google OAuth, AWS) are properly configured