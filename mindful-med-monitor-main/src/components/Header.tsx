
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Calendar, LogIn, LogOut, UserCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { requestNotificationPermission } from '@/utils/notificationService';
import { isAuthenticated, logout, getCurrentUser } from '@/utils/authService';
import ThemeToggle from './ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();
  const currentUser = getCurrentUser();

  const handleNotificationPermission = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      toast({
        title: "Notifications enabled",
        description: "You will now receive medication reminders",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Notifications blocked",
        description: "Please enable notifications in your browser settings",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/login');
  };

  return (
    <header className="bg-white shadow dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-med-blue-600" />
              </div>
              <h1 className="ml-3 text-2xl font-bold text-med-blue-700 dark:text-white">
                MediReminder
              </h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
          <ThemeToggle />
            <Button 
              variant="ghost" 
              className="flex items-center text-med-blue-600 focus-ring"
              onClick={handleNotificationPermission}
            >
              <Bell className="h-5 w-5 mr-2" />
              <span className="hidden md:inline">Notifications</span>
            </Button>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    <span className="hidden md:inline">{currentUser?.fullName|| currentUser?.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/login')} variant="outline">
                <LogIn className="h-5 w-5 mr-2" />
                <span>Login</span>
              </Button>
            )}

          
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
