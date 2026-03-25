"use client";

import { useState } from "react";
import { useAllUsers, useSuspendUserMutation } from "@/queries/users.queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/lib/utils";
import { Search, UserX } from "lucide-react";

export default function AdminUsersPage() {
  const { data: users = [], isLoading } = useAllUsers();
  const suspendUser = useSuspendUserMutation();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (roleFilter === "all" || u.role === roleFilter);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Users Management</h1>
        <p className="text-muted-foreground text-[15px]">
          View and manage all platform users
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10! input-large h-12!"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-50! cursor-pointer input-large h-12!">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent className="p-1.5">
            <SelectItem value="all" className="p-2 cursor-pointer">
              All Roles
            </SelectItem>
            <SelectItem value="farmer" className="p-2 cursor-pointer">
              Farmers
            </SelectItem>
            <SelectItem value="buyer" className="py-3 px-2 cursor-pointer">
              Buyers
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {["User", "Email", "Role", "Location", "Joined", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className={`p-4 text-sm font-medium text-muted-foreground ${h === "Actions" ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="*:text-sm">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="p-4">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                : filtered.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-sm font-semibold text-primary">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="p-4">
                        <StatusBadge
                          status={
                            user.role === "farmer" ? "active" : "accepted"
                          }
                        />
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {user.location}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => suspendUser.mutate(user.id)}
                          disabled={suspendUser.isPending}
                          className="cursor-pointer flex items-center"
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Suspend
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {users.length} users
      </p>
    </div>
  );
}
