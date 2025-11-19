import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getAssignments, getAssignmentsByGrade, updateAssignment } from '@/lib/storage';
import { toast } from 'sonner';
import { Star, Calendar, User } from 'lucide-react';

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadAssignments();
  }, [filter]);

  const loadAssignments = () => {
    if (filter === 'ALL') {
      setAssignments(getAssignments());
    } else {
      setAssignments(getAssignmentsByGrade(filter));
    }
  };

  const handleGrade = (assignmentId: string) => {
    const score = prompt('Enter grade (1-10)');
    if (!score) return;

    const numScore = parseInt(score, 10);
    if (isNaN(numScore) || numScore < 1 || numScore > 10) {
      toast.error('Please enter a valid grade between 1 and 10');
      return;
    }

    const feedback = prompt('Enter feedback (optional)') || '';

    updateAssignment(assignmentId, {
      grade_score: numScore,
      feedback
    });

    toast.success('Grade and feedback saved!');
    loadAssignments();
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-soft">
        <CardContent className="pt-6">
          <Label className="mb-2 block">Filter by Class</Label>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'LKG', 'UKG', '1', '2', '3', '4', '5'].map(grade => (
              <Button
                key={grade}
                variant={filter === grade ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(grade)}
              >
                {grade}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {assignments.length === 0 ? (
          <Card className="border-none shadow-soft">
            <CardContent className="py-8 text-center text-muted-foreground">
              No assignments found
            </CardContent>
          </Card>
        ) : (
          assignments.map(assignment => (
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
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold">{assignment.studentName}</span>
                          <Badge variant="outline">{assignment.grade}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                        <Badge variant="outline">Not graded</Badge>
                      )}
                    </div>
                    
                    {assignment.feedback && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Your Feedback:</p>
                        <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
                      </div>
                    )}
                    
                    <Button onClick={() => handleGrade(assignment.id)} size="sm">
                      {assignment.grade_score ? 'Update Grade' : 'Add Grade & Feedback'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
