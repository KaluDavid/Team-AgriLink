import { Navbar } from "../../components/common/NavBar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
