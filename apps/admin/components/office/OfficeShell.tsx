import Sidebar from "@/components/office/Sidebar";
import TopBar from "@/components/office/TopBar";

export default function OfficeShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh gap-4 bg-[#F4F1FB] p-4 text-[#171717]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <TopBar />
        {children}
      </div>
    </div>
  );
}
