import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { 
  getNotificationPreferences,
  saveNotificationPreferences,
  getUserContact,
  saveUserContact,
  requestNotificationPermission
} from '@/utils';
import { NotificationPreference, UserContact } from '@/types';
import { useToast } from "@/components/ui/use-toast";

const ReminderSettings: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreference>(getNotificationPreferences());
  const [contact, setContact] = useState<UserContact>(getUserContact());
  const [notificationsGranted, setNotificationsGranted] = useState<boolean | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkPermission = async () => {
      if ('Notification' in window) {
        setNotificationsGranted(Notification.permission === 'granted');
      } else {
        setNotificationsGranted(false);
      }
    };
    
    checkPermission();
  }, []);

  const handlePreferenceChange = (key: keyof NotificationPreference, value: boolean | number) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: value };
      saveNotificationPreferences(updated);
      return updated;
    });
  };

  const handleContactChange = (key: keyof UserContact, value: string) => {
    setContact((prev) => {
      const updated = { ...prev, [key]: value };
      saveUserContact(updated);
      return updated;
    });
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsGranted(granted);
    
    if (granted) {
      toast({
        title: "Success",
        description: "Notification permission granted!",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Please enable notifications in your browser settings",
      });
    }
  };

  const handleTestNotification = () => {
    if (Notification.permission === 'granted') {
      const notification = new Notification('Test Medication Reminder', {
        body: 'This is a test notification. Your reminders will look like this.',
        icon: '/favicon.ico'
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      
      toast({
        title: "Test notification sent",
        description: "Check your browser notifications",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Cannot send notification",
        description: "Notification permission not granted",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-md">
        <CardHeader className="bg-med-blue-50 dark:bg-med-blue-900/30">
          <CardTitle className="text-med-blue-800 dark:text-med-blue-200">Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {!notificationsGranted && (
            <Alert className="mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Browser notifications are not enabled. 
                <Button 
                  variant="link" 
                  className="p-0 h-auto ml-2"
                  onClick={handleRequestPermission}
                >
                  Enable Notifications
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="app-notification">App Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
              </div>
              <Switch
                id="app-notification"
                checked={preferences.app}
                onCheckedChange={(checked) => handlePreferenceChange('app', checked)}
                className="data-[state=checked]:bg-med-blue-600"
                disabled={!notificationsGranted}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notification">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive medication reminders via email</p>
              </div>
              <Switch
                id="email-notification"
                checked={preferences.email}
                onCheckedChange={(checked) => handlePreferenceChange('email', checked)}
                className="data-[state=checked]:bg-med-blue-600"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-notification">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive medication reminders via SMS</p>
              </div>
              <Switch
                id="sms-notification"
                checked={preferences.sms}
                onCheckedChange={(checked) => handlePreferenceChange('sms', checked)}
                className="data-[state=checked]:bg-med-blue-600"
              />
            </div>
            
            <div className="pt-4 border-t">
              <Label htmlFor="reminder-offset">Reminder Time (minutes before)</Label>
              <div className="flex gap-4 mt-2 items-center">
                <Input
                  id="reminder-offset"
                  type="number"
                  min={0}
                  max={60}
                  value={preferences.reminderOffset}
                  onChange={(e) => handlePreferenceChange('reminderOffset', parseInt(e.target.value) || 0)}
                  className="w-24 focus-ring"
                />
                <span className="text-sm text-muted-foreground">minutes before scheduled time</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="font-medium mb-2">Contact Information</p>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={contact.email || ''}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="mt-1 focus-ring"
                    disabled={!preferences.email}
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={contact.phone || ''}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    className="mt-1 focus-ring"
                    disabled={!preferences.sms}
                  />
                </div>
              </div>
            </div>
            
            {notificationsGranted && preferences.app && (
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleTestNotification}
                  className="bg-med-blue-600 hover:bg-med-blue-700 focus-ring"
                >
                  Test Notification
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReminderSettings;
