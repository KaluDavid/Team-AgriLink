import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-6">
        <Sprout className="h-8 w-8 text-primary-foreground" />
      </div>
      <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        This page doesn't exist or has been moved.
      </p>
      <Button asChild className="py-5.5 px-8">
        <Link href={ROUTES.HOME}>Back to Home</Link>
      </Button>
    </div>
  );
}
