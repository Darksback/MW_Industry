import { Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8 max-w-4xl text-center">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-8">
        <Shield className="h-10 w-10" />
      </div>
      <h1 className="font-bebas text-5xl md:text-6xl tracking-wide text-foreground mb-8">
        About MW Industry
      </h1>
      <div className="text-lg text-muted-foreground space-y-6 text-left">
        <p>
          Founded on the principle of absolute security, MW Industry is a global leader in intelligent access control systems. We engineer solutions that combine cutting-edge biometric technology with industrial-grade hardware.
        </p>
        <p>
          Our mission is to provide uncompromising protection for residential, commercial, and industrial environments without sacrificing user convenience.
        </p>
      </div>
    </div>
  );
}
