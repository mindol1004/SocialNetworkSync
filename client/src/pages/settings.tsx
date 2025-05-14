import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/lib/i18n";
import { useTheme } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { getAuth, updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";

export default function Settings() {
  const { t, language, changeLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const auth = getAuth();
  const database = getDatabase();
  
  const [profileForm, setProfileForm] = useState({
    displayName: user?.displayName || "",
    username: "",
    bio: "",
    email: user?.email || "",
    photoURL: user?.photoURL || ""
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    messageNotifications: true,
    newFollowerNotifications: true,
    likeCommentNotifications: true
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    privateAccount: false,
    showOnlineStatus: true,
    allowTagging: true,
    allowMentions: true
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.currentUser) return;
    
    setLoading(true);
    
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: profileForm.displayName,
        photoURL: profileForm.photoURL
      });
      
      // Update email if changed
      if (profileForm.email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, profileForm.email);
      }
      
      // Update user data in database
      const userRef = ref(database, `users/${auth.currentUser.uid}`);
      await update(userRef, {
        displayName: profileForm.displayName,
        photoURL: profileForm.photoURL,
        bio: profileForm.bio,
        email: profileForm.email,
        // Don't update username for now as it's a unique identifier
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.currentUser || !auth.currentUser.email) return;
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        passwordForm.currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      await updatePassword(auth.currentUser, passwordForm.newPassword);
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully",
      });
      
      // Clear form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleNotificationSettingsUpdate = async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    
    try {
      const userRef = ref(database, `users/${auth.currentUser.uid}/settings/notifications`);
      await update(userRef, notificationSettings);
      
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved",
      });
    } catch (error: any) {
      console.error("Error updating notification settings:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update notification settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePrivacySettingsUpdate = async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    
    try {
      const userRef = ref(database, `users/${auth.currentUser.uid}/settings/privacy`);
      await update(userRef, privacySettings);
      
      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved",
      });
    } catch (error: any) {
      console.error("Error updating privacy settings:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update privacy settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 pb-16 md:pb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">{t('settings')}</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={profileForm.photoURL} alt={profileForm.displayName} />
                        <AvatarFallback>{profileForm.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-medium">Profile Photo</h3>
                        <p className="text-sm text-neutral-500 mb-2">Upload a new profile photo</p>
                        <Input 
                          type="text" 
                          placeholder="Profile photo URL" 
                          value={profileForm.photoURL}
                          onChange={(e) => setProfileForm({ ...profileForm, photoURL: e.target.value })}
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input 
                          id="displayName"
                          value={profileForm.displayName}
                          onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username"
                          value={profileForm.username}
                          onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                          disabled // Username changes require special handling
                        />
                        <p className="text-xs text-neutral-500">
                          Username cannot be changed once set
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio"
                          placeholder="Tell us about yourself"
                          rows={4}
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-white"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Saving...
                          </div>
                        ) : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input 
                          id="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                          id="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-white"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Updating...
                          </div>
                        ) : "Update Password"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>Manage your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Download Your Data</h3>
                    <p className="text-sm text-neutral-500 mb-4">
                      Get a copy of your data, including posts, photos, and profile information
                    </p>
                    <Button variant="outline">Request Data Download</Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-red-600 mb-2">Delete Account</h3>
                    <p className="text-sm text-neutral-500 mb-4">
                      Permanently delete your account and all of your content
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-neutral-500">Receive email updates</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-neutral-500">Receive notifications on your devices</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Messages</h3>
                        <p className="text-sm text-neutral-500">Get notified about new messages</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.messageNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({ ...notificationSettings, messageNotifications: checked })
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">New Followers</h3>
                        <p className="text-sm text-neutral-500">Get notified when someone follows you</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.newFollowerNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({ ...notificationSettings, newFollowerNotifications: checked })
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Likes & Comments</h3>
                        <p className="text-sm text-neutral-500">Get notified about activity on your posts</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.likeCommentNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({ ...notificationSettings, likeCommentNotifications: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleNotificationSettingsUpdate}
                        className="bg-primary hover:bg-primary/90 text-white"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Saving...
                          </div>
                        ) : "Save Preferences"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Manage your privacy preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Private Account</h3>
                        <p className="text-sm text-neutral-500">Only approved followers can see your posts</p>
                      </div>
                      <Switch 
                        checked={privacySettings.privateAccount}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({ ...privacySettings, privateAccount: checked })
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Online Status</h3>
                        <p className="text-sm text-neutral-500">Show when you're active on MiniMeet</p>
                      </div>
                      <Switch 
                        checked={privacySettings.showOnlineStatus}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({ ...privacySettings, showOnlineStatus: checked })
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Tagging</h3>
                        <p className="text-sm text-neutral-500">Allow others to tag you in posts</p>
                      </div>
                      <Switch 
                        checked={privacySettings.allowTagging}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({ ...privacySettings, allowTagging: checked })
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Mentions</h3>
                        <p className="text-sm text-neutral-500">Allow others to mention you in comments</p>
                      </div>
                      <Switch 
                        checked={privacySettings.allowMentions}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({ ...privacySettings, allowMentions: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={handlePrivacySettingsUpdate}
                        className="bg-primary hover:bg-primary/90 text-white"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Saving...
                          </div>
                        ) : "Save Settings"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize how MiniMeet looks for you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        value={theme}
                        onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={language}
                        onValueChange={(value) => changeLanguage(value as 'en' | 'ko')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ko">한국어 (Korean)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
