// src/pages/Profile.tsx
import React from 'react';
import { useAuth } from '@/utils/authcontext'; // IMPORTANT: This alias relies on your project's tsconfig.json/jsconfig.json being configured correctly. Verify file path: src/contexts/AuthContext.tsx.
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react'; // For loading spinner, assuming lucide-react is installed

const Profile = () => {
  const { user, loading, isLoggedIn } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2 text-gray-700">Loading profile...</p>
      </div>
    );
  }

  // If not logged in after loading, prompt user to log in.
  // The AuthGuard should ideally handle redirection to login if not authenticated.
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-yellow-100 text-yellow-700">
        <p>No user data available. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex justify-center items-center">
      <Card className="w-full max-w-2xl rounded-lg shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg p-6">
          <CardTitle className="text-3xl font-extrabold flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8 mr-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a8.966 8.966 0 0 1-11.963 0M12 10.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
              />
            </svg>
            Your Profile
          </CardTitle>
          <CardDescription className="text-blue-100 mt-2">
            Manage your personal information and account settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            {/* User Name: Now using 'fullName' from the user object */}
            <div>
              <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={user.fullName || 'N/A'} // Display user's fullName or 'N/A' if not available
                readOnly
                className="bg-gray-50 border-gray-200"
              />
            </div>
            {/* User Email: Populated directly from the 'user' object */}
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={user.email || 'N/A'} // Add 'N/A' fallback just in case
                readOnly
                className="bg-gray-50 border-gray-200"
              />
            </div>
            {/* Additional user details can be added here, matching your backend's User object */}
            {user.phoneNumber && (
              <div>
                <Label htmlFor="phoneNumber" className="text-gray-700 font-medium">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="text"
                  value={user.phoneNumber}
                  readOnly
                  className="bg-gray-50 border-gray-200"
                />
              </div>
            )}
            {user.DOB && (
              <div>
                <Label htmlFor="dob" className="text-gray-700 font-medium">Date of Birth</Label>
                <Input
                  id="dob"
                  type="text"
                  value={new Date(user.DOB).toLocaleDateString()} // Format DOB nicely
                  readOnly
                  className="bg-gray-50 border-gray-200"
                />
              </div>
            )}
            {user.gender && (
              <div>
                <Label htmlFor="gender" className="text-gray-700 font-medium">Gender</Label>
                <Input
                  id="gender"
                  type="text"
                  value={user.gender}
                  readOnly
                  className="bg-gray-50 border-gray-200"
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white rounded-md">
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full sm:w-auto border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 rounded-md">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
