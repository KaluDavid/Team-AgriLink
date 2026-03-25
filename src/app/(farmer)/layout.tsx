import { Navbar } from "../../components/common/NavBar";
import { FarmerSidebar } from "../../components/layout/FarmerSidebar";

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background ">
      <Navbar />
      <div className="flex">
        <FarmerSidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
