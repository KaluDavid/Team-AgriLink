"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "../components/common/NavBar";
import { ListingCard } from "@/components/farmer/ListingCard";
import { mockListings, cropImages } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import {
  Sprout,
  ShieldCheck,
  Users,
  ArrowRight,
  Leaf,
  HandCoins,
  TrendingUp,
  MapPin,
} from "lucide-react";

export default function LandingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    switch (user.role) {
      case "farmer":
        router.replace(ROUTES.FARMER.DASHBOARD);
        break;
      case "buyer":
        router.replace(ROUTES.BUYER.MARKETPLACE);
        break;
      case "admin":
        router.replace(ROUTES.ADMIN.DASHBOARD);
        break;
    }
  }, [isAuthenticated, user, router]);

  const featuredListings = mockListings
    .filter((l) => l.status === "active")
    .slice(0, 3);

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen *:flex *:flex-col *:justify-center *:items-center bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-[url('/hero-farm.jpg')]">
          <div className="absolute inset-0 bg-linear-to-r from-primary/95 via-primary/85 to-primary/70" />
        </div>
        <div className="container relative py-20 md:py-32 lg:py-40">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
              <Leaf className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">
                Farm-to-Market, Direct
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Connect. Trade.<span className="block">Grow Together.</span>
            </h1>
            <p className="text-md md:text-lg text-white/85 max-w-lg">
              The trusted marketplace where farmers list produce and buyers
              purchase directly. Secure payments, fair prices, no middlemen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="hover:bg-white text-white bg-gradient-hero font-semibold shadow-lg px-8 py-5.5"
              >
                <Link href={ROUTES.REGISTER}>
                  Start Selling <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-accent hover:border-black hover:!bg-white text-accent-foreground border-white/50 border  font-semibold px-8 py-5.5"
              >
                <Link href={ROUTES.BUYER.MARKETPLACE}>Browse Produce</Link>
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              {[
                { v: "500+", l: "Farmers" },
                { v: "1,200+", l: "Buyers" },
                { v: "₦50M+", l: "Traded" },
              ].map((s, i, a) => (
                <div key={s.l} className="flex items-center gap-8">
                  <div className="text-white">
                    <div className="text-2xl font-bold">{s.v}</div>
                    <div className="text-sm text-white/70">{s.l}</div>
                  </div>
                  {i < a.length - 1 && (
                    <div className="h-10 w-px bg-white/20" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Simple, secure, and straightforward trading for everyone
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sprout,
                title: "List Your Produce",
                desc: "Farmers add crops with quantity, price, and location. Takes less than 2 minutes.",
              },
              {
                icon: Users,
                title: "Find & Order",
                desc: "Buyers browse listings, compare prices, and place orders in just 3 clicks.",
              },
              {
                icon: ShieldCheck,
                title: "Secure Payment",
                desc: "Escrow protects both parties. Payment releases only when delivery is confirmed.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center space-y-4 p-6">
                <div className="mx-auto w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title mb-2">Fresh Produce</h2>
              <p className="text-muted-foreground">
                Browse the latest from our farmers
              </p>
            </div>
            <Button className="bg-white py-5 border px-4 text-foreground *:flex *:gap-2 *:items-center ">
              <Link href={ROUTES.BUYER.MARKETPLACE}>
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 md:py-24 gradient-hero">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Farmers & Buyers Trust Us
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Escrow Protection",
                desc: "Your money is safe. Payments only release when both parties confirm delivery.",
              },
              {
                icon: HandCoins,
                title: "Fair Prices",
                desc: "No hidden fees, no middlemen. Farmers set prices, buyers get fair deals.",
              },
              {
                icon: TrendingUp,
                title: "Easy to Use",
                desc: "Designed for everyone. Simple navigation, clear actions, works on any phone.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <Icon className="h-10 w-10 text-white mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  {title}
                </h3>
                <p className="text-white/80 text-[15px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="bg-secondary rounded-3xl p-8 md:p-12 text-center">
            <h2 className="section-title mb-4">Ready to Start Trading?</h2>
            <p className="text-muted-foreground text-base mb-8 max-w-xl mx-auto">
              Join thousands of farmers and buyers already using AgriLink to
              grow their business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8 py-5.5">
                <Link href={ROUTES.REGISTER}>
                  Create Account <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="hover:!bg-accent bg-white text-accent-foreground border-white/50 font-semibold px-8 py-5.5"
              >
                <Link href={ROUTES.LOGIN}>I Already Have an Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sprout className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">AgriLink</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AgriLink. Connecting Farmers &
            Buyers.
          </p>
        </div>
      </footer>
    </div>
  );
}
