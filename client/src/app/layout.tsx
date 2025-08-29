import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio Dashboard",
  description: "Angel One-like portfolio dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#0b1220] text-gray-100">
        <div className="w-full border-b border-white/10 bg-[#0e1628]/80 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
              <span className="font-semibold tracking-wide">Portfolio</span>
            </div>
            <div className="text-xs text-gray-400">Real-time | 15s refresh</div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
