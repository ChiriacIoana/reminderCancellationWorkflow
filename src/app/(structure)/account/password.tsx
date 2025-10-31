import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { authService } from "@/src/api/auth";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changing, setChanging] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

console.log("Form submitted");
  console.log("Current password ", currentPassword); 
  console.log("New password ", newPassword);

    setChanging(true);

    try {
      await authService.changePassword(currentPassword, newPassword);
      alert("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      console.error("Password change failed:", err.message);
      alert(err.message || "Failed to change password");
    } finally {
      setChanging(false);
    }
  };

  return (
    <form onSubmit={handlePasswordChange}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </CardContent>

        <CardFooter className="pt-4">
          <Button type="submit" disabled={changing}>
            {changing ? "Updating..." : "Update Password"}
          </Button>
        </CardFooter>
    </form>
  );
}