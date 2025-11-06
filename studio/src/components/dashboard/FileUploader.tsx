'use client';

import { useRef, useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Uploading...' : 'Upload File'}
    </Button>
  );
}

export function FileUploader({ username }: { username: string }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [state, formAction] = useFormState(uploadFile, null);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  // This is a mock progress, in a real app you'd use a library that supports progress tracking.
  const [progress, setProgress] = useState(0);
  const { pending } = useFormStatus();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pending) {
      setProgress(0);
      let progressValue = 0;
      timer = setInterval(() => {
        progressValue += Math.random() * 10;
        if (progressValue > 95) {
             // Don't complete to 100 until action is done
        } else {
             setProgress(progressValue);
        }
      }, 200);
    }
    return () => {
      if(timer) clearInterval(timer);
    };
  }, [pending]);


  useEffect(() => {
    if (state?.success) {
      toast({ title: 'Success', description: state.success });
      setOpen(false);
      setFile(null);
      formRef.current?.reset();
    }
    if (state?.error) {
      toast({ variant: 'destructive', title: 'Error', description: state.error });
      setProgress(0);
    }
  }, [state, toast]);

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
          action={formAction}
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
            />
          </div>
           {pending && (
              <div className="px-1">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2 text-center">Uploading {file?.name}...</p>
              </div>
            )}
          <DialogFooter>
             <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
