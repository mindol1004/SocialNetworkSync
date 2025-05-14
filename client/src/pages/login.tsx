import { useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { loginWithEmail, loginWithGoogle } from '@/lib/firebase';
import { useTranslation } from '@/lib/i18n';
import { useAuthStore } from '@/store/authStore';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { t, language, changeLanguage } = useTranslation();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const user = await loginWithEmail(data.email, data.password);
      setUser(user);
      toast({
        title: 'Login successful',
        description: 'Welcome back to MiniMeet!'
      });
      setLocation('/');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || t('loginError'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const user = await loginWithGoogle();
      setUser(user);
      toast({
        title: 'Login successful',
        description: 'Welcome back to MiniMeet!'
      });
      setLocation('/');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || t('loginError'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'ko' : 'en');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] dark:bg-[#121212] p-4">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" onClick={toggleLanguage}>
          {language === 'en' ? '한국어' : 'English'}
        </Button>
      </div>
      
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            MiniMeet
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="flex mb-6">
            <div 
              className="flex-1 py-3 font-medium text-center border-b-2 border-primary text-primary cursor-pointer"
            >
              {t('login')}
            </div>
            <div 
              className="flex-1 py-3 font-medium text-center border-b-2 border-transparent text-neutral-500 cursor-pointer"
              onClick={() => setLocation('/register')}
            >
              {t('signup')}
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="email@example.com" 
                        type="email" 
                        {...field}
                        className="px-4 py-2.5 rounded-lg"
                      />
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
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        type="password" 
                        {...field}
                        className="px-4 py-2.5 rounded-lg"
                      />
                    </FormControl>
                    <div className="flex justify-end mt-1">
                      <Button variant="link" className="px-0 h-auto font-normal" size="sm">
                        {t('forgotPassword')}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 py-2.5 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {t('loading')}
                  </div>
                ) : t('login')}
              </Button>
            </form>
          </Form>
          
          <div className="flex items-center my-6">
            <Separator className="flex-1" />
            <span className="px-4 text-neutral-500 text-sm">{t('or')}</span>
            <Separator className="flex-1" />
          </div>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full py-2.5 rounded-lg flex items-center justify-center"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <span className="mr-2 text-red-500 material-icons text-sm">login</span>
              {t('continueWithGoogle')}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full py-2.5 rounded-lg flex items-center justify-center"
              disabled
            >
              <span className="mr-2 material-icons text-sm">apple</span>
              {t('continueWithApple')}
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {t('dontHaveAccount')} 
            <Button variant="link" className="px-2" onClick={() => setLocation('/register')}>
              {t('signup')}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
