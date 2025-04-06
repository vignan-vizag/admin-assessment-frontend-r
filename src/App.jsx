import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Navigations/Sidebar";
import Dashboard from "./pages/Dashboard";
import CreateTest from "./pages/CreateTest";
import ManageTests from "./pages/ManageTests";
import UpdateQuestions from "./pages/UpdateQuestions";
import StartTest from "./pages/StartTest";
import QuizPage from "./pages/QuizPage";
import MyTests from "./pages/MyTests";
import Header from "./components/Navigations/Header";
import { useEffect, useState } from "react";
import TestDetailsPage from "./pages/TestDetailsPage";
const HEADER_HEIGHT = "80px"; // Set a fixed height for the header

function MainLayout() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const sidebarWidth = isCollapsed ? 80 : 256;

  return (
    <div className="flex flex-col">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <Header />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Routes wrapped with Sidebar and Header */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-test" element={<CreateTest />} />
          <Route path="/manage-tests" element={<ManageTests />} />
          <Route path="/update-questions" element={<UpdateQuestions />} />
          <Route path="/start-test" element={<StartTest />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/test/:testId" element={<TestDetailsPage />} />
          <Route path="/mytests" element={<MyTests />} />
        </Route>
        {/* MyTests route without Sidebar and Header */}
      </Routes>
    </Router>
  );
}
