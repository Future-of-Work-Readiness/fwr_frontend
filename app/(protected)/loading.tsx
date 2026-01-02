import { Loader2 } from "lucide-react";

export default function ProtectedLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
        <p className="text-muted-foreground text-sm">Loading your content...</p>
      </div>
    </div>
  );
}

