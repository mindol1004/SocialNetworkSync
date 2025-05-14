import { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "@/hooks/useAuth";

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

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "minimeet-app"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "minimeet-app",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "minimeet-app"}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://minimeet-app.firebaseio.com",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();

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
