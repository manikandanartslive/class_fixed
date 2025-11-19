import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addVideoForGrade } from '@/lib/storage';
import { toast } from 'sonner';
import { Plus, Video } from 'lucide-react';

export default function AdminVideos() {
  const [grade, setGrade] = useState('');
  const [url, setUrl] = useState('');

  const handleAdd = () => {
    if (!grade || !url) {
      toast.error('Please select a class and enter video URL');
      return;
    }

    addVideoForGrade(grade, url);
    toast.success(`Video added for class ${grade}`);
    setGrade('');
    setUrl('');
  };

  return (
    <Card className="border-none shadow-elevated">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-primary" />
          <CardTitle>Add Class Video</CardTitle>
        </div>
        <CardDescription>Add recorded lesson links for each class</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="video-grade">Select Class</Label>
          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger id="video-grade">
              <SelectValue placeholder="Choose class" />
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
          <Label htmlFor="video-url">Video URL</Label>
          <Input
            id="video-url"
            placeholder="Paste Google Drive or YouTube link"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Make sure the video is accessible to anyone with the link
          </p>
        </div>

        <Button onClick={handleAdd} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Video
        </Button>
      </CardContent>
    </Card>
  );
}
