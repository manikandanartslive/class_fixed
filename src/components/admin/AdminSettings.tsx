import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateAdminCreds, setBillingDays, getBillingDays, setUpiQR, getUpiQR } from '@/lib/storage';
import { toast } from 'sonner';
import { Settings, Upload, Calendar, Key } from 'lucide-react';

export default function AdminSettings() {
  const [currentUpiQR, setCurrentUpiQR] = useState(getUpiQR());

  const handleUpiUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUpiQR(result);
      setCurrentUpiQR(result);
      toast.success('UPI QR code updated!');
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = () => {
    const username = prompt('Enter new admin username') || 'admin';
    const password = prompt('Enter new admin password');
    
    if (!password) {
      toast.error('Password is required');
      return;
    }

    updateAdminCreds({ username, password });
    toast.success('Admin credentials updated!');
  };

  const handleBillingDays = () => {
    const current = getBillingDays();
    const newDays = prompt(`Enter billing cycle days (current: ${current})`, String(current));
    
    if (!newDays) return;
    
    const numDays = parseInt(newDays, 10);
    if (isNaN(numDays) || numDays <= 0) {
      toast.error('Please enter a valid number');
      return;
    }

    setBillingDays(numDays);
    toast.success(`Billing cycle updated to ${numDays} days`);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-none shadow-elevated">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            <CardTitle>UPI QR Code</CardTitle>
          </div>
          <CardDescription>Upload QR code for student payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentUpiQR && (
            <div className="p-4 bg-white rounded-lg shadow-soft">
              <img src={currentUpiQR} alt="Current UPI QR" className="max-w-[200px] w-full mx-auto" />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="upi-upload">Upload New QR Code</Label>
            <Input
              id="upi-upload"
              type="file"
              accept="image/*"
              onChange={handleUpiUpload}
              className="cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-elevated">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            <CardTitle>Admin Credentials</CardTitle>
          </div>
          <CardDescription>Change admin username and password</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleChangePassword} className="w-full">
            Change Admin Password
          </Button>
        </CardContent>
      </Card>

      <Card className="border-none shadow-elevated">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <CardTitle>Billing Cycle</CardTitle>
          </div>
          <CardDescription>Set subscription duration in days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Current billing cycle</p>
            <p className="text-2xl font-bold mt-1">{getBillingDays()} days</p>
          </div>
          
          <Button onClick={handleBillingDays} className="w-full">
            Update Billing Days
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
