import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// FIXED IMPORT PATH: Using forward slashes and relative path
import Navbar from "./_components/Navbar"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Eate Up | Premium Delivery",
    description: "Curated dining, delivered to your door.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-[#0a0e14] text-slate-200 antialiased`}>
                <Navbar />
                {children}
            </body>
        </html>
    );
}