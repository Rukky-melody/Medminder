// src/pages/VerifyEmail.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/utils/authService';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setErrorMessage('Verification token is missing');
        return;
      }

      try {
        await api.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
        toast({
          title: 'Email verified successfully',
          description: 'You can now log in to your account',
        });
      } catch (error: any) {
        setStatus('error');
        const message = error.response?.data?.message || 'Email verification failed';
        setErrorMessage(message);
        toast({
          title: 'Verification failed',
          description: message,
          variant: 'destructive',
        });
      }
    };

    verifyEmail();
  }, [searchParams, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {status === 'verifying' && 'Verifying your email address...'}
            {status === 'success' && 'Your email has been verified'}
            {status === 'error' && 'Verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center py-8">
            {status === 'verifying' && (
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            )}
            {status === 'success' && (
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            )}
            {status === 'error' && (
              <XCircle className="h-16 w-16 text-destructive" />
            )}
          </div>

          {status === 'error' && (
            <p className="text-center text-sm text-muted-foreground">
              {errorMessage}
            </p>
          )}

          {status === 'success' && (
            <Button
              className="w-full"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          )}

          {status === 'error' && (
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => navigate('/resend-verification')}
              >
                Resend Verification Email
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigate('/login')}
              >
                Back to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
