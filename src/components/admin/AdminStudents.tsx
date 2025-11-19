import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getStudents, updateStudent, deleteStudent, calcExpiryInfo, saveStudents } from '@/lib/storage';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Trash2, Key } from 'lucide-react';

export default function AdminStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    setStudents(getStudents());
  };

  const filteredStudents = filter === 'ALL' 
    ? students 
    : students.filter(s => s.grade === filter);

  const handleActivate = (id: number) => {
    const now = new Date().toISOString();
    updateStudent(id, {
      activated: true,
      activationDate: now,
      lastPaymentDate: now
    });
    toast.success('Student activated!');
    loadStudents();
  };

  const handleResetPassword = (id: number) => {
    const student = students.find(s => s.id === id);
    if (!student) return;

    const newPass = prompt(`Enter new password for ${student.username}`);
    if (!newPass) return;

    updateStudent(id, { pass: newPass });
    toast.success('Password updated!');
    loadStudents();
  };

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to remove this student?')) return;
    
    deleteStudent(id);
    toast.success('Student removed');
    loadStudents();
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-soft">
        <CardHeader>
          <CardTitle>Filter by Class</CardTitle>
        </CardHeader>
        <CardContent>
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
        {filteredStudents.length === 0 ? (
          <Card className="border-none shadow-soft">
            <CardContent className="py-8 text-center text-muted-foreground">
              No students found
            </CardContent>
          </Card>
        ) : (
          filteredStudents.map(student => {
            const expiryInfo = student.activationDate ? calcExpiryInfo(student.activationDate) : null;
            
            return (
              <Card key={student.id} className="border-none shadow-soft hover:shadow-elevated transition-smooth">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold">{student.name}</h3>
                        <Badge variant="outline">{student.grade}</Badge>
                        {student.activated ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-700">
                            <XCircle className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Username:</span> 
                          <code className="ml-2 bg-muted px-2 py-1 rounded">{student.username}</code>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Password:</span> 
                          <code className="ml-2 bg-muted px-2 py-1 rounded">{student.pass}</code>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone:</span> 
                          <span className="ml-2">{student.phone}</span>
                        </div>
                        {expiryInfo && (
                          <div>
                            <span className="text-muted-foreground">Expiry:</span> 
                            <span className="ml-2">
                              {expiryInfo.remaining > 0 
                                ? `${expiryInfo.remaining} days remaining`
                                : 'Expired'
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      {!student.activated && (
                        <Button size="sm" onClick={() => handleActivate(student.id)}>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Activate
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleResetPassword(student.id)}
                      >
                        <Key className="w-4 h-4 mr-1" />
                        Reset Password
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete(student.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
