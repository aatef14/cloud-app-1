import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Share2, BrainCircuit, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <UploadCloud className="h-8 w-8 text-primary" />,
    title: "Effortless Uploads",
    description: "Drag and drop your files to securely upload them to our cloud infrastructure, powered by AWS S3.",
  },
  {
    icon: <Share2 className="h-8 w-8 text-primary" />,
    title: "Secure Sharing",
    description: "Generate time-limited, secure links to share your files with anyone, anywhere.",
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: "AI-Powered Organization",
    description: "Our smart system automatically suggests categories for your files, making organization a breeze.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Robust Security",
    description: "With JWT-based authentication and industry-standard encryption, your files are always protected.",
  },
];

export function Features() {
  return (
    <section className="py-20 sm:py-32 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                Everything You Need, Nothing You Don't
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Atif's Storage is packed with features to streamline your file management.
            </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {feature.icon}
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold leading-6 text-foreground font-headline">{feature.title}</h3>
                <p className="mt-2 text-base leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
