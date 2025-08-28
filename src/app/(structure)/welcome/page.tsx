'use client';

import Image from "next/image";
import { useAuth } from "../../../contexts/AuthContext";
import { ProtectedRoute } from "../../../../components/auth/ProtectedRoute";
import { Button } from "../../../../components/ui/button";

function HomeContent() {
    const { user } = useAuth();

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <div className="absolute top-4 right-4 flex items-center gap-4">
                <span className="text-sm">
                    Welcome, {user?.name}!
                </span>
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <ProtectedRoute>
            <HomeContent />
        </ProtectedRoute>

    );
}
