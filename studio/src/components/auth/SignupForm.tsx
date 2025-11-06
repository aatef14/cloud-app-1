'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signup } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
       {pending ? 'Creating Account...' : <><UserPlus className="mr-2 h-4 w-4" /> Create Account</>}
    </Button>
  );
}

export function SignupForm() {
  const [state, formAction] = useFormState(signup, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" placeholder="your_username" required />
        {state?.error?.username && (
          <p className="text-sm text-destructive">{state.error.username[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
         {state?.error?.password && (
          <p className="text-sm text-destructive">{state.error.password[0]}</p>
        )}
      </div>
      
      {state?.message && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <SubmitButton />
    </form>
  );
}
