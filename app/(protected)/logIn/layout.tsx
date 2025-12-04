export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative w-full">
      {/* Position Header on top of the content */}

      {/* Main content area becomes the scroll container */}
      <main className="h-screen w-screen overflow-y-auto">{children}</main>
    </div>
  );
}
