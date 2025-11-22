import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login, forgotPassword } from '@/utils/authService'; // Assuming authService handles the actual API call and error structure
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const resetForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const credentials = {
        email: values.email,
        password: values.password
      };

      await login(credentials);
      toast({
        title: "Login successful!",
        description: "Welcome back to MediReminder.",
      });
      navigate('/');
    } catch (error) {
      console.log(values);
      let errorMessage = "An unexpected error occurred during login."; // Default error message

      // Check if the error is an Axios error (or similar structure from your authService)
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) { // Fallback for generic Error objects
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage, // Use the extracted error message
      });
      console.error('Login error:', error);
    }
  };

  const onForgotPasswordSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    try {
      // TODO: Implement actual password reset functionality
      // This would typically call an API endpoint to send a reset email
      // Example of an API call you might make: await sendPasswordResetEmail(values.email);
      console.log('Password reset requested for:', values.email);

      // Simulate API call success
      // Remove this timeout and replace with your actual API call
      //await new Promise(resolve => setTimeout(resolve, 1000));
       await forgotPassword(values.email);

      toast({
        title: "Password reset email sent",
        description: "If an account exists with this email, you'll receive a password reset link.",
      });

      setIsResetDialogOpen(false);
      resetForm.reset();
    } catch (error) {
      let errorMessage = "Failed to send password reset email. Please try again."; // Default error message

      // Check if the error is an Axios error (or similar structure from your authService)
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) { // Fallback for generic Error objects
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Error sending reset email",
        description: errorMessage, // Use the extracted error message
      });
      console.error('Password reset error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="px-0 text-sm text-med-blue-600 hover:text-med-blue-800">
                      Forgot password?
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Reset Password</DialogTitle>
                      <DialogDescription>
                        Enter your email address and we'll send you a link to reset your password.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...resetForm}>
                      <form onSubmit={resetForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
                        <FormField
                          control={resetForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="name@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsResetDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-med-blue-600 hover:bg-med-blue-700">
                            Send Reset Link
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <Button type="submit" className="w-full bg-med-blue-600 hover:bg-med-blue-700">
                <LogIn className="mr-2 h-4 w-4" /> Log In
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-med-blue-600 hover:text-med-blue-800 font-medium">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
