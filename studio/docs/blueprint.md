# **App Name**: FileZen Cloud

## Core Features:

- User Authentication: Secure user registration and login using JWT tokens.
- File Upload to S3: Upload files to AWS S3 bucket with metadata stored in DynamoDB.
- File Listing: List all files uploaded by the logged-in user, fetched from DynamoDB.
- File Deletion: Delete files from S3 bucket and remove metadata from DynamoDB.
- Share Link Generation: Generate pre-signed S3 URLs for secure file sharing.
- UI Dashboard: Intuitive dashboard for file management with upload, list, share, and delete options.
- Automated Categorization: Use an AI tool to suggest an appropriate category of the files based on content, to enhance organization.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) for a professional and secure feel.
- Background color: Light gray (#F0F2F5) to provide a clean and modern backdrop.
- Accent color: Teal (#009688) to highlight interactive elements and calls to action.
- Body and headline font: 'Inter' for a modern, neutral, and readable experience.
- Use a set of minimalistic, consistent icons from a library like Font Awesome to represent file types and actions.
- Clean and responsive layout using Bootstrap, with clear separation of file listings and controls.
- Subtle animations and transitions for file uploads, deletions, and share link generation.