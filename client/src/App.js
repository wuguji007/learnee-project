import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthService from "./services/auth.service";
import Header from "./layouts/Header";
import HomeComponent from "./components/Home-component";
import RegisterComponent from "./components/Register-component";
import LoginComponent from "./components/Login-component";
import ProfileComponent from "./components/Profile-component";
import CourseDetail from './components/CourseDetail-component';
import FoundCourseComponent from "./components/Foundcourse-component";
import Footer from "./layouts/Footer";

import EnrollComponent from "./components/Enroll-component";



function App() {
  // Header-購物車數量狀態
  const [cartCount, setCartCount] = useState(0);
  // 取得當前登入會員
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  return (
    <BrowserRouter>
      <div className="App">
        <Header
          cartCount={cartCount}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />

        <div className="App-container">
          <Routes>
            <Route path="/" element={<HomeComponent setCartCount={setCartCount} />} />
            <Route path="/register" element={<RegisterComponent />} />
            <Route
              path="/login"
              element={
                <LoginComponent
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <ProfileComponent
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
            <Route
              path="/courses/:id"
              element={<CourseDetail
                setCartCount={setCartCount} />
              }
            />
            <Route
              path="/courses/search"
              element={<FoundCourseComponent
                setCartCount={setCartCount} />
              }
            />
            <Route
              path="/enroll"
              element={
                <EnrollComponent
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>     
    </BrowserRouter>
  );
};

export default App;
