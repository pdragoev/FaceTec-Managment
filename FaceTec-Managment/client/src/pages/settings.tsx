import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Moon, Sun } from "lucide-react";

export default function Settings() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Sun className="h-5 w-5" />
                <Label htmlFor="theme">Dark Mode</Label>
              </div>
              <Switch id="theme" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Bell className="h-5 w-5" />
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about machine status changes
                  </p>
                </div>
              </div>
              <Switch id="notifications" />
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Notify me about:</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="status-changes">Machine status changes</Label>
                  <Switch id="status-changes" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="brigade-assignments">
                    Brigade assignments
                  </Label>
                  <Switch id="brigade-assignments" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenance-alerts">Maintenance alerts</Label>
                  <Switch id="maintenance-alerts" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Version</span>
              <span className="text-sm">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="text-sm">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
