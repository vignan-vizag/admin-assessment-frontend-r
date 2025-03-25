import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CreateTest from "./pages/CreateTest";
import ManageTests from "./pages/ManageTests";
import UpdateQuestions from "./pages/UpdateQuestions";
import StartTest from "./pages/StartTest";
import QuizPage from "./pages/QuizPage";
import MyTests from "./pages/MyTests";

// Layout for pages that include the Sidebar
function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Routes wrapped with the Sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-test" element={<CreateTest />} />
          <Route path="/manage-tests" element={<ManageTests />} />
          <Route path="/update-questions" element={<UpdateQuestions />} />
          <Route path="/start-test" element={<StartTest />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Route>
        {/* MyTests route rendered without the Sidebar */}
        <Route path="/MyTests" element={<MyTests />} />
      </Routes>
    </Router>
  );
}
