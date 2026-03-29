import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import JobDetails from "../pages/JobDetails";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import CreatePost from "../pages/CreatePost";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/job/:id" element={<JobDetails />} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create" element={<CreatePost />} />
      </Routes>
    </BrowserRouter>
  );
}