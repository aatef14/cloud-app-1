import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { ArrowRight, Cloud, Lock, Share2 } from "lucide-react";

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'landing-hero');
  return (
    <section className="relative bg-background">
        <div className="container mx-auto px-4 pt-20 pb-16 text-center lg:pt-32">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl font-headline">
                Securely Store & Share Your Files
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                Atifs Binary container Cloud offers a simple, secure, and intelligent platform to manage your digital life. Upload, organize, and share with confidence.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" asChild>
                    <Link href="/signup">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <Link href="/login">
                        Access Your Account
                    </Link>
                </Button>
            </div>
        </div>
    </section>
  );
}
