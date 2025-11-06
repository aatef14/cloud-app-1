'use client';

import { useState } from 'react';
import { MoreHorizontal, File, Share2, Trash2, Copy, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { FileMetadata } from '@/lib/definitions';
import { deleteFile, shareFile } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


export function FilesTable({ files, username }: { files: FileMetadata[], username: string }) {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);


  const handleShare = async (fileName: string) => {
    setSharingId(fileName);
    const result = await shareFile(username, fileName);
    if (result.url) {
      await navigator.clipboard.writeText(result.url);
      toast({ title: 'Link Copied', description: 'A shareable link has been copied to your clipboard.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setSharingId(null);
  };

  const handleDelete = async (fileName: string) => {
    setDeletingId(fileName);
    const result = await deleteFile(username, fileName);
    if (result.success) {
      toast({ title: 'File Deleted', description: `"${fileName}" has been permanently deleted.` });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setDeletingId(null);
  };

  if (files.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-10 text-center w-full">
            <File className="h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No files yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">Upload your first file to get started.</p>
        </div>
    );
  }

  return (
    <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.fileName}>
                <TableCell className="font-medium flex items-center gap-2">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span>{file.fileName}</span>
                </TableCell>
                <TableCell>
                    <Badge variant="secondary">{file.suggestedCategory}</Badge>
                </TableCell>
                <TableCell>{formatBytes(file.fileSize)}</TableCell>
                <TableCell>{format(new Date(file.uploadDate), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => handleShare(file.fileName)}>
                            {sharingId === file.fileName ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Share2 className="mr-2 h-4 w-4" />
                            )}
                           <span>Share</span>
                        </DropdownMenuItem>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                    {deletingId === file.fileName ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="mr-2 h-4 w-4" />
                                    )}
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to delete this file?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete "{file.fileName}".
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(file.fileName)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
}
