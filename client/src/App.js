import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route , Navigate } from "react-router-dom";
import { UserContextProvider } from "./UserContext";
import RegisterPage from "./Pages/RegistrationPage";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import CreateBlogPage from "./Pages/CreateBlogPage";
import BlogPage from "./Pages/MyBlogPage";
import SubscriptionPage from "./Pages/SubscriptionPage";
import ProfilePage from "./Pages/ProfilePage";
import Header from "./Header";
import PostDetails from "./Pages/PostDetails";

const App = () => {
  return (
    <UserContextProvider>
      <Router>
        <div className="app-root">
          <main className="app-main">
            <Header />
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/myblog" element={<BlogPage />} />
                <Route path="/create" element={<CreateBlogPage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/post" element={<PostDetails />} />
              </Routes>
          </main>
        </div>
      </Router>
    </UserContextProvider>
  );
};

export default App;