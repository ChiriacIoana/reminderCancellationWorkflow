import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/src/components/ui/card';
import { Button } from "@/src/components/ui/button";
import { authService } from "@/src/api/auth";

export default function DeleteForm() {
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your subscriptions."
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      await authService.deleteAccount();
      alert("Account deleted successfully");
      router.push("/login");
    } catch (err: any) {
      console.error("Account deletion failed:", err.message);
      alert(err.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  const handleExportData = async () => {
    setExporting(true);

    try {
      // TODO: Implement export functionality
      alert("Export functionality coming soon!");
    } catch (err: any) {
      console.error("Export failed:", err.message);
      alert("Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  return (
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Delete Account</h4>
            <p className="text-sm text-muted-foreground">
              Permanently remove your account and all subscriptions.
            </p>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Export Data</h4>
            <p className="text-sm text-muted-foreground">
              Download all your tracked subscriptions as a CSV.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleExportData}
            disabled={exporting}
          >
            {exporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </CardContent>
  );
}