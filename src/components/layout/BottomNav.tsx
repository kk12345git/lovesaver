"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    TrendingUp,
    Receipt,
    Tag,
    Target,
    Lightbulb,
} from "lucide-react";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { href: "/income", icon: TrendingUp, label: "Income" },
    { href: "/expenses", icon: Receipt, label: "Expenses" },
    { href: "/budget", icon: Target, label: "Budget" },
    { href: "/insights", icon: Lightbulb, label: "Insights" },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-pink-100 pb-safe max-w-lg mx-auto">
            <div className="flex items-center justify-around px-2 py-2">
                {navItems.map(({ href, icon: Icon, label }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 ${isActive
                                    ? "text-pink-500 bg-pink-50"
                                    : "text-gray-400 hover:text-pink-400"
                                }`}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                            <span className={`text-[10px] font-${isActive ? "700" : "600"}`}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
