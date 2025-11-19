import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn } from 'lucide-react';
import { getStudents, calcExpiryInfo, saveStudents } from '@/lib/storage';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = () => {
    const user = prompt('Enter your username for password reset');
    if (!user) return;
    
    const students = getStudents();
    const student = students.find(s => s.username === user);
    
    if (!student) {
      toast.error('Username not found');
      return;
    }
    
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expires = Date.now() + 5 * 60 * 1000;
    localStorage.setItem(`otp_${user}`, JSON.stringify({ otp, expires }));
    
    toast.success(`OTP for ${user}: ${otp} (Demo - valid for 5 minutes)`);
    
    const enteredOtp = prompt('Enter the OTP');
    if (!enteredOtp) return;
    
    const rec = JSON.parse(localStorage.getItem(`otp_${user}`) || 'null');
    if (!rec || Date.now() > rec.expires) {
      toast.error('OTP expired');
      return;
    }
    
    if (enteredOtp.trim() !== rec.otp) {
      toast.error('Incorrect OTP');
      return;
    }
    
    const newPass = prompt('Enter new password');
    if (!newPass) return;
    
    const idx = students.findIndex(s => s.username === user);
    if (idx !== -1) {
      students[idx].pass = newPass;
      saveStudents(students);
      localStorage.removeItem(`otp_${user}`);
      toast.success('Password reset successful!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const students = getStudents();
    const found = students.find(s => s.username === username && s.pass === password);

    if (!found) {
      setError('Incorrect username or password');
      setLoading(false);
      return;
    }

    // Ensure activationDate exists if activated
    if (found.activated && !found.activationDate) {
      found.activationDate = new Date().toISOString();
      found.lastPaymentDate = found.activationDate;
      saveStudents(students);
    }

    // Check expiry
    if (found.activationDate) {
      const info = calcExpiryInfo(found.activationDate);
      if (info.remaining <= 0) {
        found.activated = false;
        saveStudents(students);
        setError('Your subscription has expired. Please renew.');
        setLoading(false);
        return;
      }
    }

    if (!found.activated) {
      setError('Your account is not activated yet. Please pay and wait for admin approval.');
      setLoading(false);
      return;
    }

    // Store current student in localStorage for session
    localStorage.setItem('currentStudent', JSON.stringify(found));
    toast.success(`Welcome back, ${found.name}!`);
    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-none shadow-elevated">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-hero flex items-center justify-center mb-4 shadow-elevated">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Student Login</CardTitle>
          <CardDescription>Access your learning dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button variant="link" className="text-sm" onClick={handleForgotPassword}>
              Forgot password?
            </Button>
          </div>

          <div className="mt-2 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/register')}>
              Register here
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
