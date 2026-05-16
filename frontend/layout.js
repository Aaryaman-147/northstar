import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Northstar | Goal Alignment",
  description: "Enterprise Goal Setting & Tracking Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-center" richColors />
        {/* Global Navigation Bar */}
        <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
          <div className="flex h-16 items-center px-8 max-w-7xl mx-auto justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white font-bold">
                N*
              </div>
              <span className="text-xl font-bold tracking-tight">Northstar</span>
            </div>

            {/* Hackathon Role Switcher */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4 text-sm font-medium text-zinc-500">
                <Link href="/" className="hover:text-zinc-900 transition-colors">
                  Create Goals
                </Link>
                <Link href="/dashboard" className="hover:text-zinc-900 transition-colors">
                  Employee Dashboard
                </Link>
                <div className="h-4 w-px bg-zinc-300" /> {/* Divider */}
                <Link href="/manager" className="hover:text-zinc-900 transition-colors flex items-center gap-2">
                  Manager Portal
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] text-blue-700 font-bold">
                    L1
                  </span>
                </Link>
                <div className="h-4 w-px bg-zinc-300" /> {/* Divider */}
                <Link href="/admin" className="hover:text-zinc-900 transition-colors flex items-center gap-2">
                  Admin Logs
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-[10px] text-purple-700 font-bold">
                    HR
                  </span>
                </Link>
                <div className="h-4 w-px bg-zinc-300" /> {/* Divider */}
                <Link href="/analytics" className="hover:text-zinc-900 transition-colors flex items-center gap-2">
                  Analytics
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-700 font-bold">
                    CXO
                  </span>
                </Link>
              </div>
              
              <Button variant="outline" className="hidden sm:flex border-zinc-200">
                Demo User
              </Button>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}