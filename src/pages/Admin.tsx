import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Video, Upload, Settings } from 'lucide-react';
import { getAdminCreds } from '@/lib/storage';
import AdminStudents from '@/components/admin/AdminStudents';
import AdminVideos from '@/components/admin/AdminVideos';
import AdminAssignments from '@/components/admin/AdminAssignments';
import AdminSettings from '@/components/admin/AdminSettings';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const creds = getAdminCreds();
    if (username === creds.username && password === creds.password) {
      setIsLoggedIn(true);
    } else {
      setError('Invalid admin credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="border-none shadow-elevated">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-secondary flex items-center justify-center mb-4 shadow-elevated">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-username">Admin Username</Label>
                <Input
                  id="admin-username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Admin Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-elevated bg-gradient-secondary text-white">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">Admin Dashboard</CardTitle>
              <CardDescription className="text-white/80 mt-2">
                Manage students, videos, and assignments
              </CardDescription>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="students" className="gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Students</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="gap-2">
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Videos</span>
          </TabsTrigger>
          <TabsTrigger value="assignments" className="gap-2">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Assignments</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <AdminStudents />
        </TabsContent>

        <TabsContent value="videos">
          <AdminVideos />
        </TabsContent>

        <TabsContent value="assignments">
          <AdminAssignments />
        </TabsContent>

        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
