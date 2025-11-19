import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Video, Upload, Star, Clock, Users } from 'lucide-react';

const pricingPlans = [
  { grade: 'LKG - UKG', price: 100, color: 'bg-blue-100 text-blue-700' },
  { grade: '1st - 2nd', price: 150, color: 'bg-green-100 text-green-700' },
  { grade: '3rd - 4th', price: 200, color: 'bg-amber-100 text-amber-700' },
  { grade: '5th', price: 250, color: 'bg-rose-100 text-rose-700' },
];

const features = [
  { icon: Video, title: 'Recorded Lessons', desc: 'Access all class recordings anytime' },
  { icon: Clock, title: '2 Classes/Week', desc: '30 minutes of focused learning' },
  { icon: Upload, title: 'Upload Assignments', desc: 'Submit and get feedback on your work' },
  { icon: Users, title: 'Small Batches', desc: 'Personalized attention for every child' },
];

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-hero text-white shadow-elevated animate-fade-in">
          <Palette className="w-5 h-5" />
          <span className="font-medium">Online Drawing Classes for Kids</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Welcome to{' '}
          <span className="bg-gradient-hero bg-clip-text text-transparent">
            Manikandan Arts
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Nurture your child's creativity with expert-led online drawing classes. 
          Interactive lessons, personalized feedback, and recorded sessions for flexible learning.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg" className="shadow-elevated hover:shadow-soft transition-smooth">
            <Link to="/register">
              Start Learning Today
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="transition-smooth">
            <Link to="/login">
              Student Login
            </Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <Card key={idx} className="border-none shadow-soft hover:shadow-elevated transition-smooth glass-card">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center mb-2">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.desc}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Pricing */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="mb-2">Monthly Plans</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Simple, Affordable Pricing</h2>
          <p className="text-muted-foreground">Choose the right plan for your child's grade</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan, idx) => (
            <Card key={idx} className="border-none shadow-soft hover:shadow-elevated transition-smooth hover:scale-105">
              <CardHeader>
                <Badge className={`w-fit ${plan.color}`}>{plan.grade}</Badge>
                <CardTitle className="text-3xl font-bold mt-4">
                  ₹{plan.price}
                  <span className="text-base font-normal text-muted-foreground">/month</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span>2 classes per week</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span>30 min sessions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span>Recorded lessons</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span>Personal feedback</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 px-6 rounded-2xl bg-gradient-hero shadow-elevated">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Start Your Creative Journey?
        </h2>
        <p className="text-white/90 mb-6 text-lg max-w-2xl mx-auto">
          Join hundreds of young artists learning and growing with Manikandan Arts
        </p>
        <Button asChild size="lg" variant="secondary" className="shadow-elevated hover:scale-105 transition-smooth">
          <Link to="/register">
            Register Now
          </Link>
        </Button>
      </section>
    </div>
  );
}
