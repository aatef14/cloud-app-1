export type User = {
  username: string;
  passwordHash: string;
};

export type FileMetadata = {
  username: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadDate: string;
  suggestedCategory: string;
};

export type SessionPayload = {
  username: string;
  expiresAt: Date;
};
