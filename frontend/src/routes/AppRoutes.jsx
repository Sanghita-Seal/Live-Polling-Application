import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";
import VerifyEmail from "../pages/auth/VerifyEmail.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import CreatePoll from "../pages/polls/CreatePoll.jsx";
import PollBuilder from "../pages/polls/PollBuilder.jsx";
import PublicPoll from "../pages/polls/PublicPoll.jsx";
import PollAnalytics from "../pages/polls/PollAnalytics.jsx";
import RealtimePollUpdates from "../pages/polls/RealtimePollUpdates.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/polls/create"
          element={
            <ProtectedRoute>
              <CreatePoll />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/polls/:pollId/builder"
          element={
            <ProtectedRoute>
              <PollBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/polls/:pollId/realtime"
          element={
            <ProtectedRoute>
              <RealtimePollUpdates />
            </ProtectedRoute>
          }
        />
        <Route path="/p/:shareCode" element={<PublicPoll />} />
        <Route path="/analytics/:analyticsCode" element={<PollAnalytics />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
