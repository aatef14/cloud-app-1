'use client';

import { useRef, useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { UploadCloud } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadFile } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

function SubmitButton({ isFileSelected }: { isFileSelected: boolean }) {
  return (
    <Button type="submit" disabled={!isFileSelected}>
      Upload File
    </Button>
  );
}

export function FileUploader({ username }: { username: string }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [state, formAction] = useFormState(uploadFile, null);
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormAction = async (formData: FormData) => {
    setIsUploading(true);
    setProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);

    await formAction(formData);

    clearInterval(progressInterval);
    setProgress(100);
    setIsUploading(false);
  };

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast({ title: 'Success', description: state.success });
      router.refresh();
      setOpen(false);
      setFile(null);
      formRef.current?.reset();
      setProgress(0);
    }
    if (state.error) {
      toast({ variant: 'destructive', title: 'Error', description: state.error });
      setProgress(0);
    }
  }, [state, toast, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload a new file</DialogTitle>
          <DialogDescription>
            Select a file from your device. Max file size is 10MB.
          </DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          action={handleFormAction}
          className="grid gap-4 py-4"
        >
          <input type="hidden" name="username" value={username} />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              File
            </Label>
            <Input
              id="file"
              name="file"
              type="file"
              required
              className="col-span-3"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={isUploading}
            />
          </div>
           {isUploading && (
              <div className="px-1">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2 text-center">Uploading {file?.name}...</p>
              </div>
            )}
          <DialogFooter>
             <DialogClose asChild>
                <Button variant="outline" disabled={isUploading}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={!file || isUploading}>
              {isUploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
