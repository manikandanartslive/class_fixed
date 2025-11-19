import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, GraduationCap, LogIn, UserPlus, CreditCard, Shield, FileText } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-green-50/30">
      <nav className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center shadow-elevated transition-smooth group-hover:scale-110">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  Manikandan Arts
                </h1>
                <p className="text-xs text-muted-foreground">Drawing Classes for Kids</p>
              </div>
            </Link>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                size="sm"
                asChild
                className="transition-smooth"
              >
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
              
              <Button
                variant={isActive('/login') ? 'default' : 'ghost'}
                size="sm"
                asChild
                className="transition-smooth"
              >
                <Link to="/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Link>
              </Button>
              
              <Button
                variant={isActive('/register') ? 'default' : 'ghost'}
                size="sm"
                asChild
                className="transition-smooth"
              >
                <Link to="/register">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register
                </Link>
              </Button>
              
              <Button
                variant={isActive('/payment') ? 'default' : 'ghost'}
                size="sm"
                asChild
                className="transition-smooth"
              >
                <Link to="/payment">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment
                </Link>
              </Button>
              
              <Button
                variant={isActive('/admin') ? 'secondary' : 'ghost'}
                size="sm"
                asChild
                className="transition-smooth"
              >
                <Link to="/admin">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="border-t bg-card/60 backdrop-blur-md mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Manikandan Arts. Nurturing creativity, one drawing at a time.</p>
        </div>
      </footer>
    </div>
  );
}
