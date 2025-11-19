import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Calendar, Star } from 'lucide-react';
import { Student, addAssignment, getAssignmentsByStudent } from '@/lib/storage';
import { toast } from 'sonner';

export default function Assignments() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
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
    loadAssignments(studentData.username);
  }, [navigate]);

  const loadAssignments = (username: string) => {
    setAssignments(getAssignmentsByStudent(username));
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!student) return;
    
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result as string;
      
      addAssignment({
        studentUsername: student.username,
        studentName: student.name,
        grade: student.grade,
        imageData
      });

      toast.success('Assignment uploaded successfully!');
      loadAssignments(student.username);
    };
    reader.readAsDataURL(file);
  };

  if (!student) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-none shadow-elevated">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl">My Assignments</CardTitle>
          </div>
          <CardDescription>Upload your drawings and get feedback from your teacher</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="assignment">Upload New Assignment</Label>
            <div className="flex items-center gap-2">
              <Input
                id="assignment"
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="cursor-pointer"
              />
              <Upload className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Supported formats: JPG, PNG, WEBP
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Your Submissions</h3>
        
        {assignments.length === 0 ? (
          <Card className="border-none shadow-soft">
            <CardContent className="py-8 text-center text-muted-foreground">
              No assignments uploaded yet. Upload your first drawing above!
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="border-none shadow-soft hover:shadow-elevated transition-smooth">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={assignment.imageData}
                        alt="Assignment"
                        className="w-full md:w-48 h-48 object-cover rounded-lg shadow-soft"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">Assignment #{assignment.id.slice(-6)}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(assignment.uploadDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {assignment.grade_score ? (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-accent text-accent" />
                            {assignment.grade_score}/10
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending Review</Badge>
                        )}
                      </div>
                      
                      {assignment.feedback && (
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-1">Teacher's Feedback:</p>
                          <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
