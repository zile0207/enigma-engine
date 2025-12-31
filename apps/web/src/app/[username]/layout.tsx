export default async function UsernameLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}>) {
  const { username } = await params;

  return (
    <div className="min-h-screen">
      {/* Main Content Wrapper */}
      {children}
    </div>
  );
}
