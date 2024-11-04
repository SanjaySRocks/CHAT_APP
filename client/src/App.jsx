import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import { useAppStore } from "./store";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants"; 
import { Toaster, toast } from "react-hot-toast"; // Import Toaster and toast
 

// Protects routes that require authentication
const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

// Redirects authenticated users away from auth routes
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true, headers:{ token: Cookies.get(`token`)}  // Ensure cookies are sent with the request
        });

        if (response.status === 200 && response.data.user) {
          setUserInfo(response.data.user);
        } else {
          setUserInfo(undefined); // Clear user info if not found
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserInfo(undefined); // Clear user info on error
      } finally {
        setLoading(false); // Always set loading to false after trying to fetch data
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  // Check for profile setup when navigating to /chat
  useEffect(() => {
    if (userInfo && !userInfo.profileSetup) {
      toast("Please set up your profile to continue."); // Show toast notification
    }
  }, [userInfo]);

  // If still loading, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Toaster /> {/* Add the Toaster here for toast notifications */}
      <BrowserRouter>
        <Routes>
          {/* Auth Route: only accessible if not logged in */}
          <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
          
          {/* Protected Route: only accessible if logged in */}
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          
          {/* Protected Profile Route */}
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          
          {/* Redirect any unknown route to /auth */}
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
