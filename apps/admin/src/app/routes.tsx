import { createBrowserRouter } from "react-router";
import { MobileLayout } from "./layouts/MobileLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { ProtectedRoute } from "./layouts/ProtectedRoute";
import { RoleProtectedRoute } from "./layouts/RoleProtectedRoute";
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

import { WebDashboard } from "./pages/admin/WebDashboard";
import { WebMembers } from "./pages/admin/WebMembers";
import { WebMemberDetail } from "./pages/admin/WebMemberDetail";
import { WebMemberNew } from "./pages/admin/WebMemberNew";
import { WebFinance } from "./pages/admin/WebFinance";
import { WebAssets } from "./pages/admin/WebAssets";
import { WebGroups } from "./pages/admin/WebGroups";
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
          { index: true, Component: WebDashboard },
          { path: "members", Component: WebMembers },
          { path: "members/new", Component: WebMemberNew },
          { path: "members/:id", Component: WebMemberDetail },
          { path: "finance", Component: WebFinance },
          { path: "assets", Component: WebAssets },
          { path: "groups", Component: WebGroups },
          { path: "events", Component: Agenda },
          { path: "care", Component: AdminCases },
          { path: "cases", Component: AdminCases },
          { path: "cases/:id", Component: AdminCaseDetail },
          {
            path: "settings",
            Component: () => (
              <RoleProtectedRoute allowedRoles={["super_admin", "church_admin"]}>
                <AdminSettings />
              </RoleProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);
