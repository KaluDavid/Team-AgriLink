"use client";

import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, MapPin, Mail } from "lucide-react";

export default function FarmerProfilePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="section-title">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account details
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {user?.name?.charAt(0)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input defaultValue={user?.name} className="input-large" />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                defaultValue={user?.email}
                className="input-large pl-10"
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                defaultValue={user?.location}
                className="input-large pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm text-muted-foreground">Role:</span>
            <span className="text-sm font-medium capitalize bg-primary/10 text-primary px-3 py-1 rounded-full">
              {user?.role}
            </span>
          </div>

          <Button className="w-full h-12">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
