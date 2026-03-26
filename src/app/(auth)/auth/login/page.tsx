"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, getDashboardPath } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      const from = searchParams.get("from");
      router.push(from ?? getDashboardPath());
    } catch (err: unknown) {
      toast.error("Login failed", {
        description:
          (err instanceof Error ? err.message : String(err)) ||
          "An error occurred while trying to log in. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center w-full justify-center p-8 overflow-auto">
        <div className="w-full max-w-md overflow-y-scroll space-y-8">
          <div className="text-center">
            <Link
              href={ROUTES.HOME}
              className="inline-flex items-center gap-2 mb-8"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl">AgriLink</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-large"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-large pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-base cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.REGISTER}
              className="text-primary font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 gradient-hero overflow-y-hidden items-center justify-center p-12">
        <div className="max-w-md text-center text-white">
          <Sprout className="h-20 w-20 mx-auto mb-8 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Farm Fresh, Direct</h2>
          <p className="text-base text-white/80">
            Connect with farmers and buyers across the country. Trade with
            confidence using our secure escrow system.
          </p>
        </div>
      </div>
    </div>
  );
}
