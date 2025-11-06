import Link from "next/link";
import { AtifsBinaryContainerLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <AtifsBinaryContainerLogo className="h-6 w-6 text-primary" />
          <span className="font-headline">Atifs Binary container Cloud</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
