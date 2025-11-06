import { Header } from "@/components/shared/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export default function Home() {
  const dashboardImage = PlaceHolderImages.find(p => p.id === 'landing-dashboard');
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        
        <section className="py-20 sm:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                Visualize Your Workflow
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Our intuitive dashboard makes file management a breeze.
              </p>
            </div>
            <div className="mt-16">
              {dashboardImage && (
                <Image
                  src={dashboardImage.imageUrl}
                  alt={dashboardImage.description}
                  data-ai-hint={dashboardImage.imageHint}
                  width={1200}
                  height={750}
                  className="rounded-xl shadow-2xl ring-1 ring-foreground/10 mx-auto"
                />
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Atifs Binary container Cloud. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
