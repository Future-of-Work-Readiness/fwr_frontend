import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-display font-bold text-foreground">
            FWR - Future Work Ready
          </h1>
          <p className="text-muted-foreground text-lg">
            Phase 1 Setup Complete - Next.js Foundation
          </p>
        </div>

        {/* Gradient Hero Test */}
        <div className="gradient-hero rounded-xl p-8 text-white">
          <h2 className="text-2xl font-display font-bold mb-4">
            Gradient Hero Test
          </h2>
          <p className="mb-6 opacity-90">
            Testing the UKBAA-inspired navy gradient with custom CSS variables.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button variant="heroOutline">Get Started</Button>
            <Button variant="hero">Learn More</Button>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tailwind Styles</CardTitle>
              <CardDescription>
                CSS variables and theme configuration working correctly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Animations</CardTitle>
              <CardDescription>
                Float, pulse, and fade animations from globals.css.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full bg-primary animate-float" />
                <div className="w-8 h-8 rounded-full bg-cyan animate-pulse-slow" />
                <div className="w-8 h-8 rounded-full gradient-orange animate-glow" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Typography Section */}
        <Card>
          <CardHeader>
            <CardTitle>Font Families</CardTitle>
            <CardDescription>
              Testing Poppins, Inter, Space Mono, and Lora fonts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-display text-lg">
              <strong>Poppins (Display):</strong> The quick brown fox jumps over the lazy dog.
            </p>
            <p className="font-sans text-lg">
              <strong>Inter (Sans):</strong> The quick brown fox jumps over the lazy dog.
            </p>
            <p className="font-mono text-lg">
              <strong>Space Mono:</strong> The quick brown fox jumps over the lazy dog.
            </p>
            <p className="font-serif text-lg">
              <strong>Lora (Serif):</strong> The quick brown fox jumps over the lazy dog.
            </p>
          </CardContent>
        </Card>

        {/* Color Palette Section */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>
              Custom UKBAA-inspired colors and chart colors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <div className="w-12 h-12 rounded-lg bg-primary" title="Primary" />
              <div className="w-12 h-12 rounded-lg bg-secondary" title="Secondary" />
              <div className="w-12 h-12 rounded-lg bg-navy" title="Navy" />
              <div className="w-12 h-12 rounded-lg bg-navy-light" title="Navy Light" />
              <div className="w-12 h-12 rounded-lg bg-orange" title="Orange" />
              <div className="w-12 h-12 rounded-lg bg-orange-light" title="Orange Light" />
              <div className="w-12 h-12 rounded-lg bg-cyan" title="Cyan" />
              <div className="w-12 h-12 rounded-lg bg-muted" title="Muted" />
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm py-8">
          <p>✅ Phase 1 Complete: Next.js App Router • TypeScript • Tailwind CSS • shadcn/ui</p>
        </div>
      </div>
    </main>
  );
}
