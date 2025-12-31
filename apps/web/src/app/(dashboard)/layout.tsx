import { Navbar } from "@/components/navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar
        links={[
          { href: "/dashboard/spotify", label: "Dashboard" },
          { href: "/spotify/button", label: "Registry" },
          { href: "/spotify/button", label: "Theme" },
        ]}
      />

      {/* Main Content Wrapper */}
      <div className="mt-14 min-h-screen">{children}</div>
    </>
  );
}
