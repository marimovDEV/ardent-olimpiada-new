import { useEffect, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import ProfessionDetailPage from "./pages/ProfessionDetailPage";
import SubjectDetailPage from "./pages/SubjectDetailPage";
import CertificateVerifyPage from "./pages/CertificateVerifyPage";
import LessonView from "./pages/LessonView";
import OlympiadsPage from "./pages/OlympiadsPage";
import OlympiadDetailPage from "./pages/OlympiadDetailPage";
import OlympiadTestPage from "./pages/OlympiadTestPage";
import OlympiadResultPage from "./pages/OlympiadResultPage";
import TestPage from "./pages/TestPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./components/AdminLayout";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminTeachersPage from "./pages/admin/AdminTeachersPage";
import AdminSubjectsPage from "./pages/admin/AdminSubjectsPage";
import AdminCoursesPage from "./pages/admin/AdminCoursesPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import authService from "@/services/authService";
import i18n from "./i18n";

import AdminOlympiadsPage from "./pages/admin/AdminOlympiadsPage";
import AdminOlympiadWizard from "./pages/admin/olympiad-wizard/AdminOlympiadWizard";
import AdminOlympiadParticipantsPage from "./pages/admin/AdminOlympiadParticipantsPage";
import AdminOlympiadResultsPage from "./pages/admin/AdminOlympiadResultsPage";
import AdminProfessionsPage from "./pages/admin/AdminProfessionsPage";
import AdminFinancePage from "./pages/admin/AdminFinancePage";
import AdminSupportPage from "./pages/admin/AdminSupportPage";
import AdminCertificatesPage from "./pages/admin/AdminCertificatesPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminBotPage from "./pages/admin/AdminBotPage";
import AdminHomeCMSPage from "./pages/admin/AdminHomeCMSPage";
import AdminNotificationsPage from "./pages/admin/AdminNotificationsPage";
import AdminAIAssistantPage from "./pages/admin/AdminAIAssistantPage";
import AdminParticipantAnalysisPage from "./pages/admin/AdminParticipantAnalysisPage";
import TeacherLayout from "./components/TeacherLayout";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherCoursesPage from "./pages/teacher/TeacherCoursesPage";
import TeacherLoginPage from "./pages/teacher/TeacherLoginPage";
import TeacherStudentsPage from "./pages/teacher/TeacherStudentsPage";
const TeacherOlympiadsPage = lazy(() => import("./pages/teacher/TeacherOlympiadsPage"));
const TeacherOlympiadResultsPage = lazy(() => import("./pages/teacher/TeacherOlympiadResultsPage"));
const TeacherProfilePage = lazy(() => import("./pages/teacher/TeacherProfilePage"));
import TeacherMessagesPage from "./pages/teacher/TeacherMessagesPage";
import TeacherCourseEditor from "./pages/teacher/TeacherCourseEditor";
import TeacherOnboarding from "./pages/teacher/TeacherOnboarding";
import CourseCreationPayment from "./pages/teacher/CourseCreationPayment";

import CertificateVerify from "./pages/CertificateVerify";
import ResultsPage from "./pages/ResultsPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import MyCertificatesPage from "./pages/MyCertificatesPage";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import PublicLayout from "./components/layouts/PublicLayout";
import OlympiadLayout from "./components/layouts/OlympiadLayout";
import PublicWinnersPage from "./pages/PublicWinnersPage";
import MockPaymentPage from "./pages/MockPaymentPage";
import PublicOlympiadsPage from "./pages/PublicOlympiadsPage";
import PublicCoursesPage from "./pages/PublicCoursesPage";
import SubjectsPage from "./pages/SubjectsPage";
import AboutPage from "./pages/AboutPage";
import OlympiadLeaderboardPage from "./pages/OlympiadLeaderboardPage";
import GuidePage from "./pages/GuidePage";


const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const syncLanguage = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await authService.getMe();

          if (user && user.language && user.language !== i18n.language) {
            i18n.changeLanguage(user.language);
            localStorage.setItem('i18nextLng', user.language);
          }

          // Also sync to local storage user object if it exists
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
          }
        } catch (error: any) {
          // Global Axios interceptor in api.ts handles 401/403 (logout/redirect)
          // We only log other errors here.
          if (error.response?.status !== 401 && error.response?.status !== 403) {
            console.error("Failed to sync language from profile:", error);
          }
        }
      }
    };

    syncLanguage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth/login" element={<AuthPage mode="login" />} />
                <Route path="/auth/register" element={<AuthPage mode="register" />} />
                <Route path="/auth/recover" element={<AuthPage mode="recover" />} />
                <Route path="/auth" element={<Navigate to="/auth/login" replace />} />

                {/* Shortcuts */}
                <Route path="/login" element={<Navigate to="/auth/login" replace />} />
                <Route path="/register" element={<Navigate to="/auth/register" replace />} />


                <Route path="/winners" element={<PublicWinnersPage />} />
                <Route path="/all-olympiads" element={<PublicOlympiadsPage />} />
                <Route path="/subjects" element={<SubjectsPage />} />
                <Route path="/subject/:slug" element={<SubjectDetailPage />} />
                <Route path="/all-courses" element={<PublicCoursesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/guide" element={<GuidePage />} />

                <Route path="/course/:id" element={<CourseDetailPage />} />
                <Route path="/profession/:id" element={<ProfessionDetailPage />} />
                <Route path="/olympiad/:id" element={<OlympiadDetailPage />} />
                <Route path="/certificate/verify/:certNumber" element={<CertificateVerifyPage />} />
                <Route path="/certificate/verify" element={<CertificateVerifyPage />} />

                {/* Dashboard Layout Routes */}
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/my-courses" element={<MyCoursesPage />} />
                  <Route path="/olympiads" element={<OlympiadsPage />} />
                  <Route path="/dashboard/olympiad/:id" element={<OlympiadDetailPage />} />
                  <Route path="/results" element={<ResultsPage />} />
                  <Route path="/my-certificates" element={<MyCertificatesPage />} />
                </Route>

                <Route path="/course/:id/lesson/:lessonId?" element={<LessonView />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/olympiad/:id/test" element={<OlympiadTestPage />} />

                {/* Public Layout Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/olympiad/:id" element={<OlympiadDetailPage />} />
                </Route>

                {/* Olympiad Mode Layout */}
                <Route element={<OlympiadLayout />}>
                  <Route path="/olympiad/:id/result" element={<OlympiadResultPage />} />
                  <Route path="/olympiad/:id/results" element={<OlympiadLeaderboardPage />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="subjects" element={<AdminSubjectsPage />} />
                  <Route path="cms" element={<AdminHomeCMSPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="teachers" element={<AdminTeachersPage />} />
                  <Route path="courses" element={<AdminCoursesPage />} />
                  <Route path="olympiads" element={<AdminOlympiadsPage />} />
                  <Route path="olympiads/new" element={<AdminOlympiadWizard />} />
                  <Route path="olympiads/:id/edit" element={<AdminOlympiadWizard />} />
                  <Route path="olympiads/:id/participants" element={<AdminOlympiadParticipantsPage />} />
                  <Route path="olympiads/:id/participants/:userId/analysis" element={<AdminParticipantAnalysisPage />} />
                  <Route path="olympiads/:id/results" element={<AdminOlympiadResultsPage />} />
                  <Route path="professions" element={<AdminProfessionsPage />} />
                  <Route path="finance" element={<AdminFinancePage />} />
                  <Route path="support" element={<AdminSupportPage />} />
                  <Route path="certificates" element={<AdminCertificatesPage />} />
                  <Route path="bot" element={<AdminBotPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                  <Route path="cms" element={<AdminHomeCMSPage />} />
                  <Route path="notifications" element={<AdminNotificationsPage />} />
                  <Route path="ai-assistant" element={<AdminAIAssistantPage />} />
                  {/* Redirect /admin to /admin/dashboard */}
                  <Route index element={<AdminDashboard />} />
                </Route>

                {/* Teacher Routes */}
                <Route path="/teacher/login" element={<TeacherLoginPage />} />
                <Route path="/teacher" element={<TeacherLayout />}>
                  <Route path="dashboard" element={<TeacherDashboard />} />
                  <Route path="courses" element={<TeacherCoursesPage />} />
                  <Route path="courses/create" element={<CourseCreationPayment />} />
                  <Route path="courses/:id/edit" element={<TeacherCourseEditor />} />
                  <Route path="students" element={<TeacherStudentsPage />} />
                  <Route path="olympiads" element={<TeacherOlympiadsPage />} />
                  <Route path="olympiads/:id/results" element={<TeacherOlympiadResultsPage />} />
                  <Route path="messages" element={<TeacherMessagesPage />} />
                  <Route path="onboarding" element={<TeacherOnboarding />} />
                  <Route index element={<TeacherDashboard />} />
                </Route>

                <Route path="/verify/:id" element={<CertificateVerify />} />
                <Route path="/payment-gateway/:provider/:paymentId" element={<MockPaymentPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );

};

export default App;
