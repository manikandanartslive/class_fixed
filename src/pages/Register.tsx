import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus } from 'lucide-react';
import { addStudent, findStudentByUsername } from '@/lib/storage';
import { toast } from 'sonner';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    phone: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name || !formData.grade || !formData.phone || !formData.username || !formData.password) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    }

    // Check if username exists
    if (findStudentByUsername(formData.username)) {
      setError('Username already taken');
      setLoading(false);
      return;
    }

    // Add student
    addStudent({
      name: formData.name,
      grade: formData.grade,
      phone: formData.phone,
      username: formData.username,
      pass: formData.password,
      activated: false,
      activationDate: null,
      lastPaymentDate: null
    });

    toast.success('Registration successful! Please make payment for activation.');
    navigate('/payment');
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-none shadow-elevated">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-hero flex items-center justify-center mb-4 shadow-elevated">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Student Registration</CardTitle>
          <CardDescription>Create an account to start learning</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Student Name</Label>
              <Input
                id="name"
                placeholder="Enter student name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Class / Grade</Label>
              <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                <SelectTrigger id="grade">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LKG">LKG</SelectItem>
                  <SelectItem value="UKG">UKG</SelectItem>
                  <SelectItem value="1">1st</SelectItem>
                  <SelectItem value="2">2nd</SelectItem>
                  <SelectItem value="3">3rd</SelectItem>
                  <SelectItem value="4">4th</SelectItem>
                  <SelectItem value="5">5th</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Parent Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Choose a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/login')}>
              Login here
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
