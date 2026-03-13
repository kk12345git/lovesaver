"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Settings,
    Target,
    Lightbulb,
    Star,
} from "lucide-react";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { href: "/vision",    icon: Star,            label: "Vision" },
    { href: "/goals",     icon: Target,           label: "Goals" },
    { href: "/insights",  icon: Lightbulb,        label: "Insights" },
    { href: "/settings",  icon: Settings,         label: "Settings" },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-40 max-w-lg mx-auto w-full bg-white/95 backdrop-blur-2xl border-t border-pink-100/60 shadow-[0_-8px_30px_rgba(255,192,203,0.3)] pb-[env(safe-area-inset-bottom,0px)]"
        >
            <div className="px-2 py-1.5 flex items-center justify-around w-full">
                {navItems.map(({ href, icon: Icon, label }) => {
                        const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-2xl transition-all duration-200 flex-1 min-h-[52px] justify-center ${
                                    isActive
                                        ? "text-pink-500 bg-pink-50"
                                        : "text-gray-400 active:bg-gray-50"
                                }`}
                            >
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                                <span className={`text-[9px] leading-none mt-0.5 ${isActive ? "font-black" : "font-semibold"}`}>
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
            </div>
        </nav>
    );
}
