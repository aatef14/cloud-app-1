# Atif's Storage

Welcome to Atif's Storage, a smart file storage and sharing system built with Next.js, AWS S3, and DynamoDB. This application provides a secure and scalable platform for users to manage their files in the cloud.

## ✨ Features

- **Secure User Authentication**: JWT-based registration and login system.
- **AWS S3 File Storage**: Upload, download, and manage files stored securely in an S3 bucket.
- **AWS DynamoDB Metadata**: File metadata is efficiently stored and retrieved from DynamoDB.
- **AI-Powered Categorization**: Files are automatically categorized on upload using a Genkit AI flow.
- **Secure File Sharing**: Generate temporary, pre-signed URLs to share files securely.
- **Modern Dashboard**: A clean, responsive, and intuitive dashboard for file management.
- **Full-Stack Next.js**: Built entirely with the Next.js App Router, Server Components, and Server Actions.

## 🛠️ Tech Stack

- **Framework**: Next.js (React, TypeScript)
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: JWT (jose), bcryptjs
- **Cloud Storage**: AWS S3
- **Database**: AWS DynamoDB
- **AI**: Google AI (via Genkit)

## ☁️ AWS Setup

Before running the application, you need to set up the following AWS resources:

1.  **S3 Bucket**: Create a new S3 bucket to store the uploaded files.
2.  **DynamoDB Tables**: Create two DynamoDB tables:
    *   **`FileZenCloudUsers`**:
        *   Partition Key: `username` (String)
    *   **`FileZenCloudFiles`**:
        *   Partition Key: `username` (String)
        *   Sort Key: `fileName` (String)
3.  **IAM Role (for EC2 Deployment)**: Create an IAM role for your EC2 instance with policies that grant permissions for S3 (`GetObject`, `PutObject`, `DeleteObject`) and DynamoDB (`GetItem`, `PutItem`, `DeleteItem`, `Query`, `Scan`) for the resources you created. This is the most secure method.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd filezen-cloud
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project and add the following environment variables.

For production deployment on EC2, you should use an IAM Role and only need to set the `AWS_REGION` and `S3_BUCKET_NAME`. For local development, you will also need to provide your AWS credentials.

```env
# AWS Configuration
AWS_REGION=YOUR_AWS_REGION
S3_BUCKET_NAME=your-s3-bucket-name

# For local development ONLY. Do not use these in production.
# AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY


# JWT Secret
JWT_SECRET_KEY=generate-a-strong-secret-key # Should be at least 32 characters long

# Google AI API Key (for Genkit)
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
```

### 4. Run the development server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

## 📂 Project Structure

```
.
├── src/
│   ├── app/                # Next.js App Router pages and layouts
│   │   ├── (auth)/         # Auth-related pages (login, signup)
│   │   ├── dashboard/      # Protected dashboard pages
│   │   ├── api/            # API routes (if any)
│   │   ├── globals.css     # Global styles
│   │   └── layout.tsx      # Root layout
│   │   └── page.tsx        # Landing page
│   ├── components/         # Reusable React components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── landing/
│   │   └── ui/             # shadcn/ui components
│   ├── lib/                # Helper functions and utilities
│   │   ├── actions.ts      # Server Actions
│   │   ├── auth.ts         # Authentication logic (JWT, cookies)
│   │   ├── aws.ts          # AWS SDK interaction logic
│   │   └── definitions.ts  # TypeScript type definitions
│   ├── ai/                 # Genkit AI flows
│   └── middleware.ts       # Authentication middleware
├── public/                 # Static assets
└── tailwind.config.ts      # Tailwind CSS configuration
```
