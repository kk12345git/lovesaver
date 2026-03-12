"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    TrendingUp,
    Receipt,
    Target,
    Lightbulb,
    Star,
} from "lucide-react";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { href: "/income", icon: TrendingUp, label: "Income" },
    { href: "/expenses", icon: Receipt, label: "Expenses" },
    { href: "/goals", icon: Star, label: "Goals" },
    { href: "/insights", icon: Lightbulb, label: "Insights" },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-lg mx-auto">
            <div className="mx-4 mb-4 bg-white/90 backdrop-blur-2xl rounded-3xl border border-pink-100/60 shadow-2xl shadow-pink-200/40 px-2 py-2">
                <div className="flex items-center justify-around">
                    {navItems.map(({ href, icon: Icon, label }) => {
                        const isActive = pathname === href || pathname.startsWith(href + "/");
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200 min-w-[52px] ${
                                    isActive
                                        ? "text-pink-500 bg-pink-50"
                                        : "text-gray-400 hover:text-pink-400"
                                }`}
                            >
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                                <span className={`text-[10px] ${isActive ? "font-black" : "font-semibold"}`}>
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
