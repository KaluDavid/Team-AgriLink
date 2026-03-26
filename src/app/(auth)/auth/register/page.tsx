"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/types";
import {
  Sprout,
  Eye,
  EyeOff,
  Tractor,
  ShoppingCart,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState<UserRole>("farmer");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(name, email, password, role, location);
      toast.success("Account created!", {
        description: `Welcome to AgriMarket as a ${role}.`,
      });
      router.push(
        role === "farmer" ? ROUTES.FARMER.DASHBOARD : ROUTES.BUYER.MARKETPLACE,
      );
    } catch (err: unknown) {
      toast.error("Signup failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex top-0 left-0 w-full">
      <div className="flex-1 flex items-center w-full justify-center p-8 overflow-auto">
        <div className="w-full max-w-md overflow-y-scroll space-y-8 border px-8 shadow-sm rounded-md py-10">
          <div className="text-center">
            <Link
              href={ROUTES.HOME}
              className="inline-flex items-center gap-2 mb-8"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Sprout className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-2xl">AgriMarket</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Create your account</h1>
            <p className="text-muted-foreground">
              Join thousands of farmers and buyers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role selector */}
            <div className="space-y-3">
              <Label className="text-base">I want to</Label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    value: "farmer" as UserRole,
                    icon: Tractor,
                    label: "Sell Produce",
                    sub: "I'm a Farmer",
                  },
                  {
                    value: "buyer" as UserRole,
                    icon: ShoppingCart,
                    label: "Buy Produce",
                    sub: "I'm a Buyer",
                  },
                ].map(({ value, icon: Icon, label, sub }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    className={cn(
                      "relative flex cursor-pointer flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all",
                      role === value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        role === value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-semibold">{label}</span>
                    <span className="text-xs text-muted-foreground">{sub}</span>
                    {role === value && (
                      <Check className="h-5 w-5 text-primary absolute top-3 right-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {[
              {
                id: "name",
                label: "Full Name",
                type: "text",
                placeholder: "Enter your full name",
                value: name,
                onChange: setName,
              },
              {
                id: "email",
                label: "Email",
                type: "email",
                placeholder: "Enter your email",
                value: email,
                onChange: setEmail,
              },
              {
                id: "location",
                label: "Location",
                type: "text",
                placeholder: "e.g. Lagos, Nigeria",
                value: location,
                onChange: setLocation,
              },
            ].map(({ id, label, type, placeholder, value, onChange }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={id} className="text-base">
                  {label}
                </Label>
                <Input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="input-large"
                  required
                />
              </div>
            ))}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-large pr-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={ROUTES.LOGIN}
              className="text-primary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Visual side */}
      <div className="hidden lg:flex flex-1 relative gradient-hero items-center justify-center p-12">
        <div className="max-w-md fixed h-screen 2xl:justify-center 2xl:flex 2xl:w-full 2xl:flex-col text-center text-primary-foreground">
          <Sprout className="h-20 w-20 mx-auto mb-8 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg text-primary-foreground/80">
            Whether you&apos;re a farmer looking to sell or a buyer seeking
            quality produce, AgriMarket connects you to the right people.
          </p>
        </div>
      </div>
    </div>
  );
}
