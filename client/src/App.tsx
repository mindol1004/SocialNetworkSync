import { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";

// Pages
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Profile from "@/pages/profile";
import Messages from "@/pages/messages";
import Notifications from "@/pages/notifications";
import Explore from "@/pages/explore";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function PrivateRoute({ component: Component, ...rest }: any) {
  const { user, loading } = useAuthStore();
  const [_, setLocation] = useLocation();
  
  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return user ? <Component {...rest} /> : null;
}

function App() {
  const { initializeUser, setLoading } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      initializeUser(user);
      setLoading(false);
      setInitialized(true);
    });
    
    return () => unsubscribe();
  }, [initializeUser, setLoading]);
  
  useEffect(() => {
    // Apply theme class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  if (!initialized) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/" component={Home} />
      <Route path="/profile/:username">
        {(params) => <PrivateRoute component={Profile} username={params.username} />}
      </Route>
      <Route path="/messages">
        <PrivateRoute component={Messages} />
      </Route>
      <Route path="/notifications">
        <PrivateRoute component={Notifications} />
      </Route>
      <Route path="/explore">
        <PrivateRoute component={Explore} />
      </Route>
      <Route path="/settings">
        <PrivateRoute component={Settings} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
