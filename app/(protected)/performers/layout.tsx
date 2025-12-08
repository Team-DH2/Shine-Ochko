import { Header } from "@/components/us/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative w-full">
      {/* Position Header on top of the content */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Header />
      </div>
      {/* Main content area becomes the scroll container */}
      <main>{children}</main>
    </div>
  );
}
