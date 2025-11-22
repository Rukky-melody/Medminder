// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Don't forget Navigate if you use it in AuthGuard
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResendVerification from "./pages/ResendVerification";
import VerifyEmail from "./pages/VerifyEmail";
import AuthGuard from "./components/AuthGuard";
import { ThemeProvider } from "./utils/ThemeContext";

// Import your AuthProvider
import { AuthProvider } from "./utils/authcontext"; // <--- Adjust this path if your AuthContext.tsx is elsewhere
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider> 
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Wrap BrowserRouter with AuthProvider */}
      <AuthProvider> {/* <------------------- Add AuthProvider here */}
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/resend-verification" element={<ResendVerification />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Protected routes */}
            {/* AuthGuard will now have access to the AuthContext */}
            {/* Add the Profile route as a protected route */}
            <Route
              path="/profile" // <--- New protected route for profile
              element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              }
            />
            <Route
              path="/"
              element={
                <AuthGuard>
                  <Index />
                </AuthGuard>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider> {/* <------------------- Close AuthProvider here */}
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;