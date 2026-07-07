import { createBrowserRouter } from "react-router";
import { MobileLayout } from "./layouts/MobileLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { ProtectedRoute } from "./layouts/ProtectedRoute";
import { Splash } from "./pages/Splash";
import { Welcome } from "./pages/Welcome";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Home } from "./pages/Home";
import { Agenda } from "./pages/Agenda";
import { EventDetail } from "./pages/EventDetail";
import { PrayerRequest } from "./pages/PrayerRequest";
import { CareWarning } from "./pages/CareWarning";
import { ChatFlow } from "./pages/ChatFlow";
import { Content } from "./pages/Content";
import { Groups } from "./pages/Groups";
import { Profile } from "./pages/Profile";
import { Notifications } from "./pages/Notifications";

import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminCases } from "./pages/admin/AdminCases";
import { AdminCaseDetail } from "./pages/admin/AdminCaseDetail";
import { AdminSettings } from "./pages/admin/AdminSettings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Splash,
  },
  {
    path: "/welcome",
    Component: Welcome,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/app",
    Component: ProtectedRoute,
    children: [
      {
        Component: MobileLayout,
        children: [
          { index: true, Component: Home },
          { path: "agenda", Component: Agenda },
          { path: "agenda/:id", Component: EventDetail },
          { path: "prayer", Component: PrayerRequest },
          { path: "care-warning", Component: CareWarning },
          { path: "chat", Component: ChatFlow },
          { path: "content", Component: Content },
          { path: "groups", Component: Groups },
          { path: "profile", Component: Profile },
          { path: "notifications", Component: Notifications },
        ],
      },
    ],
  },
  {
    path: "/admin",
    Component: ProtectedRoute,
    children: [
      {
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboard },
          { path: "cases", Component: AdminCases },
          { path: "cases/:id", Component: AdminCaseDetail },
          { path: "settings", Component: AdminSettings },
        ],
      },
    ],
  },
]);
