import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full bg-[#0a0e14]/80 backdrop-blur-md border-b border-slate-800/50">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                
                {/* Logo */}
                <Link href="/" className="text-2xl font-light tracking-widest text-white uppercase hover:opacity-80 transition-opacity">
                    Eate Up
                </Link>

                {/* Right Side Actions */}
                <div className="flex items-center gap-6">
                    {/* User Profile / Admin Link */}
                    <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors tracking-wide">
                        Sign In
                    </Link>

                    {/* Cart Button */}
                    <button className="relative flex items-center justify-center p-2 text-slate-300 hover:text-white transition-colors group">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        {/* Cart Badge (Shows number of items) */}
                        <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white group-hover:bg-blue-500 transition-colors">
                            0
                        </span>
                    </button>
                </div>
                
            </div>
        </nav>
    );
}