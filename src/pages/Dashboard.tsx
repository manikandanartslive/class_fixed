import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Video, FileText, CreditCard, Calendar } from 'lucide-react';
import { Student, calcExpiryInfo, getVideosForGrade, getAssignmentsByStudent } from '@/lib/storage';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [videos, setVideos] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    const currentStudent = localStorage.getItem('currentStudent');
    if (!currentStudent) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    const studentData = JSON.parse(currentStudent) as Student;
    setStudent(studentData);
    setVideos(getVideosForGrade(studentData.grade));
    setAssignments(getAssignmentsByStudent(studentData.username));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentStudent');
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!student) return null;

  const expiryInfo = student.activationDate ? calcExpiryInfo(student.activationDate) : null;

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-elevated bg-gradient-hero text-white">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">Welcome, {student.name}!</CardTitle>
              <CardDescription className="text-white/80 mt-2">
                Class: {student.grade}
              </CardDescription>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {expiryInfo && expiryInfo.remaining > 0 ? (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Subscription active - {expiryInfo.remaining} days remaining</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Subscription expired - Please renew</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-soft hover:shadow-elevated transition-smooth">
          <CardHeader>
            <Button variant="outline" onClick={() => navigate('/assignments')} className="w-fit">
              <FileText className="w-4 h-4 mr-2" />
              My Assignments
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {assignments.length} assignment(s) uploaded
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-soft hover:shadow-elevated transition-smooth">
          <CardHeader>
            <Button variant="outline" onClick={() => navigate('/payment')} className="w-fit">
              <CreditCard className="w-4 h-4 mr-2" />
              Make Payment
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Renew or extend your subscription
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-elevated">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            <CardTitle>Recorded Lessons</CardTitle>
          </div>
          <CardDescription>Access all video lessons for your class</CardDescription>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No videos available yet for your class
            </div>
          ) : (
            <div className="grid gap-3">
              {videos.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-smooth group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-smooth">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Lesson {idx + 1}</p>
                    <p className="text-sm text-muted-foreground">Click to watch</p>
                  </div>
                  <Badge variant="secondary">Watch</Badge>
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
