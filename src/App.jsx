import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CreateTest from "./pages/CreateTest";
import ManageTests from "./pages/ManageTests";
import UpdateQuestions from "./pages/UpdateQuestions";
import StartTest from "./pages/StartTest";
import QuizPage from "./pages/QuizPage";
import MyTests from "./pages/MyTests";
const HEADER_HEIGHT = "80px"; // Set a fixed height for the header
function MainLayout() {
  return (
    <div className="flex flex-col">
      {/* Directly include header image here */}
      <div className="bg-gray-100 pt-0 pb-0 pl-6 pr-6 flex items-center justify-center w-[79%] h-auto fixed top-0 right-0 z-10">


        <img src="/title_head.jpg" alt="Header" />
      </div>

      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
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
          <Route path="/" element={<CreateTest />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manage-tests" element={<ManageTests />} />
          <Route path="/update-questions" element={<UpdateQuestions />} />
          <Route path="/start-test" element={<StartTest />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Route>
        {/* MyTests route without Sidebar and Header */}
        <Route path="/mytests" element={<MyTests />} />
      </Routes>
    </Router>
  );
}
