import { useEffect, useState } from "react";
import { Card, CardContent } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { authService, TokenManager, User } from "@/src/api/auth";
import { apiService } from "@/src/api/api";

export default function ProfileForm() {
  const [user, setUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = TokenManager.getUser()
    if (storedUser) {
      setUser(storedUser)
      setLoading(false)
    } else {
      authService
        .getCurrentUser()
        .then(setUser)
        .catch((err) => console.error("Failed to fetch user", err))
        .finally(() => setLoading(false))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return
    setUser({ ...user, [e.target.id]: e.target.value })
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return;
  setSaving(true);

  try {
    const updatedUser = await authService.updateProfile({
      name: user.name,
      email: user.email,
    });
      console.log("Updated user received:", updatedUser);

    // Update local storage and state
    TokenManager.setUser(updatedUser);
    setUser(updatedUser);

    alert("Profile updated successfully");
  } catch (err: any) {
    console.error("Update failed:", err.response?.data || err.message);
    alert("Failed to update profile");
  } finally {
    setSaving(false);
  }
};


  if (loading) return <p>Loading user info...</p>

  return (
    <form onSubmit={handleSubmit} className="mb-8">
    <div className="grid gap-4 space-y-4 sm:grid-cols-2">
    
        <div className="flex flex-col space-y-2 m-4 ml-7">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={user?.name || ""}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
            <div className="flex flex-col space-y-2 m-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                onChange={handleChange}
                placeholder="john@example.com"
              />
            </div>
             <div className="p-4">
            <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
          </div>
        </form>
      
  )
}
