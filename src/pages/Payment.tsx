import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Upload, Send } from 'lucide-react';
import { getUpiQR } from '@/lib/storage';
import { toast } from 'sonner';

export default function Payment() {
  const [upiQR, setUpiQR] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);

  useEffect(() => {
    setUpiQR(getUpiQR());
  }, []);

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setScreenshot(result);
      localStorage.setItem('lastPaymentScreenshot', result);
      toast.success('Screenshot uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  const handleSendWhatsApp = () => {
    const num = '+919585406124'.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent('Hello, I have made payment for Manikandan Arts drawing class. Please activate my account. Username: [ENTER_YOUR_USERNAME]');
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
    toast.info('WhatsApp opened. Please attach your payment screenshot and send the message.');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-none shadow-elevated">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-hero flex items-center justify-center mb-4 shadow-elevated">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Make Payment</CardTitle>
          <CardDescription>Complete your payment to activate your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h3 className="font-semibold">Payment Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Scan the UPI QR code below</li>
                <li>Make payment as per your child's grade/class</li>
                <li>Take a screenshot of the payment confirmation</li>
                <li>Upload the screenshot here</li>
                <li>Click "Send to WhatsApp" to notify admin</li>
              </ol>
            </div>

            {upiQR ? (
              <div className="flex justify-center p-4 bg-white rounded-lg shadow-soft">
                <img 
                  src={upiQR} 
                  alt="UPI QR Code" 
                  className="max-w-[280px] w-full rounded-lg"
                />
              </div>
            ) : (
              <div className="p-8 text-center bg-muted rounded-lg">
                <p className="text-muted-foreground">UPI QR code will be displayed here once admin uploads it</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="screenshot">Upload Payment Screenshot</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  className="cursor-pointer"
                />
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            {screenshot && (
              <div className="space-y-2">
                <Label>Screenshot Preview</Label>
                <div className="p-4 bg-muted rounded-lg">
                  <img 
                    src={screenshot} 
                    alt="Payment Screenshot" 
                    className="max-w-[280px] w-full rounded-lg mx-auto shadow-soft"
                  />
                </div>
              </div>
            )}

            <Button 
              onClick={handleSendWhatsApp} 
              className="w-full" 
              size="lg"
              disabled={!screenshot}
            >
              <Send className="w-5 h-5 mr-2" />
              Send to WhatsApp
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              After sending, admin will verify your payment and activate your account within 24 hours
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
