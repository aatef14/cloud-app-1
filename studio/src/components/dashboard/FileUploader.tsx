'use client';

import { useRef, useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
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


function UploadForm({ username, setOpen }: { username: string, setOpen: (open: boolean) => void }) {
  const [state, formAction] = useFormState(uploadFile, null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const { pending } = useFormStatus();
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (pending) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 95 ? prev : prev + 5));
      }, 200);
      return () => clearInterval(progressInterval);
    }
  }, [pending]);
  
  useEffect(() => {
    if (!state) return;
    
    if (state.success) {
      setProgress(100);
      toast({ title: 'Success', description: state.success });
      router.refresh();
      setOpen(false);
    } else if (state.error) {
      setProgress(0);
      toast({ variant: 'destructive', title: 'Error', description: state.error });
    }
  }, [state, toast, router, setOpen]);


  return (
    <form ref={formRef} action={formAction} className="grid gap-4 py-4">
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
          disabled={pending}
        />
      </div>
      {pending && (
        <div className="px-1">
          <Progress value={progress} className="w-full" />
          <p className="mt-2 text-center text-sm text-muted-foreground">Uploading {file?.name}...</p>
        </div>
      )}
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" disabled={pending}>Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={!file || pending}>
          {pending ? 'Uploading...' : 'Upload File'}
        </Button>
      </DialogFooter>
    </form>
  );
}


export function FileUploader({ username }: { username: string }) {
  const [open, setOpen] = useState(false);

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
        <UploadForm username={username} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
