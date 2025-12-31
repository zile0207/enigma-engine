import { TabBar } from "@/components/tab-bar";

export default async function UsernameLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}>) {
  const { username } = await params;

  return (
    <>
      <TabBar />

      {/* Main Content Wrapper */}
      <div className="mt-10 min-h-screen">{children}</div>
    </>
  );
}
