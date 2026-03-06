"use client";

import { logout } from "@/app/auth/actions";
import { LogOut } from "lucide-react";
import { useState } from "react";

export default function LogoutButton() {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await logout();
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/50 border border-white/40 shadow-sm hover:bg-white transition-all text-pink-500"
            title="Log Out"
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-pink-400/30 border-t-pink-500 rounded-full animate-spin" />
            ) : (
                <LogOut size={18} strokeWidth={2.5} />
            )}
        </button>
    );
}
