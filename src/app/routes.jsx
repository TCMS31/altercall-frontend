import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import RequireAuth from "../features/auth/components/RequireAuth";

// Route-level code splitting: the signed-in planner and the auth screens are
// never needed at the same time, so they ship as separate chunks.
const CoachPage = lazy(() => import("../features/coach/pages/CoachPage"));
const SigninPage = lazy(() => import("../features/auth/pages/SigninPage"));
const SignupPage = lazy(() => import("../features/auth/pages/SignupPage"));

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-ink-50" role="status">
    <span className="sr-only">Loading</span>
    <span className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-brand-600" />
  </div>
);

export const AppRoutes = () => (
  <Suspense fallback={<RouteFallback />}>
    <Routes>
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <CoachPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
