'use client';

import { useAuth } from "../../../contexts/AuthContext";
import { ProtectedRoute } from "../../../../components/auth/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

function HomeContent() {
    const { user, logout } = useAuth();

    return (
        <div className="font-sans min-h-screen flex items-center justify-center p-8 sm:p-20">
            <Card className="w-full max-w-md shadow-xl rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                        Welcome, {user?.name ?? "Guest"} 👋
                    </CardTitle>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer">
                                <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={logout} className="flex items-center gap-2">
                                <LogOut className="h-4 w-4" /> Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>

                <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">
                        You are now logged in and can access your dashboard.
                    </p>
                    <Button variant="default" className="w-full">
                        Go to Dashboard
                    </Button>
                </CardContent>
            </Card>
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
